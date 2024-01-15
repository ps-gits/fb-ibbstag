import { SECRET_KEY,API_URL,API_KEY} from '@config';
import { UpdateUserDto,ForgotPasswordDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User,CreateUser,ForgotPassword,BookingHistory,ProfileData} from '@interfaces/users.interface';
import userModel from '@models/users.model';
import userMembersModel from '@models/userMembers.model';
import bookingHistoryModel from '@/models/bookingHistory.model';
import { isEmpty ,formattedTime,localeDateString} from '@utils/util'; 

const axios = require('axios');
class UserService {
  public users        = userModel;
  public userMembers  = userMembersModel;
  public bookingHistoryModel   = bookingHistoryModel;
  public async updateUser(userId: string, userData: UpdateUserDto): Promise<ProfileData> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    if (userData.Login) {
      const findUser: ProfileData = await this.users.findOne({ Login: userId.Login });
      if (!findUser) throw new HttpException(400, 'This account not found.');
    } 
    var URL = API_URL+'UpdateCustomer';
    try {
        const requestData = {
          request: {
            Customer:{
              CivilityCode: userData[0].CivilityCode,
              Emails: userData[0].Emails,
              Firstname: userData[0].FirstName,
              Middlename: userData[0].MiddleName,
              Surname: userData[0].Surname,
              Phones: userData[0].Phones,
              TypeCode: userData[0].TypeCode,
              CultureName: "en-GB",
              Currency: userData[0].Currency,
            },
             
            RequestInfo: {
              AuthenticationKey: API_KEY,
              CultureName: 'en-GB'
            },
            Extensions: null
          }
        };
        axios.post(URL, requestData);
        this.users.updateOne({ "Login": userId.Login },{$set: userData[0]});
        // Delete documents that match a specific condition
        const deleteResult = await this.userMembers.deleteMany({
          "Login": userData[0].Login
        });
        // Insert new documents
        await this.userMembers.insertMany(userData); 
        const findUser1: ProfileData = await this.userMembers.find({ Login: userId.Login });
        if (isEmpty(findUser1)) throw new HttpException(400, 'Member data not found');
        return findUser1;
      } catch (error) { 
          throw new HttpException(400,'This account not found.'); 
      }
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
    if (!deleteUserById) throw new HttpException(400, "User doesn't exist");

    return deleteUserById;
  }
  public async bookingHistory(userId: string): Promise<BookingHistory> {
     
    // if (isEmpty(userId)) throw new HttpException(400, 'userData is empty');
          
        let data: {
          active: any[];  
          past: any[];  
          canceled: any[];
        };
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0'); 
        const formattedDate = `${year}-${month}-${day}`;
        const pastBookingHistories = await this.bookingHistoryModel.find({
                $and: [
                  { destinationDate: { $lt: formattedDate } },
                  { userId: userId }
                ]
              });

        const gratterBookingHistories = await this.bookingHistoryModel.find({
                $and: [
                  { destinationDate: { $gt: formattedDate } },
                  { userId: userId }
                ]
              }); 

        const BookingHistories = pastBookingHistories.map((bookingHistory) => {
        const originDate = localeDateString(bookingHistory.originDate); 
        const destinationDate = localeDateString(bookingHistory.destinationDate); 
        return {
          ...bookingHistory.toObject(),
          originDate: originDate,
          destinationDate: destinationDate,
          passenger:0
        };
      });

        const gtBookingHistories = gratterBookingHistories.map((bookingHistorygt) => {
        const originDate = localeDateString(bookingHistorygt.originDate); 
        const destinationDate = localeDateString(bookingHistorygt.destinationDate); 
        return {
          ...bookingHistorygt.toObject(),
          originDate: originDate,
          destinationDate: destinationDate,
          passenger:0
        };
      });

        
      data = {
        active: gtBookingHistories,  
        past: BookingHistories,  
        canceled:BookingHistories
      };
    return data ;
  }
  public async profileData(userId: string): Promise<ProfileData> {
    //if (userId) {
      const findUser: ProfileData = await this.users.findOne({Login:userId});
      if (!findUser) throw new HttpException(400, `This account not found.`);
        const findUser1 = await this.userMembers.find({ Login: userId });
        if(findUser1.length > 0){
          return  findUser1
        }
        var data = [];
        data.push(findUser);
        return data;
      
    //}
  
  }
}

export default UserService;
