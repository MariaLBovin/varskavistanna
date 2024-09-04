import axios from 'axios';

export const fetchChargingStations = async (latitude: number, longitude: number) => {
    const API_KEY = import.meta.env.VITE_OPEN_CHARGER_KEY
    const response = await axios.get('https://api.openchargemap.io/v3/poi/', {
        params: {
            output: 'json',
            latitude: latitude,
            longitude: longitude,
            distance: 1, 
            distanceunit: 'KM',
            maxresults: 10,
            key: API_KEY
        }
        
        
    });
    console.log(response.data);
    return response.data;

}
