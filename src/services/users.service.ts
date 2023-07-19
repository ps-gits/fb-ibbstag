import { SECRET_KEY,API_URL,API_KEY} from '@config';
import { CreateUserDto,ForgotPasswordDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User,CreateUser,ForgotPassword} from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util'; 
const axios = require('axios');
class UserService {
  public users = userModel;
  public async updateUser(userId: string, userData: CreateUserDto): Promise<CreateUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    if (userData.Login) {
      const findUser: CreateUser = await this.users.findOne({ Login: userData.Login });
      if (!findUser) throw new HttpException(409, `This account not found.`);
    } 
    var URL = API_URL+'UpdateCustomer';
    const requestData = {
      request: {
        Customer:{
          CivilityCode: userData.CivilityCode,
          Emails: userData.Emails,
          Firstname: userData.Firstname,
          Surname: userData.Surname,
          Phones: userData.Phones,
          TypeCode: userData.TypeCode,
          CultureName: "en-GB",
          Currency: userData.Currency,
          Login: userData.Login,
          Ref:userData.Ref
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
    console.log(res.data);
    await this.users.updateOne({ "Login": userData.Login },{$set: userData});
    const findUser1: CreateUser = await this.users.findOne({ Login: userData.Login });
    return findUser1;
  }
  public async forgotPassword(userId: string, userData: ForgotPasswordDto): Promise<ForgotPassword> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    var URL = API_URL+'LostCustomerPassword';
    const requestData = {
      request: { 
        EmailAddress: userData.EmailAddress,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    return res.data
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default UserService;
