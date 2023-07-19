import { IsString,IsDefined, ArrayUnique,ArrayNotEmpty,IsNotEmpty,ValidateNested} from 'class-validator';

export class LoginDto {
  @IsString()
  public Login: string;

  @IsString()
  public password: string;
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
  public Emails: Array<string>;
  
  @ArrayNotEmpty()
  @ArrayUnique()  
  public Phones: Array<string>;
  
  @ArrayUnique()
  public Addresses: Array<string>;
  
  @ArrayUnique()
  public Documents: Array<string>;

  @IsNotEmpty()
  @IsString()
  public CivilityCode: string;

  @IsNotEmpty()
  @IsString()
  public Firstname: string;
  
  @IsNotEmpty()
  @IsString()
  public Middlename: string;
  
  @IsNotEmpty()
  @IsString()
  public Surname: string;
 
  @IsNotEmpty()
  @IsString()
  public TypeCode: string;

  @IsNotEmpty()
  @IsString()
  public CultureName: string;

  @IsNotEmpty()
  @IsString()
  public Currency: string;

  @IsNotEmpty()
  @IsString()
  public Login: string;

  @IsNotEmpty()
  @IsString()
  public BirthDate: string;
  
  @IsNotEmpty()
  @IsString()
  public Password: string;

  @IsNotEmpty()
  @IsString()
  public CompanyName: string; 
  
  @IsNotEmpty()
  @IsString()
  public Ref: string; 
  
  
}


export class ForgotPasswordDto {
  @IsString()
  public EmailAddress: string; 
}

