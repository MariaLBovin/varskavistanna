export interface Car {
    model: string;
    battery: string;
    range: string;
    charge_time: string;
  }
  
  export interface CarBrandData {
    [brand: string]: Car[];
  }
  
  export interface CarData {
    cars: CarBrandData;
  }
