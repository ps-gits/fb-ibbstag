import { API_URL,API_KEY} from '@config';
import { HttpException } from '@exceptions/HttpException';
import { Location,EligibleOriginDestinations,AllowedOriginDestinations,AirLineDetails,CivilityDetails} from '@interfaces/cron.interface';
import locationModel from '@models/location.model';
import specialServiceCodeModel from '@models/specialServiceCode.model';
import eligibleOriginDestinationsModel from '@models/eligibleOriginDestinations.model'; 
import allowedOriginDestinationsModel from '@models/allowedOriginDestinations.model';
import airLineDetailsModel from '@models/airLineDetails.model';
import civilityDetailsModel from '@models/civilityDetails.model';
import { length } from 'class-validator';
const axios = require('axios');
const fs = require('fs');
class CronService {
  public location = locationModel;
  public eligibleOriginDestinations   = eligibleOriginDestinationsModel;
  public allowedOriginDestinations    = allowedOriginDestinationsModel; 
  public airLineDetails               = airLineDetailsModel;
  public specialServiceCode           = specialServiceCodeModel; 
  
  
  public async SetLocation(): Promise<Location[]> {

    var URL = API_URL+'GetValueCodes';
    const requestData = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        ValueCodeName:"Airport",
        Extension: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    console.log(data);
 
    if (!data.Codes) throw new HttpException(409, `Something Missing,Data Not Found`);
    this.location.deleteMany({}, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result.deletedCount + " documents deleted."); 
    });
    let  insertData = [];
    
    // Read the JSON file
    const rawData = fs.readFileSync('./src/codesCurrent.json');
    const jsonData = JSON.parse(rawData);
    
    console.log(rawData);
    for (let key in data.Codes) {
      const options = {
        method: 'GET',
        url: 'https://airports-by-api-ninjas.p.rapidapi.com/v1/airports',
        params: {iata: data.Codes[key].Code},
        headers: {
          'X-RapidAPI-Key': '25d32db056msh29fe1ef8fa095a7p15db5bjsndf003773d518',
          'X-RapidAPI-Host': 'airports-by-api-ninjas.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
     
      jsonData.forEach((dataJson) => {
        if(response.data.length > 0 && dataJson.entities.length > 0){
            if(response.data[0].country===dataJson.entities[0].code){
              const currency  = dataJson.code.alphabetic;
              const cpd_code  = dataJson.entities[0].cpd_code;
              const symbol  = dataJson.symbol.international;
              const mergedObj = Object.assign(data.Codes[key], response.data[0], { currency: currency, symbol: symbol,cpd_code:cpd_code });
              insertData.push(mergedObj);
            } 
        }  
      });
	  
      
    }  
 
    const setLocationData: Location[] = await this.location.insertMany(insertData);
    return setLocationData; 
  } 
  public async SetEligibleOriginDestinations(): Promise<EligibleOriginDestinations[]> {

    var URL = API_URL+'EligibleOriginDestinations?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extension: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    //return data;
    if (!data.OriginDestinations) throw new HttpException(409, `Something Missing, Data not found`);
    this.eligibleOriginDestinations.deleteMany({}, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result.deletedCount + " documents deleted."); 
    })
    let  insertData = [];
    for (let key in data.OriginDestinations) {
      const dateString = data.OriginDestinations[key].TargetDate;
      if(dateString!== null)
      {   
          //const date = dateString.toISOString().split('T')[0];
          const date1 = new Date(dateString);
          const date2 = date1.toLocaleDateString('en-US');
          const dateComponents = date2.split('/');
          const year = dateComponents[2];
          const month = String(dateComponents[0]).padStart(2, '0');
          const day = String(dateComponents[1]).padStart(2, '0');
          const date = `${year}-${month}-${day}`;
          const mergedObj = Object.assign({ Date:date,TargetDate:dateString , OriginCode: data.OriginDestinations[key].OriginCode,DestinationCode:data.OriginDestinations[key].DestinationCode });
          insertData.push(mergedObj);
        }  
    }
    const setEligibleOriginDestinationsData: EligibleOriginDestinations[] = await this.eligibleOriginDestinations.insertMany(insertData);
    

    
    var URL = API_URL+'GetValueCodes';
    const requestData2 = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        ValueCodeName:"SpecialServiceCode",
        Extension: null
      }
    };
    let res2 =  await axios.post(URL, requestData2);
    let data2 = res2.data;
    this.specialServiceCode.deleteMany({}, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result.deletedCount + " documents deleted."); 
    }) 
    this.specialServiceCode.insertMany(data2.Codes);
    return setEligibleOriginDestinationsData; 
  } 
  public async SetAllowedOriginDestinations(): Promise<AllowedOriginDestinations[]> {

    var URL = API_URL+'SaleConfiguration';
    const requestData = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extension: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    console.log(data.AllowedOriginDestinations);
    if (!data.AllowedOriginDestinations) throw new HttpException(409, `Something Missing, Data not found`);
    this.allowedOriginDestinations.deleteMany({}, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result.deletedCount + " documents deleted."); 
    });
    const setAllowedOriginDestinationsData: AllowedOriginDestinations[] = await this.allowedOriginDestinations.insertMany(data.AllowedOriginDestinations);
    return setAllowedOriginDestinationsData; 
  } 
  
  public async SetAirLineDetails(): Promise<AirLineDetails[]> {

    var URL = API_URL+'SaleConfiguration';
    const requestData = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extension: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    if (!data) throw new HttpException(409, `Something Missing, Data not found`);
    this.airLineDetails.deleteMany({}, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result.deletedCount + " documents deleted."); 
    });
    const setAirLineDetailsData: AirLineDetails[] = await this.airLineDetails.insertMany(data);
    return setAirLineDetailsData; 
  } 

  public async SetCivility(): Promise<CivilityDetails[]> {
    try {
      var URL = API_URL+'GetValueCodes';
      const requestData = {
        request: {
          RequestInfo: {
            AuthenticationKey: API_KEY,
            CultureName: 'en-GB'
          },
          ValueCodeName:"Civility",
          Extension: null
        }
      };
      let res =  await axios.post(URL, requestData);
      let data = res.data;
      if (!data) throw new HttpException(409, `Something Missing, Data not found`);
      const deleteResult = await this.civility.deleteMany({});
      const setCivilityDetailsData: CivilityDetails[] = await this.civility.insertMany(data);
      return setCivilityDetailsData; 
    } catch (error) { 
      throw new HttpException(400,'This account not found.'); 
    }
  } 
   
  
   
  
}

export default CronService;
