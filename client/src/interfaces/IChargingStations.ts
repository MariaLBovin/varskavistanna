export interface IChargingStation {
  shortFormattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string; 
  };
}
