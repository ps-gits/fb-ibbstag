export interface Booking {
  Passengers: object;
  Amount:object;
  OriginDestination: Array<String>;
  PnrInformation:object;
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