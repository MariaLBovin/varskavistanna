import { IChargingStation } from "../interfaces/IChargingStations";
import { getDistanceBetweenPoints } from "../services/fetchDistanceBetweenPoints";
import { findNextChargingStop } from "./findNextChargingStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateFirstStop = async (
  leg: google.maps.DirectionsLeg,
  carRange: number,
  selectedFilter: string | null,
  route: google.maps.DirectionsRoute
): Promise<{
  firstStop: IChargingStation | null;
  remainingDistance: number;
  currentBattery: number;
  batteryLeft: number;
}> => {
  const totalDistance = (leg.distance?.value || 0) / 1000;
  const requiredRange = totalDistance > carRange * 0.85;
  
  if (!requiredRange) {
    const batteryUsed = (totalDistance / carRange) * 100;
    const remainingBattery = Math.max(0, 100 - batteryUsed);

    return {
      firstStop: null,
      remainingDistance: totalDistance,
      currentBattery: 100,
      batteryLeft: remainingBattery,
    };
    
  }

  const firstStopRange = carRange * 0.85;
  const firstStopPosition = getStopLatLng(route, firstStopRange);

  let currentBattery = 100;
  const radius = 20000;
  
  if (!firstStopPosition) {
    return {
      firstStop: null,
      remainingDistance: totalDistance,
      currentBattery,
      batteryLeft: currentBattery,
    };
  }
  
  const nearestStop = await findNextChargingStop(
    firstStopPosition.toJSON(),
    selectedFilter,
    radius
  );

  if (!nearestStop) {
    const batteryUsed = (totalDistance / carRange) * 100;
    currentBattery = Math.max(0, currentBattery - batteryUsed);

    return {
      firstStop: null,
      remainingDistance: totalDistance,
      currentBattery,
      batteryLeft: currentBattery,
    };
  }

  const startLatLng = new google.maps.LatLng(
    leg.start_location.lat(),
    leg.start_location.lng()
  );

  const stopLatLng = new google.maps.LatLng(
    nearestStop.location.latitude,
    nearestStop.location.longitude
  );

  const distanceInMeters = await getDistanceBetweenPoints(
    startLatLng.toJSON(),
    stopLatLng.toJSON()
  );
  const distanceInKm = Math.round(distanceInMeters / 1000);

  const batteryUsed = (distanceInKm / carRange) * 100;
  const batteryLeft = Math.round(currentBattery - batteryUsed);
  currentBattery = 80;

  const remainingDistance = totalDistance - distanceInKm;

  return {
    firstStop: nearestStop,
    remainingDistance,
    currentBattery,
    batteryLeft,
  };
};
