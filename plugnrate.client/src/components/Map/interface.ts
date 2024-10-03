import { IChargingStation } from "../../interfaces/IChargingStations";

export interface IMapsComponentProps {
    directionsResponse: google.maps.DirectionsResult | null;
    center: google.maps.LatLngLiteral;
    chargingStations: IChargingStation[];
  }