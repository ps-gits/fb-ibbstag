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


export interface BookingCabsEntitlement{
  _id: string;
  pnrcode:string;
  uuid: string;
  refPassanger:string;
  refSegment: string;
}

export interface BookingStatus{
  _id: string;
  pnrcode:string;
  uuid: string;
  refPassanger:string;
  refSegment: string;
}
