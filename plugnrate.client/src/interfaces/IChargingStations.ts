export interface IChargingStation {
  id: number;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    AddressLine2?: string | null;
    Town: string;
    Postcode?: string | null;
    Country: {
      Title: string;
    };
    Latitude: number;
    Longitude: number;
  };
  Connections: Array<{
    Level: {
      IsFastChargeCapale: boolean;
    };
  }>;
  NumberOfPoints: number;
  StatusType: {
    IsOperational?: boolean | null;
  };
  OperatorInfo: {
    Title: string,
  }
}
