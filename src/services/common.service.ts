import { API_URL,API_KEY} from '@config';
import { HttpException } from '@exceptions/HttpException';
import { Location,EligibleOriginDestinations } from '@interfaces/cron.interface';
import locationModel from '@models/location.model'; 
import eligibleOriginDestinationsModel from '@models/eligibleOriginDestinations.model';
import allowedOriginDestinationsModel from '@models/allowedOriginDestinations.model'; 
import { isEmpty } from '@utils/util'; 
import { OriginDestinationDto,OriginDto} from '@dtos/search.dto';
const axios = require('axios');

class CommonService {
  public location = locationModel; 
  public allowedOriginDestinations    = allowedOriginDestinationsModel;
  public eligibleOriginDestinations   = eligibleOriginDestinationsModel;

  public async getLocation(): Promise<Location[]> {
    const query  = [
      {
        $lookup: {
          from: 'locations',
          localField: 'OriginCode',
          foreignField: 'Code',
          as: 'locationData'
        }
      },
      {
        $unwind: '$locationData'
      },
      {
        $project: {
          code: '$locationData.code',
          Label: '$locationData.Label',
          icao: '$locationData.icao',
          iata: '$locationData.iata',
          name: '$locationData.name', 
          city: '$locationData.city', 
          region: '$locationData.region',
          country: '$locationData.country',
          elevation_ft: '$locationData.elevation_ft',
          latitude:'$locationData.latitude',
          longitude:'$locationData.longitude',
          timezone:'$locationData.timezone',
        }
      }
       
    ];
     
    const location:Location[] = await this.allowedOriginDestinations.aggregate(query);
    return location;
  }

  public async getEligibleOriginDestinations(locationData: OriginDestinationDto): Promise<EligibleOriginDestinations[]> {
    if (isEmpty(locationData)) throw new HttpException(400, 'Search is empty');
    const setEligibleOriginDestinationsData: EligibleOriginDestinations[] =  await this.eligibleOriginDestinations.find({ TargetDate: { $ne: null }, OriginCode:locationData.OriginCode, DestinationCode:locationData.DestinationCode });
    return setEligibleOriginDestinationsData; 
  }
  public async getDestination(locationData: OriginDto): Promise<Location[]> {
    if (isEmpty(locationData)) throw new HttpException(400, 'Search is empty');
    const query  = [

      {
        $unwind: "$DestinationCodes"
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'DestinationCodes',
          foreignField: 'Code',
          as: 'locationData' 
        }
      },
      {
        $unwind: "$locationData"
      },
       
      {
        $group: {
          _id: "$_id",
          OriginCode: { $first: "$OriginCode" },
          DestinationCodes: { $push: "$locationData" }
        }
      },{
        $match: {
          OriginCode: locationData.OriginCode
        }
      } 
    ];
     
    const location:Location[] = await this.allowedOriginDestinations.aggregate(query);
    return location[0].DestinationCodes;
  }
  public async updateUser(userId: string, userData: UpdateUserDto): Promise<ProfileData> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    if (userData.Login) {
      const findUser: ProfileData = await this.users.findOne({ Login: userData.Login });
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
        this.users.updateOne({ "Login": userData[0].Login },{$set: userData[0]});
        // Delete documents that match a specific condition
        const deleteResult = await this.userMembers.deleteMany({
          "Login": userData[0].Login
        });
        // Insert new documents
        await this.userMembers.insertMany(userData); 
        const findUser1: ProfileData = await this.userMembers.find({ Login: userData[0].Login });
        if (isEmpty(findUser1)) throw new HttpException(400, 'Member data not found');
        return findUser1;
      } catch (error) { 
          throw new HttpException(400,'This account not found.'); 
      }
  }
   
    
} 
export default CommonService;
