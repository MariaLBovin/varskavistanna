import { ChargingStation } from "../interfaces/IChargingStations";
import { fetchStations } from "../services/fetchStations";
import { calculateChargingStops } from "./calculateChargingstops";
import { findNearestStation } from "./findNearestStop";
import { getStopLatLng } from "./getStopsLatLang";

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

    if (!results?.routes?.length) {
      return console.error("No route found");
    }

    const leg = results.routes[0].legs[0];
    const totalDistanceKm = (leg.distance?.value || 0) / 1000;

    console.log(`Totalt avstånd: ${totalDistanceKm} km`);

    const { stops } = calculateChargingStops(totalDistanceKm, carRange, 100, 10, 80);

    const chargingStationsPromises = stops.map(async (stopDistance: number) => {
      const stopLatLng = getStopLatLng(leg, stopDistance);

      if (!stopLatLng) {
        console.warn(`Inget steg funnet för laddstopp vid ${stopDistance} km`);
        return { position: null, stations: [] };
      }

      const stations = await fetchStations(stopLatLng);
      return { position: { lat: stopLatLng.lat(), lng: stopLatLng.lng() }, stations };
    });

    const chargingStationsResults = await Promise.all(chargingStationsPromises);

    const allChargingStations = chargingStationsResults
      .flatMap((result: { stations: ChargingStation[]; }) => result.stations || [])
      .map((station: ChargingStation) => ({
        lat: station.geometry.location.lat || 0,
        lng: station.geometry.location.lng || 0,
      }));

    const nearestStations = chargingStationsResults
      .filter((result) => result.position)
      .map((result) => findNearestStation(result.position!, allChargingStations))
      .filter((station) => station !== undefined);

    setDistance(leg.distance?.text || "Distance not available");
    setDuration(leg.duration?.text || "Duration not available");
    setDirectionsResponse(results);
    setNearestChargingStations(nearestStations);
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
