export interface ChargingStation {
    business_status?: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    icon?: string;
    name: string;
    photos?: Array<{ photo_reference: string }>;
    place_id: string;
    plus_code?: {
      compound_code: string;
      global_code: string;
    };
    rating?: number;
    reference: string;
    types: string[];
    user_ratings_total?: number;
    vicinity?: string;
  }
  