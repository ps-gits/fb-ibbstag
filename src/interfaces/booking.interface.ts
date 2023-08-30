export interface Booking {
  PassengersDetails: PassengerDetails[];
  Passengers: PassengersData;
  Amount: AmountData;
  OriginDestination: OriginDestinationData[];
  PnrInformation: PnrInformationData;
  RefETTicketFare: RefETTicketFareData[];
  SeatMaps: SeatMapData[];
  FareRules: FareRulesData;
}

interface PassengerDetails {
  // Define properties of PassengerDetails here...
}

interface PassengersData {
  // Define properties of PassengersData here...
}

interface AmountData {
  // Define properties of AmountData here...
}

interface OriginDestinationData {
  // Define properties of OriginDestinationData here...
}

interface PnrInformationData {
  // Define properties of PnrInformationData here...
}

interface RefETTicketFareData {
  // Define properties of RefETTicketFareData here...
}

interface SeatMapData {
  // Define properties of SeatMapData here...
}

interface FareRulesData {
  // Define properties of FareRulesData here...
}

 
  export interface LoadBooking {
    Passengers: object;
    Amount:object;
    OriginDestination: Array<String>;
    PnrInformation:object;
  }  
  
  export interface Calendar {
    OriginDestinationQueries: object;
  }  
  export class CreateBooking {
    public Offer: object;
    public SpecialServices: Array<String>;
    public FareInfo: object;
    public Passengers: Array<String>;
    public RequestInfo: object;
  }

  
export class Payment{
  public html: string;
}



export interface BookingHistory{
  _id: string;
  pnrcode:string;
  name: string;
  surname:string;
  origin: string;
  destination: string;
  originDate: string;
  destinationDate: string; 
}