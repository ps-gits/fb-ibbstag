export interface Location {
    DestinationCodes: Location[] | PromiseLike<Location[]>;
    _id: string;
    OriginCode:string
    Code: string;
    Label: string;
    icao: String,
    iata: String,
    name: String,
    city:String,
    region: String,
    country: String,
    elevation_ft: String,
    latitude:String,
    longitude:String,
    timezone:String,
    currency:String,
    symbol:String,
    cpd_code:String
  }
  export interface EligibleOriginDestinations {
    _id: string;
    TargetDate: string;
    OriginCode: string;
    DestinationCode: string;
    Date:string;
  }  
  export interface AllowedOriginDestinations {
    _id: string;
    OriginCode: string;
    DestinationCodes: string;
  }

  export interface AirLineDetails {
    _id: string;
    AirlineDesignator:String,
    AirlineName:String, 
    AirlineLogoUrl:String,
    VendorName:String,
    VendorProfile:String,
    MaxOriginDestinationCount:Number,
    AllowPromoCode:Boolean,
    AllowCustomerManagement:Boolean, 
    AllowBookWithoutCustomer:Boolean, 
    AllowSeating:Boolean, 
    AllowCancelSegment:Boolean, 
    AllowToPayInAccount:Boolean,  
    AllowExchange:Boolean, 
    AllowedPassengerTypes:Array<string>, 
    AllowedOriginDestinations:Array<string>, 
    AllowedCurrencies:Array<string>, 
    MaxPassengerCount:Number, 
    AllowedFormsOfPayment:Array<string>, 
    FrequentFlyerLevels:Array<string>, 
    DefaultCurrency:String,
    DefaultCultureName:String,
    AllowCheckIn:Boolean, 
    AllowToGetFlownCoupons:Boolean,
    WebClassFilters:Array<string>, 
    BookingVerificationRequired:Boolean, 
    AllowToPayCash:Boolean, 
    ResponseInfo:Object,
    RefundConfig:Object,
  }
  
  export interface SpecialServiceCode{
    _id: string;
    Code:String,
    Label:String, 
    ValueCodeProperties:Array<string>,
    Extensions:String,
  }

  