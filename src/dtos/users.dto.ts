import { IsString,IsDefined, ArrayUnique,ArrayNotEmpty,IsNotEmpty,ValidateNested} from 'class-validator';

export class LoginDto {
  @IsString()
  public Login: string;

  @IsString()
  public Password: string;
}

class PhoneDTO {
  @IsDefined()
 // @IsPhoneNumber(null) // You can pass country code as argument if the phone number is country-specific
  PhoneNumber: string;

  @IsDefined()
  @IsString()
  PhoneTypeCode: string;

  @IsDefined()
  @IsString()
  PhoneLocationTypeCode: string;
}
export class CreateUserDto {
  
  @ArrayNotEmpty()
  @ArrayUnique()
  public Emails: Email[];
  
  @IsNotEmpty()
  @IsString()
  public FirstName: string;
   
  @IsString()
  public MiddleName: string;
  
  @IsNotEmpty()
  @IsString()
  public Surname: string;
   
  @IsNotEmpty()
  @IsString()
  public Password: string;
 
  
  @IsNotEmpty()
  @IsString()
  public CivilityCode: string;
  TypeCode: string;
  CultureName: string;
  Currency: string;
  Phones: any[];
  Login: any;
  
}

export class Email{
  @IsString()
  public Email:String;
}


export class ForgotPasswordDto {
  @IsString()
  public EmailAddress: string; 
}

export class UpdateUserDto {
  
  @ArrayNotEmpty()
  @ArrayUnique()
  public Emails: Email[];
  
  @IsNotEmpty()
  @IsString()
  public FirstName: string;
   
  @IsString()
  public MiddleName: string;
  
  @IsNotEmpty()
  @IsString()
  public Surname: string;
   
  @IsNotEmpty()
  @IsString()
  public Password: string;
  
  @IsNotEmpty()
  @IsString()
  public CivilityCode: string;
  TypeCode: string;
  CultureName: string;
  Currency: string;
  Phones: any[];
  Login: any;
  Members: any[];
 
}
