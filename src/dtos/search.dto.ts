import { IsString,IsBoolean } from 'class-validator';

export class OriginDestinationDto {
  @IsString()
  OriginCode: string;

  @IsString()
  DestinationCode: string;

  TargetDate: Date;
}
export class SearchExchangeDto{
  public OriginDestinations: Array<OriginDestinationDto>;
  
  @IsString()
  public Passengers: string;
  
  @IsString()
  public TargetDate: string;

  @IsString()
  public OriginCode: string;

  @IsString()
  public DestinationCode: string;

  @IsString()
  public Ref: string;

  @IsString()
  public RefClient: string;

  @IsString()
  public PassengerQuantity: string;

  @IsString()
  public PassengerTypeCode: string;

  @IsString()
  public PnrCode: string;

  @IsString()
  public PassangerLastname: string;
   
  public RefETTicketFare: any;

  @IsBoolean()
  public DateFlexible: boolean;
}
export class SearchDto {
  public OriginDestinations: Array<OriginDestinationDto>;
  @IsString()
  public Passengers: string;
  @IsString()
  public TargetDate: string;
  @IsString()
  public OriginCode: string;
  @IsString()
  public DestinationCode: string;
  @IsString()
  public Ref: string;
  @IsString()
  public RefClient: string;
  @IsString()
  public PassengerQuantity: string;
  @IsString()
  public PassengerTypeCode: string; 
  @IsBoolean()
  public DateFlexible: boolean;
}


export class prepareFlightsDto {
  public RefItinerary: string;
  public Ref: string;
  public IncludeAllOptionalSpecialServices: boolean;
}

export class prepareExchangeFlightsDto {
  public RefItinerary: string;
  public Ref: string;
  public PnrCode: string;
  public PassangerLastname:string;
  public IncludeAllOptionalSpecialServices: boolean;
}
export class OriginDestinationDto1{
  @IsString()
  public OriginCode: string;

  @IsString()
  public DestinationCode: string;
}

export class OriginDto{
  @IsString()
  public OriginCode: string;
}
