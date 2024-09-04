import { fetchChargingStations } from "../components/Map/fetchChargingStations";

export const fetchAndSetRouteData = async (
  origin: string,
  destination: string,
  setDirectionsResponse: (
    response: google.maps.DirectionsResult | null
  ) => void,
  setDistance: (distance: string) => void,
  setDuration: (duration: string) => void
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
      const chargingStationsPromises = leg.steps.map((step) => {
        const { lat, lng } = step.end_location;
        return fetchChargingStations(lat(), lng());
      });
      const chargingStations = await Promise.all(chargingStationsPromises);
      console.log("Laddstationer:", chargingStations.flat());

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
