import { ChargingStation } from "../interfaces/IChargingStations";
import { fetchChargingStations } from "./fetchChargingStations";

const SEARCH_RADIUS_M=2009;
export const fetchStations = async (
    stopLatLng: google.maps.LatLng
  ): Promise<ChargingStation[]> => {
    const { lat, lng } = stopLatLng;
    try {
      return (await fetchChargingStations(lat(), lng(), SEARCH_RADIUS_M)) as ChargingStation[];
    } catch (error) {
      console.error("Error fetching charging stations", error);
      return [];
    }
  };