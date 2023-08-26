import { sign } from 'jsonwebtoken';
import { SECRET_KEY,API_URL,API_KEY} from '@config';
import { CreateUserDto,LoginDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
const axios = require('axios');

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findUser: User = await this.users.findOne({ Login: userData.Emails[0].Email });
    if (findUser!=null) throw new HttpException(400, `This account already exists`); 
    var URL = API_URL+'NewCustomer';
    const requestData = {
      request: {
        Customer:{
          CivilityCode:'Mr',//userData.CivilityCode,
          Emails: userData.Emails,
          Firstname: userData.FirstName,
          Middlename:userData.MiddleName,
          Surname: userData.Surname,
          TypeCode: "EndCustomer",
          CultureName: "en-GB",
          Currency: "AED",
          Login: userData.Emails[0].Email,
          
        },
        Password: userData.Password,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
   
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    console.log(data);
    delete userData.Password;
    userData.TypeCode = "EndCustomer";
    userData.CultureName = "en-GB";
    userData.Currency = "AED";
    userData.Phones = [],
    userData.Login = userData.Emails[0].Email;
    const createUserData: User = await this.users.create({ ...userData });
    return createUserData;
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    var URL = API_URL+'LoadCustomer';
    const findUser: User = await this.users.findOne({ Login: userData.Login });
    if (!findUser) throw new HttpException(400, `This email ${userData.Login} was not found`);
    
    const requestData = {
      request: {
        ByLoginAndPassword: {
          Login: userData.Login,
          Password: userData.Password
        },
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        }
      }
    }; 
 
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    console.log(data);
    if (!data.Customer) throw new HttpException(400, `Incorrect Id or password `);
      const tokenData = this.createToken(findUser);
      const cookie = this.createCookie(tokenData);
      return {cookie, findUser};
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(400, `This email ${userData.email} was not found`);
    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60; 
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
