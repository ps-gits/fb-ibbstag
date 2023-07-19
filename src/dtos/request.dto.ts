interface FlightRequestData {
    request: {
      Passengers: number;
      OriginDestinations: OriginDestination[];
      FareDisplaySettings: FareDisplaySettings;
      RequestInfo: RequestInfo;
      Extensions: any; // Adjust the type based on the actual extensions data structure
    };
  }
  
  interface OriginDestination {
    TargetDate: string;
    OriginCode: string;
    DestinationCode: string;
  }
  
  interface FareDisplaySettings {
    RewardSearch: boolean;
    SaleCurrencyCode: string;
    FareLevels: any; // Adjust the type based on the actual fare levels data structure
    FarebasisCodes: any; // Adjust the type based on the actual fare basis codes data structure
    WebClassesCodes: any; // Adjust the type based on the actual web classes codes data structure
    FareVisibilityCode: any; // Adjust the type based on the actual fare visibility code data structure
    ShowWebClasses: boolean;
    PromoCode: any; // Adjust the type based on the actual promo code data structure
    ManualCombination: boolean;
    Extensions: any; // Adjust the type based on the actual extensions data structure
  }
  
  interface RequestInfo {
    AuthenticationKey: string;
    CultureName: string;
  }