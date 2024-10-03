// calculateNextStops.ts
import { IChargingStation } from "../interfaces/IChargingStations";
import { calculateBatteryAndDistance } from "./calculateBatteryAndDistance";
import { findNextChargingStop } from "./findNextChargingStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateNextStops = async (
  leg: google.maps.DirectionsLeg,
  remainingDistance: number,
  totalDistanceKm: number,
  carRange: number,
  currentBattery: number,
  selectedFilter: string | null
): Promise<{
  chargingStations: IChargingStation[];
  currentBattery: number;
}> => {
  const nextStopRange = carRange * 0.65;
  const chargingStations: IChargingStation[] = [];
  let stop = null;

  const nextStop = Math.round(
    totalDistanceKm - remainingDistance + nextStopRange
  );
  
  while (remainingDistance > nextStopRange) {
    const nextStopPosition = getStopLatLng(
      leg,
      nextStop
    );
    console.log(nextStopPosition);
    
    
    if (!nextStopPosition) break;

    const nearestStop = await findNextChargingStop(
      nextStopPosition.toJSON(),
      selectedFilter
    );

    if (!nearestStop) break;

    chargingStations.push(nearestStop);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { battery: batteryAfterNextStop, distanceDriven } =
      calculateBatteryAndDistance(
        new google.maps.LatLng(
          stop?.AddressInfo.Latitude || 0,
          stop?.AddressInfo.Longitude || 0
        ),
        new google.maps.LatLng(
          nearestStop.AddressInfo.Latitude,
          nearestStop.AddressInfo.Longitude
        ),
        carRange,
        currentBattery
      );

    // currentBattery = 80; 
    remainingDistance -= distanceDriven;
    stop = nearestStop;
  }

  return { chargingStations, currentBattery };
};
