import { IChargingStation } from "./IChargingStations";

export interface IResultContainerProps {
    chargingStops: IChargingStation[];
    remainingBattery: number;
    batteryBeforeStops: number[];
    startAdress: string;
    endAddress: string;
  }