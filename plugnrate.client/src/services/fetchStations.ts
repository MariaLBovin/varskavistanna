import axios from "axios";
import { IChargingStation } from "../interfaces/IChargingStations";

export const fetchStations = async (
  stopLatLng: google.maps.LatLng
): Promise<IChargingStation[]> => {
  const lat = stopLatLng.lat();
  const lng = stopLatLng.lng();

  try {


    const response = await axios.get<IChargingStation[]>("https://chargingstations-onglaqeyia-uc.a.run.app", {
      params: {
        latitude: lat,
        longitude: lng,
        radius: 10,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching charging stations:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request data:', error.request);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
};
