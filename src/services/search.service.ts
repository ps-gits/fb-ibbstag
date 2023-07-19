import { SearchDto,SearchExchangeDto,prepareFlightsDto,prepareExchangeFlightsDto} from '@dtos/search.dto';
import { HttpException } from '@exceptions/HttpException';
import { Search } from '@interfaces/search.interface';
import eligibleOriginDestinationsModel from '@models/eligibleOriginDestinations.model';
import specialServiceCodeModel from '@models/specialServiceCode.model';
import locationModel from '@models/location.model';
import { isEmpty,localeDateString,toISOString,formattedTime,extractKeyValuePairs } from '@utils/util';
import { API_URL,API_KEY} from '@config';
import { length } from 'class-validator';
const axios = require('axios');
class SearchService {
  public eligibleOriginDestinations   = eligibleOriginDestinationsModel;
  public location = locationModel;
  public  specialServiceCode = specialServiceCodeModel;
  public async searchFlight(searchData: SearchDto): Promise<Search> {
    if (isEmpty(searchData)) throw new HttpException(400, 'Search is empty'); 
    
    let OriginDestinationsData0 = []; 
    let OriginDestinationsData1 = []; 
    let OriginDestinationsData2 = []; 
    let OriginDestinationsData = [];
    let RetunrOriginDestinationsData0 = [];
    let RetunrOriginDestinationsData1 = [];
    let RetunrOriginDestinationsData2 = [];
    let RetunrOriginDestinationsData = [];
    let OriginDestinationsArray = [];
     
    const currencyOrg = await this.location.find({ Code: searchData.OriginDestinations[0].OriginCode });
    let currency, symbol, cpd_code; // Declare the variables outside the loop
    currencyOrg.forEach((currencyData) => {
      currency = currencyData.currency;
      symbol = currencyData.symbol;
      cpd_code = currencyData.cpd_code;
    });
    if(searchData.OriginDestinations.length ==1){
      // Use the formatDate function
      const date = new Date(searchData.OriginDestinations[0].TargetDate);
      const formattedDate = date.toISOString().split('T')[0];
      if(searchData.DateFlexible){  
        OriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).sort({ Date: -1 }).limit(1);
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
        OriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }else{
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }
      OriginDestinationsData = [...OriginDestinationsData0, ...OriginDestinationsData1, ...OriginDestinationsData2];
      for (const  key1 in OriginDestinationsData) {
        let DestinationArray = [];
          DestinationArray.push({
            TargetDate: OriginDestinationsData[key1].TargetDate,
            OriginCode: OriginDestinationsData[key1].OriginCode,
            DestinationCode: OriginDestinationsData[key1].DestinationCode
          });
          OriginDestinationsArray.push(DestinationArray);
      }  
    }
    if(searchData.OriginDestinations.length > 1){
      // Use the formatDate function
      const date1 = new Date(searchData.OriginDestinations[1].TargetDate);
      const formattedDate1 = date1.toISOString().split('T')[0];
      if(searchData.DateFlexible){
        RetunrOriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).sort({ Date: -1 }).limit(1);
        RetunrOriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
        RetunrOriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
      }else{
        RetunrOriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
      }
      RetunrOriginDestinationsData = [...RetunrOriginDestinationsData0, ...RetunrOriginDestinationsData1, ...RetunrOriginDestinationsData2];
      // Use the formatDate function
      const date2 = new Date(searchData.OriginDestinations[0].TargetDate);
      const formattedDate2 = date2.toISOString().split('T')[0];
      if(searchData.DateFlexible){  
        OriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).sort({ Date: -1 }).limit(1);
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
        OriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }else{
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }
      OriginDestinationsData = [...OriginDestinationsData0, ...OriginDestinationsData1, ...OriginDestinationsData2];
      
      for (const  key1 in RetunrOriginDestinationsData) {
        for (const  key2 in OriginDestinationsData) {
          let DestinationArray = [];
          DestinationArray.push({
            TargetDate:  OriginDestinationsData[key2].TargetDate,
            OriginCode: OriginDestinationsData[key2].OriginCode,
            DestinationCode: OriginDestinationsData[key2].DestinationCode
          },{
            TargetDate: RetunrOriginDestinationsData[key1].TargetDate,
            OriginCode: RetunrOriginDestinationsData[key1].OriginCode,
            DestinationCode: RetunrOriginDestinationsData[key1].DestinationCode
          });
          OriginDestinationsArray.push(DestinationArray);
        } 

      }  
    }
    
    var URL = API_URL+'SearchFlights';
    let data = {
      delight: [],
      bliss: [],
      opulence: [],
    };
    
    for (const  key in OriginDestinationsArray) {
      const OriginDestinationsRes = OriginDestinationsArray[key];
      const requestData = {
        request: {
          Passengers:searchData.Passengers, 
          OriginDestinations: OriginDestinationsRes, 
          FareDisplaySettings:{
            RewardSearch:false,
            SaleCurrencyCode:currency,
            FareLevels:null,
            FarebasisCodes:null,
            WebClassesCodes:true,
            FareVisibilityCode:null,
            ShowWebClasses:true,
            PromoCode:null,
            ManualCombination:false,
            Extensions:null,
  
          },
          RequestInfo: {
            AuthenticationKey: API_KEY,
            CultureName: 'en-GB'
          },
          Extensions: null
        }
      };
      console.log(requestData);
      let res =  await axios.post(URL, requestData);
      let faireFmailies = [];
     
    if(res.data.Passengers!=null){
      const Segments = res.data.Segments;
      let oriIncre = 0;
      let desIncre = 0;

      var  OriginCode      = OriginDestinationsRes[0].OriginCode;
      var  DestinationCode = OriginDestinationsRes[0].DestinationCode;
      var LocOrgin = await this.location.find({Code:OriginCode});
      for (const  loc1 in LocOrgin) {
        var originName =  LocOrgin[loc1].name;
        var originCity =  LocOrgin[loc1].city;
      }
      var LocDest = await this.location.find({Code:DestinationCode});
      for (const  loc2 in LocDest) {
        var destinationName =  LocDest[loc2].name;
        var destinationCity =  LocDest[loc2].city;
      }
      for (const seg of Segments) {
        
        

        //for (const OriKey in OriginDestinationsRes) {
          if (seg.OriginCode === OriginDestinationsRes[0].OriginCode &&
              seg.DestinationCode === OriginDestinationsRes[0].DestinationCode &&
              oriIncre === 0) {
              oriIncre += 1;

              var LocOrgin = await this.location.find({Code:seg.OriginCode});
              for (const  loc1 in LocOrgin) {
                var originName =  LocOrgin[loc1].name;
                var originCity =  LocOrgin[loc1].city;
              }
              var LocDest = await this.location.find({Code:seg.DestinationCode});
              for (const  loc2 in LocDest) {
                var destinationName =  LocDest[loc2].name;
                var destinationCity =  LocDest[loc2].city;
              }

              var  DepartureDate   = seg.FlightInfo.DepartureDate;
              var  ArrivalDate     = seg.FlightInfo.ArrivalDate;
              var  DurationMinutes = seg.FlightInfo.DurationMinutes;
              var destinationArrivalTime = formattedTime(ArrivalDate); 
              var destinationArrivalDate = localeDateString(ArrivalDate);
              var orginDepartureTime     = formattedTime(DepartureDate);
              var orginDepartureDate = localeDateString(DepartureDate);
            
            const faireFmailiesOriginObj = {
              orginDepartureDate: orginDepartureDate,
              orginDepartureTime: orginDepartureTime,
              originName: originName,
              originCity:originCity,
             
              luxuryPickup: true,   // either field will not return in response
              loungeAccess: true,   // either field will not return in response
              BagAllowances: [
                {
                  Quantity: Quantity,
                  WeightMeasureQualifier: WeightMeasureQualifier,
                  Weight: Weight
                }
              ],
              destinationName: destinationName,
              destinationCity: destinationCity,
              destinationArrivalDate: destinationArrivalDate,
              destinationArrivalTime: destinationArrivalTime,
            };
            faireFmailies.push(faireFmailiesOriginObj);
            // Process or use the faireFmailiesOriginObj as needed
          }
        //}
        

       // for (const DesKey in OriginDestinationsRes) {
          if(OriginDestinationsRes.length >1){
            if (seg.OriginCode === OriginDestinationsRes[1].OriginCode &&
                seg.DestinationCode === OriginDestinationsRes[1].DestinationCode && desIncre === 0) {
              desIncre += 1;

              var LocOrgin = await this.location.find({Code:seg.OriginCode});
              for (const  loc1 in LocOrgin) {
                var originName =  LocOrgin[loc1].name;
                var originCity =  LocOrgin[loc1].city;
              }
              var LocDest = await this.location.find({Code:seg.DestinationCode});
              for (const  loc2 in LocDest) {
                var destinationName =  LocDest[loc2].name;
                var destinationCity =  LocDest[loc2].city;
              }

              var  DepartureDate   = seg.FlightInfo.DepartureDate;
              var  ArrivalDate     = seg.FlightInfo.ArrivalDate;
              var  DurationMinutes = seg.FlightInfo.DurationMinutes;
              var destinationArrivalTime = formattedTime(ArrivalDate ); 
              var destinationArrivalDate = localeDateString(ArrivalDate);
              var orginDepartureTime     = formattedTime(DepartureDate);
              var orginDepartureDate = localeDateString(DepartureDate);
            
              const faireFmailiesDestinationObj = {
                orginDepartureDate: orginDepartureDate,
                orginDepartureTime: orginDepartureTime,
                originName: originName,
                originCity: originCity,
                luxuryPickup: true,
                loungeAccess: true,
                BagAllowances: [
                  {
                    Quantity: Quantity,
                    WeightMeasureQualifier: WeightMeasureQualifier,
                    Weight: Weight
                  }
                ],
                destinationName: destinationName,
                destinationCity: destinationCity,
                destinationArrivalDate: destinationArrivalDate ,
                destinationArrivalTime: destinationArrivalTime,
              };
          
              faireFmailies.push(faireFmailiesDestinationObj);
            }
          }
        //}
        
      }
      var  Ref     = res.data.Offer.Ref; 
       
      if(OriginDestinationsArray[key].length == 1){
        var Otr1 = OriginDestinationsRes[0].TargetDate;
        var Dtr1 = OriginDestinationsRes[0].TargetDate; 
        var Otr = toISOString(OriginDestinationsRes[0].TargetDate);
        var Dtr =  toISOString(OriginDestinationsRes[0].TargetDate); 
      } 

      if(OriginDestinationsArray[key].length > 1){
        var Otr1 = OriginDestinationsRes[0].TargetDate;
        var Dtr1 = OriginDestinationsRes[1].TargetDate; 
        var Otr  = toISOString(OriginDestinationsRes[0].TargetDate);
        var Dtr  =  toISOString(OriginDestinationsRes[1].TargetDate); 
      } 
      
      var  Quantity        = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Quantity;
      var  WeightMeasureQualifier = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].WeightMeasureQualifier;
      var  Weight          = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Weight;
      var  RefItinerary    = res.data.FareInfo.ETTicketFares[0].RefItinerary;
      if(searchData.OriginDestinations.length > 1){
        if((res.data.FareInfo.Itineraries.length > 8 && searchData.DateFlexible==true) || (res.data.FareInfo.Itineraries.length > 2 && searchData.DateFlexible==false)){
          let Itinerariesdelight;
          if(searchData.DateFlexible){
            Itinerariesdelight =  res.data.FareInfo.Itineraries[8];
          }else{
            Itinerariesdelight =  res.data.FareInfo.Itineraries[2];
          } 
          var  BaseAmount      = Itinerariesdelight.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesdelight.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesdelight.SaleCurrencyAmount.TotalAmount;
          let delight = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          };
          data.delight.push(delight);
        }  
        if((res.data.FareInfo.Itineraries.length > 3 && searchData.DateFlexible==true) || (res.data.FareInfo.Itineraries.length > 2 && searchData.DateFlexible==false)){
          let Itinerariesbliss;
          if(searchData.DateFlexible){
            Itinerariesbliss =  res.data.FareInfo.Itineraries[3];
          }else{
            Itinerariesbliss =  res.data.FareInfo.Itineraries[1];
          }    
          var  BaseAmount      = Itinerariesbliss.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesbliss.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesbliss.SaleCurrencyAmount.TotalAmount;
          let bliss = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          };
          data.bliss.push(bliss);
        }
      }
      if(searchData.OriginDestinations.length ==1){
          let Itinerariesdelight =  res.data.FareInfo.Itineraries[2]; 
          var  BaseAmount      = Itinerariesdelight.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesdelight.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesdelight.SaleCurrencyAmount.TotalAmount;
          let delight = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          }
          data.delight.push(delight);
          let   Itinerariesbliss =  res.data.FareInfo.Itineraries[1];
          var  BaseAmount      = Itinerariesbliss.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesbliss.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesbliss.SaleCurrencyAmount.TotalAmount;
          let bliss = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          };
          data.bliss.push(bliss);
        }  
      
        const Itinerariesopulence =  res.data.FareInfo.Itineraries[0]; 
        var  BaseAmount      = Itinerariesopulence.SaleCurrencyAmount.BaseAmount;
        var  TaxAmount       = Itinerariesopulence.SaleCurrencyAmount.TaxAmount;
        var  TotalAmount     = Itinerariesopulence.SaleCurrencyAmount.TotalAmount;
        let opulence = {
          DepartureDate: DepartureDate,
          ArrivalDate: ArrivalDate,
          Dtr:Dtr,
          Otr:Otr,
          Otr1:Otr1,
          Dtr1:Dtr1,
          OriginCode: OriginCode,
          DestinationCode: DestinationCode,
          BaseAmount: BaseAmount,
          TaxAmount: TaxAmount,
          TotalAmount: TotalAmount,
          RefItinerary:RefItinerary,
          Ref:Ref,
          originCity:originCity,
          destinationCity:destinationCity,
          currency: currency,
          symbol:symbol,
          cpd_code:cpd_code,
          FaireFamilies:faireFmailies,
        }; 
        data.opulence.push(opulence);
      
    }else{
      if(OriginDestinationsArray[key].length == 1){
        var Otr1 = OriginDestinationsArray[key][0].TargetDate;
        var Dtr1 = OriginDestinationsArray[key][0].TargetDate;
      } 

      if(OriginDestinationsArray[key].length > 1){
        var Otr1 = OriginDestinationsArray[key][0].TargetDate;
        var Dtr1 = OriginDestinationsArray[key][1].TargetDate; 
      } 
    

      DepartureDate = Otr1;
      DepartureDate = parseInt(DepartureDate.substring(6, 19));
      DepartureDate = new Date(DepartureDate).toISOString();
      
      var Otr2 = parseInt(Otr1.substring(6, 19));
      var Otr = new Date(Otr2).toISOString();
      let Dtr = Dtr1; 
      Dtr = parseInt(Dtr.substring(6, 19));
      Dtr = new Date(Dtr).toISOString();
      
      let myObj = {
        DepartureDate: DepartureDate,
        ArrivalDate:DepartureDate,
        Otr:Otr,
        Dtr:Dtr,
        Otr1:Otr1,
        Dtr1:Dtr1,
        OriginCode: '-',
        DestinationCode: '-',
        BaseAmount: '-',
        TaxAmount: '-',
        TotalAmount: '-',
        RefItinerary:'-',
        Ref:'-',
        originCity:'-',
        destinationCity:'-',
        currency: '-',
        symbol:'-',
        cpd_code:'-',
        FaireFamilies:faireFmailies,
      };
      data.delight.push(myObj);
      data.bliss.push(myObj);
      data.opulence.push(myObj); 
    } 
      
    } 
  
  return data;
  }
  public async prepareFlights(prepareData: prepareFlightsDto): Promise<Search> {
    if (isEmpty(prepareData)) throw new HttpException(400, 'empty String');

    var URL = API_URL+'PrepareFlights';
    const requestData = {
      request: {
        Offer:{
          RefItinerary:prepareData.RefItinerary,
          Ref:prepareData.Ref,
        },
        IncludeAllOptionalSpecialServices: true,
        DeferredIssuance:true,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    
      let dataPer = {
      PassengersDetails: [], 
      MealsDetails:[],
      Passengers:[],
      SeatMaps:[],
      EMDTicketFareOptions:[]
    };
    console.log(res.data);
    if(res.data.Passengers!=null){ 
      var SpecialServices   =  res.data.SpecialServices;
      var OptionalSpecialServices   =  res.data.OptionalSpecialServices;
      var Passengers        =  res.data.Passengers;
      var SeatMaps          =  res.data.SeatMaps;
      var EMDTicketFareOptions          =  res.data.FareInfo.EMDTicketFareOptions;
      dataPer.Passengers    =  Passengers;
      dataPer.SeatMaps = SeatMaps;
      dataPer.EMDTicketFareOptions = EMDTicketFareOptions;
      for (const  pass in Passengers) {
        let special = {
          fields:[]
        };
        let optspecial = {
          fields:[]
        };
        for (const  key1 in SpecialServices) {
         /* const RefPassengerAd = (parseInt(pass, 10)+parseInt('1', 10)).toString(); */
         
           if(SpecialServices[key1].RefPassenger== Passengers[pass].Ref)
          {  
            var Label = await this.specialServiceCode.find({Code:SpecialServices[key1].Code});
            for (const  lab in Label) {
              var LabelName =  Label[lab].Label;
            }
            let myObj = {
              Code: SpecialServices[key1].Code,
              Label: LabelName
            };
            special.fields.push(myObj);
            
          }
        } 
        dataPer.PassengersDetails.push(special);

        for (const  key1 in OptionalSpecialServices) {
          /* const RefPassengerAd = (parseInt(pass, 10)+parseInt('1', 10)).toString(); */
          
          if(OptionalSpecialServices[key1].RefPassenger== Passengers[pass].Ref)
          {  
             var Label = await this.specialServiceCode.find({Code:OptionalSpecialServices[key1].Code});
             for (const  lab in Label) {
               var LabelName =  Label[lab].Label;
             }
             let myObj = {
               Code: OptionalSpecialServices[key1].Code,
               Label: LabelName
             };
             optspecial.fields.push(myObj);
             
          }
        } 
         dataPer.MealsDetails.push(optspecial);
      } 
    }  
    //let data = res.data;
    return dataPer;
  }

  public async searchExchangeFlight(searchData: SearchExchangeDto): Promise<Search> {
    if (isEmpty(searchData)) throw new HttpException(400, 'Search is empty');
    let OriginDestinationsData0 = []; 
    let OriginDestinationsData1 = []; 
    let OriginDestinationsData2 = []; 
    let OriginDestinationsData = [];
    let RetunrOriginDestinationsData0 = [];
    let RetunrOriginDestinationsData1 = [];
    let RetunrOriginDestinationsData2 = [];
    let RetunrOriginDestinationsData = [];
    let OriginDestinationsArray = [];
    const currencyOrg = await this.location.find({ Code: searchData.OriginDestinations[0].OriginCode });
    let currency, symbol, cpd_code; // Declare the variables outside the loop

    currencyOrg.forEach((currencyData) => {
      currency = currencyData.currency;
      symbol = currencyData.symbol;
      cpd_code = currencyData.cpd_code;
    });

    if(searchData.OriginDestinations.length ==1){
      // Use the formatDate function
      const date = new Date(searchData.OriginDestinations[0].TargetDate);
      const formattedDate = date.toISOString().split('T')[0];
      if(searchData.DateFlexible){  
        OriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).sort({ Date: -1 }).limit(1);
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
        OriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }else{
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }
      OriginDestinationsData = [...OriginDestinationsData0, ...OriginDestinationsData1, ...OriginDestinationsData2];
      for (const  key1 in OriginDestinationsData) {
        let DestinationArray = [];
          DestinationArray.push({
            TargetDate: OriginDestinationsData[key1].TargetDate,
            OriginCode: OriginDestinationsData[key1].OriginCode,
            DestinationCode: OriginDestinationsData[key1].DestinationCode
          });
          OriginDestinationsArray.push(DestinationArray);
      }  
    }
    if(searchData.OriginDestinations.length > 1){
      // Use the formatDate function
      const date1 = new Date(searchData.OriginDestinations[1].TargetDate);
      const formattedDate1 = date1.toISOString().split('T')[0];
      if(searchData.DateFlexible){
        RetunrOriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).sort({ Date: -1 }).limit(1);
        RetunrOriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
        RetunrOriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
      }else{
        RetunrOriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(1);
      }
      RetunrOriginDestinationsData = [...RetunrOriginDestinationsData0, ...RetunrOriginDestinationsData1, ...RetunrOriginDestinationsData2];
      
      // Use the formatDate function
      const date2 = new Date(searchData.OriginDestinations[0].TargetDate);

      const formattedDate2 = date2.toISOString().split('T')[0];
      if(searchData.DateFlexible){  
        OriginDestinationsData0 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$lt:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).sort({ Date: -1 }).limit(1);
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
        OriginDestinationsData2 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$gt:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }else{
        OriginDestinationsData1 =  await this.eligibleOriginDestinations.find({ Date: { $ne: null,$eq:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(1);
      }
      OriginDestinationsData = [...OriginDestinationsData0, ...OriginDestinationsData1, ...OriginDestinationsData2];
      
       
      for (const  key1 in RetunrOriginDestinationsData) {
        for (const  key2 in OriginDestinationsData) {
          let DestinationArray = [];
          DestinationArray.push({
            TargetDate: OriginDestinationsData[key2].TargetDate,
            OriginCode: OriginDestinationsData[key2].OriginCode,
            DestinationCode: OriginDestinationsData[key2].DestinationCode
          },{
            TargetDate: RetunrOriginDestinationsData[key1].TargetDate,
            OriginCode: RetunrOriginDestinationsData[key1].OriginCode,
            DestinationCode: RetunrOriginDestinationsData[key1].DestinationCode
          });
          OriginDestinationsArray.push(DestinationArray);
        } 

      }  
    }
    // let OriginDestinationsData = [];
    // let RetunrOriginDestinationsData = [];
    // let OriginDestinationsArray = [];

   
    // if(searchData.OriginDestinations.length ==1){
    //   // Use the formatDate function
    //   const date = new Date(searchData.OriginDestinations[0].TargetDate);
    //   const formattedDate = formatDate(date); 
    //   let  limit  = 1;
      
    //   OriginDestinationsData =  await this.eligibleOriginDestinations.find({ TargetDate: { $ne: null,$gt:  formattedDate}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(limit);
    //   console.log(OriginDestinationsData);
    //    for (const  key1 in OriginDestinationsData) {
    //     let DestinationArray = [];
    //       DestinationArray.push({
    //         TargetDate: OriginDestinationsData[key1].TargetDate,
    //         OriginCode: OriginDestinationsData[key1].OriginCode,
    //         DestinationCode: OriginDestinationsData[key1].DestinationCode
    //       });
    //       OriginDestinationsArray.push(DestinationArray);
    //   }  
    // }
    // if(searchData.OriginDestinations.length > 1){
    //   let  limit  = 3;
    //   // Use the formatDate function
    //   const date1 = new Date(searchData.OriginDestinations[1].TargetDate);
    //   const formattedDate1 = formatDate(date1);

    //   RetunrOriginDestinationsData =  await this.eligibleOriginDestinations.find({ TargetDate: { $ne: null,$gt:  formattedDate1}, OriginCode:searchData.OriginDestinations[1].OriginCode, DestinationCode:searchData.OriginDestinations[1].DestinationCode}).limit(limit);
      
    //   // Use the formatDate function
    //   const date2 = new Date(searchData.OriginDestinations[0].TargetDate);
    //   const formattedDate2 = formatDate(date2); 
      
    //   OriginDestinationsData =  await this.eligibleOriginDestinations.find({ TargetDate: { $ne: null,$gt:  formattedDate2}, OriginCode:searchData.OriginDestinations[0].OriginCode, DestinationCode:searchData.OriginDestinations[0].DestinationCode}).limit(limit);
    //   for (const  key1 in RetunrOriginDestinationsData) {
    //     for (const  key2 in OriginDestinationsData) {
    //       let DestinationArray = [];
    //       DestinationArray.push({
    //         TargetDate: OriginDestinationsData[key2].TargetDate,
    //         OriginCode: OriginDestinationsData[key2].OriginCode,
    //         DestinationCode: OriginDestinationsData[key2].DestinationCode
    //       },{
    //         TargetDate: RetunrOriginDestinationsData[key1].TargetDate,
    //         OriginCode: RetunrOriginDestinationsData[key1].OriginCode,
    //         DestinationCode: RetunrOriginDestinationsData[key1].DestinationCode
    //       });
    //       OriginDestinationsArray.push(DestinationArray);
    //     } 

    //   }  
    // }
 
    var URL = API_URL+'SearchFlightsForExchange';
    let data = {
      delight: [],
      bliss: [],
      opulence: [],
    };

    let RefETTicketFareAr = searchData.RefETTicketFare
    let RefETTicketFare = [];
     for (const  key in RefETTicketFareAr) { 

       const newObjs = {
          RefETTicketFare: RefETTicketFareAr[key].RefETTicketFare,
          Extensions: null 
      };
      RefETTicketFare.push(newObjs);
     }
 
    for (const  key in OriginDestinationsArray) {
      const OriginDestinationsRes = OriginDestinationsArray[key];
      const requestData = {
        request: {
          UniqueID:{
            TypeCode: "PnrCode",
            ID:searchData.PnrCode
          },
          Verification: { 
            PassengerName:searchData.PassangerLastname
          },
          TicketFaresToExchange:RefETTicketFare, 
          Passengers:searchData.Passengers, 
          OriginDestinations: OriginDestinationsRes, 
          FareDisplaySettings:{
            RewardSearch:false,
            SaleCurrencyCode:currency,
            FareLevels:null,
            FarebasisCodes:null,
            WebClassesCodes:true,
            FareVisibilityCode:null,
            ShowWebClasses:true,
            PromoCode:null,
            ManualCombination:false,
            Extensions:null,
  
          },
          RequestInfo: {
            AuthenticationKey: API_KEY,
            CultureName: 'en-GB'
          },
          Extensions: null
        }
      }; 
      let res =  await axios.post(URL, requestData); 
      let faireFmailies = [];

      if(res.data.Segments!=null){
        const Segments = res.data.Segments;
        let oriIncre = 0;
        let desIncre = 0;
        var  OriginCode      = OriginDestinationsRes[0].OriginCode;
        var  DestinationCode = OriginDestinationsRes[0].DestinationCode;
        var LocOrgin = await this.location.find({Code:OriginCode});
        for (const  loc1 in LocOrgin) {
          var originName =  LocOrgin[loc1].name;
          var originCity =  LocOrgin[loc1].city;
        }
        var LocDest = await this.location.find({Code:DestinationCode});
        for (const  loc2 in LocDest) {
          var destinationName =  LocDest[loc2].name;
          var destinationCity =  LocDest[loc2].city;
        }
        for (const seg of Segments) {
          //for (const OriKey in OriginDestinationsRes) {
            if (seg.OriginCode === OriginDestinationsRes[0].OriginCode &&
                seg.DestinationCode === OriginDestinationsRes[0].DestinationCode &&
                oriIncre === 0) {
                oriIncre += 1;

                var LocOrgin = await this.location.find({Code:seg.OriginCode});
                for (const  loc1 in LocOrgin) {
                  var originName =  LocOrgin[loc1].name;
                  var originCity =  LocOrgin[loc1].city;
                }
                var LocDest = await this.location.find({Code:seg.DestinationCode});
                for (const  loc2 in LocDest) {
                  var destinationName =  LocDest[loc2].name;
                  var destinationCity =  LocDest[loc2].city;
                }

                var  DepartureDate   = seg.FlightInfo.DepartureDate;
                var  ArrivalDate     = seg.FlightInfo.ArrivalDate;
                var  DurationMinutes = seg.FlightInfo.DurationMinutes;
                var destinationArrivalTime = formattedTime(ArrivalDate); 
                var destinationArrivalDate = localeDateString(ArrivalDate);
                var orginDepartureTime     = formattedTime(DepartureDate);
                var orginDepartureDate = localeDateString(DepartureDate);
              
              const faireFmailiesOriginObj = {
                orginDepartureDate: orginDepartureDate,
                orginDepartureTime: orginDepartureTime,
                originName: originName,
                originCity:originCity,
              
                luxuryPickup: true,   // either field will not return in response
                loungeAccess: true,   // either field will not return in response
                BagAllowances: [
                  {
                    Quantity: Quantity,
                    WeightMeasureQualifier: WeightMeasureQualifier,
                    Weight: Weight
                  }
                ],
                destinationName: destinationName,
                destinationCity: destinationCity,
                destinationArrivalDate: destinationArrivalDate,
                destinationArrivalTime: destinationArrivalTime,
              };
              faireFmailies.push(faireFmailiesOriginObj);
              // Process or use the faireFmailiesOriginObj as needed
            }
          //}
          

        // for (const DesKey in OriginDestinationsRes) {
          if(OriginDestinationsRes.length >1){
            if (seg.OriginCode === OriginDestinationsRes[1].OriginCode &&
                seg.DestinationCode === OriginDestinationsRes[1].DestinationCode && desIncre === 0) {
              desIncre += 1;

              var LocOrgin = await this.location.find({Code:seg.OriginCode});
              for (const  loc1 in LocOrgin) {
                var originName =  LocOrgin[loc1].name;
                var originCity =  LocOrgin[loc1].city;
              }
              var LocDest = await this.location.find({Code:seg.DestinationCode});
              for (const  loc2 in LocDest) {
                var destinationName =  LocDest[loc2].name;
                var destinationCity =  LocDest[loc2].city;
              }

              var  DepartureDate   = seg.FlightInfo.DepartureDate;
              var  ArrivalDate     = seg.FlightInfo.ArrivalDate;
              var  DurationMinutes = seg.FlightInfo.DurationMinutes;
              var destinationArrivalTime = formattedTime(ArrivalDate ); 
              var destinationArrivalDate = localeDateString(ArrivalDate);
              var orginDepartureTime     = formattedTime(DepartureDate);
              var orginDepartureDate = localeDateString(DepartureDate);
            
              const faireFmailiesDestinationObj = {
                orginDepartureDate: orginDepartureDate,
                orginDepartureTime: orginDepartureTime,
                originName: originName,
                originCity: originCity,
                luxuryPickup: true,
                loungeAccess: true,
                BagAllowances: [
                  {
                    Quantity: Quantity,
                    WeightMeasureQualifier: WeightMeasureQualifier,
                    Weight: Weight
                  }
                ],
                destinationName: destinationName,
                destinationCity: destinationCity,
                destinationArrivalDate: destinationArrivalDate ,
                destinationArrivalTime: destinationArrivalTime,
              };
          
              faireFmailies.push(faireFmailiesDestinationObj);
            }
          }
          //}
          
        }
        var  Ref     = res.data.Offer.Ref; 
         
        if(OriginDestinationsArray[key].length == 1){
          var Otr1 = OriginDestinationsRes[0].TargetDate;
          var Dtr1 = OriginDestinationsRes[0].TargetDate; 
          var Otr = toISOString(OriginDestinationsRes[0].TargetDate);
          var Dtr =  toISOString(OriginDestinationsRes[0].TargetDate); 
        } 
  
        if(OriginDestinationsArray[key].length > 1){
          var Otr1 = OriginDestinationsRes[0].TargetDate;
          var Dtr1 = OriginDestinationsRes[1].TargetDate; 
          var Otr = toISOString(OriginDestinationsRes[0].TargetDate);
          var Dtr =  toISOString(OriginDestinationsRes[1].TargetDate); 
        } 
        
        var  Quantity        = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Quantity;
        var  WeightMeasureQualifier = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].WeightMeasureQualifier;
        var  Weight          = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Weight;
        var  RefItinerary    = res.data.FareInfo.ETTicketFares[0].RefItinerary;
        const Itinerariesdelight =  res.data.FareInfo.Itineraries[0];
  
        var  BaseAmount      = Itinerariesdelight.SaleCurrencyAmount.BaseAmount;
        var  TaxAmount       = Itinerariesdelight.SaleCurrencyAmount.TaxAmount;
        var  TotalAmount     = Itinerariesdelight.SaleCurrencyAmount.TotalAmount;
        let delight = {
          DepartureDate: DepartureDate,
          ArrivalDate: ArrivalDate,
          Dtr:Dtr,
          Otr:Otr,
          Otr1:Otr1,
          Dtr1:Dtr1,
          OriginCode: OriginCode,
          DestinationCode: DestinationCode,
          BaseAmount: BaseAmount,
          TaxAmount: TaxAmount,
          TotalAmount: TotalAmount,
          RefItinerary:RefItinerary,
          Ref:Ref,
          originCity:originCity,
          destinationCity:destinationCity,
          currency: currency,
          symbol:symbol,
          cpd_code:cpd_code,
          FaireFamilies:faireFmailies,
        };
        data.delight.push(delight);
        if(res.data.FareInfo.Itineraries.length > 3){
          const Itinerariesbliss =  res.data.FareInfo.Itineraries[3];  
          var  BaseAmount      = Itinerariesbliss.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesbliss.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesbliss.SaleCurrencyAmount.TotalAmount;
          let bliss = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          };
          data.bliss.push(bliss);
        }  
        if(res.data.FareInfo.Itineraries.length > 8){
          const Itinerariesopulence =  res.data.FareInfo.Itineraries[8]; 
          var  BaseAmount      = Itinerariesopulence.SaleCurrencyAmount.BaseAmount;
          var  TaxAmount       = Itinerariesopulence.SaleCurrencyAmount.TaxAmount;
          var  TotalAmount     = Itinerariesopulence.SaleCurrencyAmount.TotalAmount;
          let opulence = {
            DepartureDate: DepartureDate,
            ArrivalDate: ArrivalDate,
            Dtr:Dtr,
            Otr:Otr,
            Otr1:Otr1,
            Dtr1:Dtr1,
            OriginCode: OriginCode,
            DestinationCode: DestinationCode,
            BaseAmount: BaseAmount,
            TaxAmount: TaxAmount,
            TotalAmount: TotalAmount,
            RefItinerary:RefItinerary,
            Ref:Ref,
            originCity:originCity,
            destinationCity:destinationCity,
            currency: currency,
            symbol:symbol,
            cpd_code:cpd_code,
            FaireFamilies:faireFmailies,
          }; 
          data.opulence.push(opulence);
        }
      }else{
        if(OriginDestinationsArray[key].length == 1){
          var Otr1 = OriginDestinationsArray[key][0].TargetDate;
          var Dtr1 = OriginDestinationsArray[key][0].TargetDate;
        } 
  
        if(OriginDestinationsArray[key].length > 1){
          var Otr1 = OriginDestinationsArray[key][0].TargetDate;
          var Dtr1 = OriginDestinationsArray[key][1].TargetDate; 
        } 
      
  
        DepartureDate = Otr1;
        DepartureDate = parseInt(DepartureDate.substring(6, 19));
        DepartureDate = new Date(DepartureDate).toISOString();
        
        var Otr2 = parseInt(Otr1.substring(6, 19));
        var Otr = new Date(Otr2).toISOString();
        let Dtr = Dtr1; 
        Dtr = parseInt(Dtr.substring(6, 19));
        Dtr = new Date(Dtr).toISOString();
        
        let myObj = {
          DepartureDate: DepartureDate,
          ArrivalDate:DepartureDate,
          Otr:Otr,
          Dtr:Dtr,
          Otr1:Otr1,
          Dtr1:Dtr1,
          OriginCode: '-',
          DestinationCode: '-',
          BaseAmount: '-',
          TaxAmount: '-',
          TotalAmount: '-',
          RefItinerary:'-',
          Ref:'-',
          originCity:'-',
          destinationCity:'-',
          currency: '-',
          symbol:'-',
          cpd_code:'-',
          FaireFamilies:faireFmailies,
        };
        data.delight.push(myObj);
        data.bliss.push(myObj);
        data.opulence.push(myObj); 
      } 
      
    } 
  
  return data;
  }
  public async prepareExchangeFlights(prepareData: prepareExchangeFlightsDto): Promise<Search> {
    if (isEmpty(prepareData)) throw new HttpException(400, 'empty String');

    var URL = API_URL+'PrepareExchange';
    const requestData = {
      request: {
        UniqueID:{
          TypeCode: "PnrCode",
          ID:prepareData.PnrCode
        },
        Verification: { 
          PassengerName:prepareData.PassangerLastname
        },
         
        Offer:{
          RefItinerary:prepareData.RefItinerary,
          Ref:prepareData.Ref,
        },
        IncludeAllOptionalSpecialServices: true,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    
    let dataPer = {
      PassengersDetails: [], 
      MealsDetails:[],
      Passengers:[],
      SeatMaps:[],
      EMDTicketFareOptions:[]
    };
    if(res.data.Booking!=null){ 
      var SpecialServices   =  res.data.Booking.SpecialServices;
      var OptionalSpecialServices   =  res.data.Booking.OptionalSpecialServices;
      var Passengers        = res.data.Booking.Passengers;
      var SeatMaps          =  res.data.SeatMaps;
      var EMDTicketFareOptions =  res.data.FareInfo.EMDTicketFareOptions;
      dataPer.Passengers    = Passengers; 
      dataPer.SeatMaps = SeatMaps;
      dataPer.EMDTicketFareOptions = EMDTicketFareOptions;
      for (const  pass in Passengers) {
        let special = {
          fields:[]
        };
        let optspecial = {
          fields:[]
        };
        for (const  key1 in SpecialServices) { 
          if(SpecialServices[key1].RefPassenger==Passengers[pass].Ref)
          {  
            var Label = await this.specialServiceCode.find({Code:SpecialServices[key1].Code});
            for (const  lab in Label) {
              var LabelName =  Label[lab].Label;
            }
            let myObj = {
              Code: SpecialServices[key1].Code,
              Text:SpecialServices[key1].Text,
              Data:SpecialServices[key1].Data,
              Label: LabelName
            };
            special.fields.push(myObj);
          }
        } 
        dataPer.PassengersDetails.push(special);
        for (const  key1 in OptionalSpecialServices) {
          /* const RefPassengerAd = (parseInt(pass, 10)+parseInt('1', 10)).toString(); */
          
          if(OptionalSpecialServices[key1].RefPassenger== Passengers[pass].Ref)
          {  
             var Label = await this.specialServiceCode.find({Code:OptionalSpecialServices[key1].Code});
             for (const  lab in Label) {
               var LabelName =  Label[lab].Label;
             }
             let myObj = {
               Code: OptionalSpecialServices[key1].Code,
               Label: LabelName
             };
             optspecial.fields.push(myObj);
             
          }
        } 
         dataPer.MealsDetails.push(optspecial);
      }
    }   
    return dataPer;
  }
  public async compareFairFamily(): Promise<Search> {
    var URL = API_URL+'GetValueCodes';
    const requestData = {
      request: {
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        ValueCodeName:"WebClass",
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = {
      delight: [],
      bliss: [],
      opulence: [],
    };
    const codes = res.data.Codes;
    for (const  key in codes) { 
      let ValueCodeProperties = codes[key].ValueCodeProperties;
      if(codes[key].Label=='DELIGHT'){
        ValueCodeProperties.forEach(item => {
          if(item.Name == 'DescriptionHtml'){
            data.delight = extractKeyValuePairs(item.StringValue);
          }
        });
      }
      if(codes[key].Label=='BLISS'){
        ValueCodeProperties.forEach(item => { 
          if(item.Name == 'DescriptionHtml'){
            data.bliss = extractKeyValuePairs(item.StringValue);
          }
        });
      }
      if(codes[key].Label=='OPULENCE'){
        ValueCodeProperties.forEach(item => { 
          if(item.Name == 'DescriptionHtml'){
            data.opulence = extractKeyValuePairs(item.StringValue);
          }
        });
      }
    }
    return data;
  }
   

}

async function processData(res) {
  const dataPer = {
    PassengersDetails: [],
    Passengers: [],
    SeatMaps: [],
    EMDTicketFareOptions: []
  };

  if (res.data.Booking != null) {
    const specialServices = res.data.Booking.SpecialServices;
    const passengers = res.data.Booking.Passengers;
    const seatMaps = res.data.Booking.SeatMaps;
    const EMDTicketFareOptions = res.data.FareInfo.EMDTicketFareOptions;

    dataPer.Passengers = passengers;
    dataPer.SeatMaps = seatMaps;
    dataPer.EMDTicketFareOptions = EMDTicketFareOptions;

    for (const passenger of passengers) {
      const special = {
        fields: []
      };

      for (const service of specialServices) {
        if (service.RefPassenger === passenger.Ref) {
          const labels = await this.specialServiceCode.find({ Code: service.Code });

          for (const label of labels) {
            const myObj = {
              Code: service.Code,
              Text: service.Text,
              Data: service.Data,
              Label: label.Label
            };

            special.fields.push(myObj);
          }
        }
      }

      dataPer.PassengersDetails.push(special);
    }
  }

  return dataPer;
}
export default SearchService;
