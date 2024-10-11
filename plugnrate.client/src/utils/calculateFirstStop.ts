
import { IChargingStation } from "../interfaces/IChargingStations";
import { getDistanceBetweenPoints } from "../services/fetchDistanceBetweenPoints";
import { findNextChargingStop } from "./findNextChargingStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateFirstStop = async (
  leg: google.maps.DirectionsLeg,
  carRange: number,
  selectedFilter: string | null
): Promise<{
  firstStop: IChargingStation | null;
  remainingDistance: number;
  currentBattery: number;
  batteryLeft: number;
}> => {
  const firstStopRange = carRange * 0.85;
  
  const firstStopPosition = getStopLatLng(leg, firstStopRange);
  let currentBattery = 100;
  let radius = 20;

  if (!firstStopPosition) {
    radius += 10;
    return {
      firstStop: null,
      remainingDistance: 0,
      currentBattery: 100,
      batteryLeft: 100,

    };
  }
  const nearestStop = await findNextChargingStop(
    firstStopPosition.toJSON(),
    selectedFilter,
    radius
  );
  if (!nearestStop) {
    return {
      firstStop: null,
      remainingDistance: 0,
      currentBattery: 100,
      batteryLeft: 100,
    };
  }

  const startLatLng = new google.maps.LatLng(
    leg.start_location.lat(),
    leg.start_location.lng()
  );
  
  const stopLatLng = new google.maps.LatLng(
    nearestStop.AddressInfo.Latitude,
    nearestStop.AddressInfo.Longitude
  );

  const distanceInMeters = await getDistanceBetweenPoints(startLatLng.toJSON(), stopLatLng.toJSON());

  const distanceInKm = Math.round(distanceInMeters / 1000);
  
  const batteryUsed = (distanceInKm / carRange) * 100;
  const batteryLeft = Math.round(currentBattery - batteryUsed);
  currentBattery = 80;

  const remainingDistance = (leg.distance?.value || 0) / 1000 - distanceInKm;

  return {
    firstStop: nearestStop,
    remainingDistance,
    currentBattery,
    batteryLeft,
  };
};
