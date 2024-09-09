import { fetchChargingStations } from "../services/fetchChargingStations";
import { calculateChargingStops } from "./calculateChargingstops";

const SEARCH_RADIUS_KM = 20;

export const fetchAndSetRouteData = async (
  origin: string,
  destination: string,
  setDirectionsResponse: (
    response: google.maps.DirectionsResult | null
  ) => void,
  setDistance: (distance: string) => void,
  setDuration: (duration: string) => void,
  carRange: number,
  setNearestChargingStations: (stations: google.maps.LatLngLiteral[]) => void
) => {
  const directionService = new google.maps.DirectionsService();

  try {
    const results = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (results?.routes?.length) {
      const leg = results.routes[0].legs[0];
      const totalDistance = leg.distance?.value || 0;
      const totalDistanceKm = totalDistance / 1000;

      console.log(`Totalt avstånd: ${totalDistanceKm} km`);

      const { stops } = calculateChargingStops(
        totalDistanceKm,
        carRange,
        100,
        10,
        80
      );
      console.log(stops);

      const chargingStationsPromises = stops.map(async (stopDistance) => {
        let accumulatedDistance = 0;
        let stopLatLng: google.maps.LatLng | null = null;

        for (const step of leg.steps) {
          const stepDistanceKm = (step.distance?.value || 0) / 1000;
          accumulatedDistance += stepDistanceKm;

          if (accumulatedDistance >= stopDistance) {
            const progress =
              (stopDistance - (accumulatedDistance - stepDistanceKm)) /
              stepDistanceKm;
            const startLatLng = step.start_location;
            const endLatLng = step.end_location;

            const lat =
              startLatLng.lat() +
              (endLatLng.lat() - startLatLng.lat()) * progress;
            const lng =
              startLatLng.lng() +
              (endLatLng.lng() - startLatLng.lng()) * progress;

            console.log(
              `Beräknad position för laddstopp vid ${stopDistance} km: Lat: ${lat}, Lng: ${lng}`
            );

            stopLatLng = new google.maps.LatLng(lat, lng);
            break;
          }
        }

        if (stopLatLng) {
          try {
            const { lat, lng } = stopLatLng;
            const stations = await fetchChargingStations(
              lat(),
              lng(),
              SEARCH_RADIUS_KM
            );
            console.log(`Laddstation vid ${stopDistance} km:`, stations);

            return { position: { lat: lat(), lng: lng() }, stations };
          } catch (fetchError) {
            console.error(
              `Error fetching charging stations for stop at ${stopDistance} km`,
              fetchError
            );
            return {
              position: { lat: stopLatLng.lat(), lng: stopLatLng.lng() },
              stations: [],
            };
          }
        }

        console.warn(`Inget steg funnet för laddstopp vid ${stopDistance} km`);
        return { position: null, stations: [] };
      });

      const chargingStationsResults = await Promise.all(
        chargingStationsPromises
      );

      const allChargingStations = chargingStationsResults
        .flatMap((result) => result.stations || [])
        .map(
          (station: {
            AddressInfo?: { Latitude: number; Longitude: number };
          }) => ({
            lat: station.AddressInfo?.Latitude || 0,
            lng: station.AddressInfo?.Longitude || 0,
          })
        );

      const findNearestChargingStations = (
        position: google.maps.LatLngLiteral
      ) => {
        const distances = allChargingStations.map((station) => {
          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(position.lat, position.lng),
              new google.maps.LatLng(station.lat, station.lng)
            );
          return { station, distance };
        });

        const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
        return nearest.station;
      };

      const nearestStations = chargingStationsResults
        .filter((result) => result.position)
        .map((result) => findNearestChargingStations(result.position!))
        .filter((station) => station !== undefined);

      setDistance(leg.distance?.text || "Distance not available");
      setDuration(leg.duration?.text || "Duration not available");
      setDirectionsResponse(results);
      setNearestChargingStations(nearestStations);
    } else {
      console.error("No route found");
    }
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
