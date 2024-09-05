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
  carRange: number
) => {
  const directionService = new google.maps.DirectionsService();

  try {
    // Steg 1: Hämta ruttdetaljer
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

      console.log("Beräknade laddstopp vid: ", stops);

      const chargingStationsPromises = stops.map((stopDistance) => {
        let accumulatedDistance = 0;
        const step = leg.steps.find((step) => {
          const stepDistanceKm = (step.distance?.value || 0) / 1000;
          accumulatedDistance += stepDistanceKm;
          console.log(
            `Ackumulerat avstånd: ${accumulatedDistance} km, Sök avstånd: ${stopDistance} km`
          );
          return accumulatedDistance >= stopDistance;
        });

        if (step) {
          const { lat, lng } = step.end_location;
          console.log(`Hämtar laddstationer vid: (${lat()}, ${lng()})`);

          return fetchChargingStations(lat(), lng(), SEARCH_RADIUS_KM);
        }

        console.warn(`Inget steg funnet för laddstopp vid ${stopDistance} km`);
        return Promise.resolve([]);
      });

      const chargingStations = await Promise.all(chargingStationsPromises);
      console.log("Laddstationer vid laddstopp:", chargingStations.flat());

      setDistance(leg.distance?.text || "Distance not available");
      setDuration(leg.duration?.text || "Duration not available");
      setDirectionsResponse(results);
    } else {
      console.error("No route found");
    }
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
