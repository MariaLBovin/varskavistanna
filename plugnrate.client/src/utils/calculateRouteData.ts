// calculateRouteData.ts
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
  setNearestChargingStations: (stations: IChargingStation[], remainingBattery: number, batteryBeforeStops: number[]) => void,
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

    let remainingDistance = totalDistanceKm;
    let currentBattery = 100;
    const chargingStations: IChargingStation[] = [];

    // Beräkna första stoppet
    const { stop: firstStop, remainingDistance: afterFirstStopDistance, currentBattery: afterFirstStopBattery } = 
    await calculateFirstStop(leg, carRange, selectedFilter);
    if (firstStop) {
      chargingStations.push(firstStop);
      remainingDistance = afterFirstStopDistance;
      currentBattery = afterFirstStopBattery;
    }

    // Beräkna efterföljande stopp
    const { chargingStations: nextChargingStations, currentBattery: updatedBattery } = 
    await calculateNextStops(
      leg,
      remainingDistance,
      totalDistanceKm,
      carRange,
      currentBattery,
      selectedFilter
    );
    
    
    // Slå samman laddstationer från första stoppet och efterföljande stopp
    chargingStations.push(...nextChargingStations);
    console.log(chargingStations);
    currentBattery = updatedBattery;

    setDistance(leg.distance?.text || "Distance not available");
    setDuration(leg.duration?.text || "Duration not available");
    setDirectionsResponse(results);
    setNearestChargingStations(chargingStations, currentBattery, []);
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
