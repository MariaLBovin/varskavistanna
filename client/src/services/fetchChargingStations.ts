import axios from "axios";
import { IChargingStation } from "../interfaces/IChargingStations";


export const fetchChargingStations = async (latitude: number, longitude: number, radius: number): Promise<IChargingStation[]> => {

  try {
    const response = await axios.get<IChargingStation[]>("https://chargingstations-onglaqeyia-uc.a.run.app", {
      params: {
        latitude,
        longitude,
        radius,
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
