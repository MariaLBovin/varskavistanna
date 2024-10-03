
import { IChargingStation } from "../interfaces/IChargingStations";
import { calculateBatteryAndDistance } from "./calculateBatteryAndDistance";
import { findNextChargingStop } from "./findNextChargingStop";
import { getStopLatLng } from "./getStopsLatLang";

export const calculateFirstStop = async (
  leg: google.maps.DirectionsLeg,
  carRange: number,
  selectedFilter: string | null
): Promise<{ stop: IChargingStation | null; remainingDistance: number; currentBattery: number }> => {
  const firstStopRange = carRange * 0.85;
  const firstStopPosition = getStopLatLng(leg, firstStopRange);

  if (!firstStopPosition) {
    return { stop: null, remainingDistance: 0, currentBattery: 100 };
  }

  const nearestStop = await findNextChargingStop(firstStopPosition.toJSON(), selectedFilter);
  if (!nearestStop) {
    return { stop: null, remainingDistance: 0, currentBattery: 100 };
  }

  const { battery: batteryAfterFirstStop, distanceDriven } = calculateBatteryAndDistance(
    leg.start_location,
    new google.maps.LatLng(nearestStop.AddressInfo.Latitude, nearestStop.AddressInfo.Longitude),
    carRange,
    100
  );

  const remainingDistance = (leg.distance?.value || 0) / 1000 - distanceDriven;
  return { stop: nearestStop, remainingDistance, currentBattery: batteryAfterFirstStop };
};
