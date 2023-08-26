import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
const userMembersSchema: Schema = new Schema({
  ref: { type: String  },
  CivilityCode: { type: String ,required: true}, 
  FirstName:{ type: String, lowercase: true, trim: true ,required: true},
  Surname:{ type: String, lowercase: true, trim: true ,required: true},
  MiddleName:{ type: String, lowercase: true, trim: true},
  TypeCode:{ type: String ,required: true},
  CultureName:{ type: String ,required: true},
  Currency:{ type: String,required: true },
  Login:{ type: String , required: true}, 
  BirthDate:{ type: String },
  CompanyName:{ type: String  }, 
  Emails: { type: Array}, 
  Phones: { type: Array},
  Addresses: { type: Array},
  Documents: { type: Array},
}); 
const userMembersModel = model<User & Document>('UserMembers', userMembersSchema); 
export default userMembersModel;
