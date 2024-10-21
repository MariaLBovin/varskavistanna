import axios from 'axios';

export const fetchNearbyPlaces = async (lat: number, lng: number, type: string) => {
  try {
    console.log(type);
    
    const response = await axios.get('https://nearbyplaces-onglaqeyia-uc.a.run.app', {
      params: {
        latitude: lat,
        longitude: lng,
        type: type,
        radius: '500' 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered places:', error);
    return [];
  }
};
