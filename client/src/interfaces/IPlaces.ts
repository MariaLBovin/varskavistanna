interface LatLng {
    lat: number;
    lng: number;
  }
  
  interface Place {
    geometry: {
      location: LatLng;
    };
    name: string;
    vicinity: string;
  }
  
export interface PlacesResponse {
    results: Place[];
  }
  