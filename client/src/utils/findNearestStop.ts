import { IChargingStation } from "../interfaces/IChargingStations";
import { getDistanceBetweenPoints } from "../services/fetchDistanceBetweenPoints"; 

export const findNearestStop = async (
  position: google.maps.LatLngLiteral,
  stations: IChargingStation[]
): Promise<IChargingStation | null > => {
  if (stations.length === 0) return null;
  console.log(stations);
  
  try {
    const distancePromises = stations.map(async (station) => {
      const distance = await getDistanceBetweenPoints(
        { lat: position.lat, lng: position.lng }, 
        { lat: station.location.latitude, lng: station.location.longitude }
      ); 
      return { station, distance };
    });

    const distances = await Promise.all(distancePromises);
    
    const validDistances = distances.filter((d) => d.distance !== null);

    if (validDistances.length === 0) return null;

    const nearest = validDistances.sort((a, b) => a.distance! - b.distance!)[0];

    return nearest.station;
  } catch (error) {
    console.error("Error finding nearest stop:", error);
    return null;
  }
};
