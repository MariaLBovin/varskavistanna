import { IChargingStation } from "./IChargingStations";

export interface IResultContainerProps {
    chargingStops: IChargingStation[];
    remainingBattery: number[];
    startAdress: string;
    endAddress: string;
    finalBattery: number
  }