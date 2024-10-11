import { IChargingStation } from "../interfaces/IChargingStations"; 
import { calculateFirstStop } from "./calculateFirstStop";
import { calculateNextStops } from "./calculateNextStops";

export const calculateRouteData = async (
  origin: string,
  destination: string,
  setDirectionsResponse: (response: google.maps.DirectionsResult | null) => void,
  setDistance: (distance: string) => void,
  setDuration: (duration: string) => void,
  carRange: number,
  setNearestChargingStations: (stations: IChargingStation[], remainingBattery: number[], remainingDistance: number) => void,
  selectedFilter: string | null
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


    const { firstStop, remainingDistance, currentBattery, batteryLeft } = await calculateFirstStop(leg, carRange, selectedFilter);
    if (!firstStop) {
      console.error("No charging station found for the first stop.");
      return;
    }

    const { chargingStations, batteryLevels } = await calculateNextStops(
      leg,
      remainingDistance,
      totalDistanceKm,
      carRange,
      currentBattery,
      selectedFilter,
      firstStop
    );


    const allStops = [{ station: firstStop, remainingBattery: batteryLeft }, 
      ...chargingStations.map((station, index) => ({
        station,
        remainingBattery: batteryLevels[index + 1]
      }))
    ];

    console.log(allStops);

    setDistance(leg.distance?.text || "Distance not available");
    setDuration(leg.duration?.text || "Duration not available");
    setDirectionsResponse(results);

    setNearestChargingStations(
      allStops.map(stop => stop.station),
      allStops.map(stop => stop.remainingBattery),
      remainingDistance
    );

  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
