export interface User {
  _id: string;
  email: string;
  password: string;
}
export interface UpdateUser {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: Object;
  upsertedCount: number;
  matchedCount: number;
  _id: string;
  ref: string;
  CivilityCode: string;
  Firstname: string;
  Surname: string;
  TypeCode: string;
  CultureName: string;
  Currency: string;
  Login: string;
  BirthDate: string;
  password: string;
  CompanyName: string; 
  Emails: Array<string>; 
  Phones: Array<string>;
  Addresses: Array<string>;
  Documents: Array<string>;
}

export interface CreateUser {
  _id: string;
  ref: string;
  CivilityCode: string;
  Firstname: string;
  Surname: string;
  TypeCode: string;
  CultureName: string;
  Currency: string;
  Login: string;
  BirthDate: string;
  password: string;
  CompanyName: string; 
  Emails: Array<string>; 
  Phones: Array<string>;
  Addresses: Array<string>;
  Documents: Array<string>;
  Members: Array<string>;
}
export interface ForgotPassword { 
  CivilityCode: string;
}
export interface BookingHistory {
}
export interface ProfileData {
}
