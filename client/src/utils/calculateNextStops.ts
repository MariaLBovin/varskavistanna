import { IChargingStation } from "../interfaces/IChargingStations";
import { getDistanceBetweenPoints } from "../services/fetchDistanceBetweenPoints";
import { findNextChargingStop } from "./findNextChargingStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateNextStops = async (
  route: google.maps.DirectionsRoute,
  remainingDistance: number,
  totalDistanceKm: number,
  carRange: number,
  currentBattery: number,
  selectedFilter: string | null,
  firstStop: IChargingStation | null
): Promise<{
  chargingStations: IChargingStation[];
  finalBattery: number;
  finalDistance: number;
  remainingDistance: number;
  batteryLevels: number[];
}> => {
  if (!firstStop) {
    return {
      chargingStations: [],
      finalBattery: currentBattery,
      finalDistance: remainingDistance,
      remainingDistance,
      batteryLevels: [100],
    };
  }

  const nextStopRange = carRange * 0.65;

  const batteryLevels: number[] = [currentBattery];
  const chargingStations: IChargingStation[] = [];
  let previousStop = new google.maps.LatLng(
    firstStop.location.latitude,
    firstStop.location.longitude
  );

  let totalBatteryUsed = 0;
  let radius = 20000;

  while (remainingDistance > nextStopRange) {
    const nextStopKm = Math.round(
      totalDistanceKm - remainingDistance + nextStopRange
    );

    const nextStopPosition = getStopLatLng(route, nextStopKm);

    if (!nextStopPosition) {
      return {
        chargingStations: [],
        remainingDistance: 0,
        finalBattery: 100,
        finalDistance: totalDistanceKm,
        batteryLevels: batteryLevels,
      };
    }

    const nearestStop = await findNextChargingStop(
      nextStopPosition.toJSON(),
      selectedFilter,
      radius
    );

    if (!nearestStop) {
      radius += 1000;
      return {
        chargingStations: [],
        remainingDistance: 0,
        finalBattery: 100,
        finalDistance: totalDistanceKm,
        batteryLevels: batteryLevels,
      };
    }

    chargingStations.push(nearestStop);

    const stopLatLng = new google.maps.LatLng(
      nearestStop.location.latitude,
      nearestStop.location.longitude
    );

    const distanceInMeters = await getDistanceBetweenPoints(
      previousStop.toJSON(),
      stopLatLng.toJSON()
    );

    const distanceInKm = Math.round(distanceInMeters / 1000);

    const batteryUsed = (distanceInKm / carRange) * 100;

    const nextBatteryLeft = Math.round(currentBattery - batteryUsed);

    remainingDistance -= distanceInKm;
    previousStop = stopLatLng;
    totalBatteryUsed = batteryUsed;
    currentBattery = 80;

    batteryLevels.push(nextBatteryLeft);
  }

  currentBattery = 80;

  if (remainingDistance > 0) {
    const distanceInKm = remainingDistance;
    const batteryUsedForFinalLeg = (distanceInKm / carRange) * 100;

    const finalBattery = Math.round(currentBattery - batteryUsedForFinalLeg);

    batteryLevels.push(finalBattery);

    return {
      chargingStations,
      finalBattery,
      finalDistance: totalDistanceKm,
      remainingDistance: 0,
      batteryLevels,
    };
  }

  const finalBattery = Math.max(0, currentBattery - totalBatteryUsed);

  return {
    chargingStations,
    finalBattery,
    finalDistance: remainingDistance,
    remainingDistance,
    batteryLevels,
  };
};
