export interface ChargingStation {
  id: number;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    AddressLine2?: string | null;
    Town: string;
    StateOrProvince?: string | null;
    Postcode?: string | null;
    Country: {
      ISOCode: string;
      Title: string;
    };
    Latitude: number;
    Longitude: number;
  };
  Connections: Array<{
    ConnectionType: {
      Id: number;
      Title: string;
    };
    Level: {
      Id: number;
      Title: string;
      Comments?: string;
    };
    CurrentType: {
      Id: number;
      Title: string;
    };
    PowerKW: number;
  }>;
  DataProvider: {
    WebsiteURL?: string;
    Comments?: string;
    DataProviderStatusType?: {
      Id: number;
      Title: string;
    };
  };
  NumberOfPoints: number;
  StatusType: {
    IsOperational?: boolean | null;
    IsUserSelectable: boolean;
    Title: string;
  };
  SubmissionStatus: {
    IsLive: boolean;
    Title: string;
  };
  DateCreated: string;
  DateLastStatusUpdate: string;
  UsageCost?: string | null;
  GeneralComments?: string | null;
}
