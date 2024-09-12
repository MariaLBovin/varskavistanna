import axios from 'axios';

export const fetchNearbyPlaces = async (lat: number, lng: number, type: string) => {
  try {
    const response = await axios.get('https://us-central1-varskajagstanna-b2627.cloudfunctions.net/api/nearby-places', {
      params: {
        latitude: lat,
        longitude: lng,
        type: type,
        radius: '1500' 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered places:', error);
    return [];
  }
};
