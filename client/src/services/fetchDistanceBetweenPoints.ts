import axios from "axios";

export const getDistanceBetweenPoints = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
) => {

  const originLatLng = { lat: origin.lat, lng: origin.lng };
  const destinationLatLng = { lat: destination.lat, lng: destination.lng };
  
  try {
    const response = await axios.get('https://getdistancebetweenpoints-onglaqeyia-uc.a.run.app',{
      params: {
        originLat: originLatLng.lat,
        originLng: originLatLng.lng,
        destLat: destinationLatLng.lat,
        destLng: destinationLatLng.lng
      }
    });

    if (response) {

      const distanceInMeters = response.data.distanceInMeters;
      
      return distanceInMeters;
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
  }

  return null;
};
