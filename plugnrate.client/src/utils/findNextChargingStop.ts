import { findNearestStop } from "./findNearestStop";
import { IChargingStation } from "../interfaces/IChargingStations";
import { findWithFilter } from "./findWithFilter";

export const findNextChargingStop = async (
    stopPosition: google.maps.LatLngLiteral,
    selectedFilter: string | null
  ): Promise<IChargingStation | null> => {
  
    const stopLatLng = new google.maps.LatLng(stopPosition.lat, stopPosition.lng);
  
    const filteredStations = await findWithFilter(stopLatLng, selectedFilter);
  
    const nearestStop = findNearestStop(stopPosition, filteredStations);

    return nearestStop || null;
  };
  