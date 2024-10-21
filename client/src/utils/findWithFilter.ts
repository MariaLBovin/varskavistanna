import { IChargingStation } from "../interfaces/IChargingStations";
import { fetchNearbyPlaces } from "../services/fetchNearbyPlaces";
import { fetchStations } from "../services/fetchStations";

export const findWithFilter = async (
  position: google.maps.LatLng,
  selectedFilter: string | null,
  radius: number,
): Promise<IChargingStation[]> => {

  const stations = await fetchStations(position, radius);

  if (!selectedFilter) {
    return stations; 
  }

  const filteredStations = await Promise.all(
    stations.map(async (station: IChargingStation) => {
      const nearbyPlaces = await fetchNearbyPlaces(
        station.AddressInfo.Latitude,
        station.AddressInfo.Longitude,
        selectedFilter
      );
      return nearbyPlaces.length > 0 ? station : null;
    })
  );

  const validFilteredStations = filteredStations.filter(
    (station) => station !== null
  ) as IChargingStation[];

  return validFilteredStations.length > 0 ? validFilteredStations : stations;
};
