import { ChargingStation } from "../interfaces/IChargingStations";
import { fetchNearbyPlaces } from "../services/fetchNearbyPlaces";
import { fetchStations } from "../services/fetchStations";
import { calculateChargingStops } from "./calculateChargingstops";
import { findNearestStop } from "./findNearestStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateRouteData = async (
  origin: string,
  destination: string,
  setDirectionsResponse: (
    response: google.maps.DirectionsResult | null
  ) => void,
  setDistance: (distance: string) => void,
  setDuration: (duration: string) => void,
  carRange: number,
  setNearestChargingStations: (stations: google.maps.LatLngLiteral[]) => void,
  selectedFilter: string | null,
) => {
  const directionService = new google.maps.DirectionsService();

  try {
    const results = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (!results?.routes?.length) {
      return console.error("No route found");
    }

    const leg = results.routes[0].legs[0];
    const totalDistanceKm = (leg.distance?.value || 0) / 1000;

    console.log(`Totalt avstånd: ${totalDistanceKm} km`);

    const { stops } = calculateChargingStops(
      totalDistanceKm,
      carRange,
      100,
      10,
      80
    );

    const chargingStationsPromises = stops.map(async (stopDistance: number) => {
      const stopLatLng = getStopLatLng(leg, stopDistance);

      if (!stopLatLng) {
        console.warn(`Inget steg funnet för laddstopp vid ${stopDistance} km`);
        return { position: { lat: 0, lng: 0 }, stations: [] };
      }

      const stations = await fetchStations(stopLatLng);
      
      if (selectedFilter) {
        const filteredStations = await Promise.all(
          stations.map(async (station: ChargingStation) => {
            const nearbyPlaces = await fetchNearbyPlaces(
              station.AddressInfo.Latitude,
              station.AddressInfo.Longitude,
              selectedFilter
            );
            return nearbyPlaces.length > 0 ? station : null;
          })
        ).then((stations) => stations.filter((station) => station !== null));

        if (filteredStations.length === 0) {
          console.warn(`Inga stationer hittades för filtret "${selectedFilter}". Visar närmaste laddstationer istället.`);
          return {
            position: { lat: stopLatLng.lat(), lng: stopLatLng.lng() },
            stations: stations,
          };
        }

        console.log("Filtrerade stationer:", filteredStations);
        return {
          position: { lat: stopLatLng.lat(), lng: stopLatLng.lng() },
          stations: filteredStations,
        };
      } else {
        return {
          position: { lat: stopLatLng.lat(), lng: stopLatLng.lng() },
          stations: stations,
        };
      }
    });

    const chargingStationsResults = await Promise.all(chargingStationsPromises);

    const allChargingStations = chargingStationsResults
      .flatMap(
        (result: { stations: ChargingStation[] }) => result.stations || []
      )
      .map((station: ChargingStation) => ({
        lat: station.AddressInfo.Latitude || 0,
        lng: station.AddressInfo.Longitude || 0,
        station: station.AddressInfo.Title,
        status: station.StatusType?.Title || "Unknown"
      }));

    const nearestStations = chargingStationsResults
      .filter((result) => result.position)
      .map((result) => findNearestStop(result.position!, allChargingStations))
      .filter((station) => station !== undefined);

    console.log("Närmaste stationer:", nearestStations);

    setDistance(leg.distance?.text || "Distance not available");
    setDuration(leg.duration?.text || "Duration not available");
    setDirectionsResponse(results);
    setNearestChargingStations(nearestStations);
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
