import { IsNotEmpty,IsNumber,IsString,ArrayUnique,IsObject,IsBoolean} from 'class-validator';

export class passengerDetailsDto {
  @IsNotEmpty()
  @IsString()
  PassengerType: string;
  @IsNotEmpty()
  @IsString()
  Firstname: string;
  @IsNotEmpty()
  @IsString()
  Surname: string; 
  Ref: string;
  RefClient:string;
  
  CivilityCode:string; 
}

export class SpecialServicesDto {
  INFT: string;
  CHLD: string;
  UMNR: string;
  EXTADOB: string;
  CTCE: string;
  CTCM: string;
  CTCH: string;
  CTCF: string;
  FOID: string;
  DOCA: string;
  PCTC: string; 
  EXTECTC: string;
  BAGR: string;
}
export class DocumentsDto {
  public departure: Array<String>; 
  public arrival: Array<String>; 
} 
export class CreateBooking {
  public PassengerDetails: passengerDetailsDto;
  public SpecialServices: SpecialServicesDto;
  public Documents: DocumentsDto;

}
 
export class RefETTicketFare {
  public RefETTicketFare: any[]; 
}
export class SeatMap {
  public arrival: any[];
  public departure: any[];
}
export class MealsDetails {
  public arrival: any[];
  public departure: any[];
}

export class SpecialRequestDetails {
  public arrival: any[];
  public departure: any[];
}
export class BaggegeDetails {
  public arrival: any[];
  public departure: any[];
}
 
 
export class CreateBookingDto {
  @ArrayUnique()
  public booking: CreateBooking[]; 
  @IsString()
  public RefItinerary :String; 
  @IsString()
  public Ref :String;
  @IsObject()
  public SeatMap:SeatMap; 
  @IsObject()
  public MealsDetails:MealsDetails;
  @IsObject()
  public SpecialRequestDetails:SpecialRequestDetails;
  @ArrayUnique()
  public EMDTicketFareOptions: EMDTicketFareOptions[];
 // @ArrayUnique()
  //public AncillaryData: AncillaryData[];
   
}
export class AncillaryData{
  @IsString()
  public AncillaryCode:String;
  @IsString()
  public RefPassenger:String;
  @IsString()
  public RefSegment:String;
}
export class EMDTicketFareOptions{
  @IsString()
  public AncillaryCode:String;
}
// export class checkInPassengers{
//   @IsString()
//   public AncillaryCode:String;
// }


export class CreateBookingExchangeDto {
  @ArrayUnique()
  public booking: CreateBooking[]; 
  @IsString()
  public RefItinerary :String; 
  @IsString()
  public Ref :String; 
  @IsString()
  public PnrCode :String;
  @IsString()
  public PassangerLastname :String; 
  @ArrayUnique()
  public RefETTicketFare :RefETTicketFare[];
  @ArrayUnique()
  public EMDTicketFareOptions: EMDTicketFareOptions[];
  @IsObject()
  public SeatMap:SeatMap; 
  @IsObject()
  public MealsDetails:MealsDetails; 
  @IsObject()
  public SpecialRequestDetails:SpecialRequestDetails;
} 

export class loadBookingDto {
  public TypeCode: string;
  public ID: string;
  public PassengerName: string; 
}
export class checkinBookingDto {
  public TypeCode: string;
  public ID: string;
  public PassengerName: string; 
  
}

export class cabsBookingDto {
  public TypeCode: string;
  public ID: string;
  public PassengerName: string; 
}


export class calendarDto {
  public StartDate: string;
  public EndDate: string;
  public OriginCode: string;
  public DestinationCode: string;
}
export class ModifyBookingDto {
  @ArrayUnique()
  public booking: CreateBooking[]; 
  @IsString()
  public PnrCode :String;
  @IsString()
  public PassengerName :String;
  @IsObject()
  public SeatMap:SeatMap; 
  @IsObject()
  public MealsDetails:MealsDetails;
  @IsObject()
  public SpecialRequestDetails:SpecialRequestDetails;
  @IsObject()
  public BaggageDetails:BaggageDetails;

  @ArrayUnique()
  public EMDTicketFareOptions: EMDTicketFareOptions[]; 
    
}
export class SearchBookingDto {
  @IsString()
  public CustomerRef :string;
}

export class PrepareBookingModiDto {
  @IsString()
  public TypeCode: string;
  
  @IsString()
  public ID: string;

  @IsString()
  public PassengerName: string;

  @ArrayUnique()
  public checkInPassengers: Array<String>; 
}

export class CreateTicketDto {
  @IsNumber()
  public Amount: number;
  
  @IsString()
  public ID: string;

  @IsString()
  public PassengerName: string;
 
}


export class LoadMCOTicketDto {
  @IsString()
  public CurrencyCode: string;
  
  @IsString()
  public Login: string;

  @IsString()
  public RefCustomer: string;

  @IsString()
  public PnrCode: string;

  @IsString()
  public DocumentNumber: string;
}

export class SendTicketConfirmationDto{
  @IsString()
  public TypeCode: string;
  
  @IsString()
  public ID: string;
  
  @IsString()
  public PassengerName: string;
  
  @IsString()
  public ToAddress: string; 
  
}



export class AddItineraryDto {
  @IsObject()
  public SpecialServices: SpecialServicesDto;

  @ArrayUnique()
  public Documents: DocumentsDto;

  @IsString()
  public RefItinerary :String;

  @IsString()
  public Ref :String;

  @IsString()
  public TypeCode: String;

  @IsString()
  public ID: String;

  @IsString()
  public PassengerName:String;
  
  @ArrayUnique()
  public Segments: Array<String>;

  @IsString()
  public PromoCode: string; 
 
}
 
export class PrepareAdditionalItineraryDto{
   

  @IsString()
  public RefItinerary :String;

  @IsString()
  public Ref :String;

  @IsString()
  public TypeCode: String;

  @IsString()
  public ID: String;

  @IsString()
  public PassengerName:String;
  
  @ArrayUnique()
  public Segments: Array<String>;

  @IsString()
  public PromoCode: string;
 
}


export class CancelBookingDto { 
 
  @IsString()
  public PnrCode: string;

  @IsString()
  public PassengerName: string; 
  
}

 

export class PrepareCancelBookingDto { 
  @IsString()
  public PnrCode: string;

  @IsString()
  public PassengerName: string; 
  @IsBoolean()
  public HasPartners: boolean; 
  
}

export class paymentRequestDto{
  @IsNumber()
  public amount: number;
  @IsString()
  public PnrCode: string;
  @IsString()
  public cpd_code: string;
}

export class PaymentCheckDto{
  @IsString()
  public amount: string;
  public sale_currency: string;
  public hmac: string;
  public 'payment-method':string;
  public orderid:string;
  public 'card-number': string;
  public 'card-holder-name': string;
  
}

export class HeadersDto{
  public 'x-transaction-id': string;
 
}

export class CabsbookDto{
  @IsString()
  public 'uuid': string;
  public 'event': string;
  public 'payload': string;
}


export class FlightStatusRequestDto{
  @IsString()
  public 'uuid': string;
  public 'event': string;
  public 'payload': string;
}



