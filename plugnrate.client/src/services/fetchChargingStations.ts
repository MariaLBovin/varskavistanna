import axios from "axios";
import { ChargingStation } from "../interfaces/IChargingStations";


export const fetchChargingStations = async (latitude: number, longitude: number, radius: number): Promise<ChargingStation[]> => {
  try {
    const response = await axios.get<ChargingStation[]>("https://us-central1-varskajagstanna-b2627.cloudfunctions.net/api/charging-stations", {
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
