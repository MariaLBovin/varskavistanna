import { findNearestStop } from "./findNearestStop";
import { IChargingStation } from "../interfaces/IChargingStations";
import { findWithFilter } from "./findWithFilter";

export const findNextChargingStop = async (
    stopPosition: google.maps.LatLngLiteral,
    selectedFilter: string | null,
    radius: number,
  ): Promise<IChargingStation | null> => {

    const stopLatLng = new google.maps.LatLng(stopPosition.lat, stopPosition.lng);
  
    const filteredStations = await findWithFilter(stopLatLng, selectedFilter, radius);
  
    const nearestStop = findNearestStop(stopPosition, filteredStations);
    console.log(nearestStop);
    
    return nearestStop || null;
  };
  