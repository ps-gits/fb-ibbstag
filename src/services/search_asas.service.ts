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
    var URL = API_URL+'SearchFlights?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestDataArray = OriginDestinationsArray.map(OriginDestinationsRes => {
      return {
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
    }); 
    const promises = requestDataArray.map(requestData => {
      return axios.post(URL, requestData);
    }); 
    try {
      const responses = await Promise.all(promises); 
      const data = {
        delight: [],
        bliss: [],
        opulence: [],
      }; 

      var OriginCode      =  searchData.OriginDestinations[0].OriginCode;
      var DestinationCode =  searchData.OriginDestinations[0].DestinationCode;
      var LocOrgin =  await this.location.find({Code:OriginCode});
      for (const  loc1 in LocOrgin) {
        var originName =  LocOrgin[loc1].name;
        var originCity =  LocOrgin[loc1].city;
      }
      var LocDest =  await this.location.find({Code:DestinationCode});
      for (const  loc2 in LocDest) {
        var destinationName =  LocDest[loc2].name;
        var destinationCity =  LocDest[loc2].city;
      }
      responses.forEach((res, key) => {
          const OriginDestinationsRes = OriginDestinationsArray[key];
          let faireFmailies = [];
          if(res.data.Passengers!=null){
            const Segments = res.data.Segments;
            const Itineraries = res.data.FareInfo.Itineraries
            let oriIncre = 0;
            let desIncre = 0;
             
            for (const seg of Segments) {
              //for (const OriKey in OriginDestinationsRes) {
                if (seg.OriginCode === OriginDestinationsRes[0].OriginCode &&
                    seg.DestinationCode === OriginDestinationsRes[0].DestinationCode &&
                    oriIncre === 0) {
                    oriIncre += 1;
                    var DepartureDate   = seg.FlightInfo.DepartureDate;
                    var ArrivalDate     = seg.FlightInfo.ArrivalDate;
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
                        Weight: Weight+' '+WeightMeasureQualifier
                      }
                    ],
                    destinationName: destinationName,
                    destinationCity: destinationCity,
                    destinationArrivalDate: destinationArrivalDate,
                    destinationArrivalTime: destinationArrivalTime,
                  };
                  faireFmailies.push(faireFmailiesOriginObj);
                }
              //}
            // for (const DesKey in OriginDestinationsRes) {
                if(OriginDestinationsRes.length >1){
                  if (seg.OriginCode === OriginDestinationsRes[1].OriginCode &&
                      seg.DestinationCode === OriginDestinationsRes[1].DestinationCode && desIncre === 0) {
                    desIncre += 1; 
                    var DepartureDate          = seg.FlightInfo.DepartureDate;
                    var ArrivalDate            = seg.FlightInfo.ArrivalDate;
                    var destinationArrivalTime = formattedTime(ArrivalDate ); 
                    var destinationArrivalDate = localeDateString(ArrivalDate);
                    var orginDepartureTime     = formattedTime(DepartureDate);
                    var orginDepartureDate     = localeDateString(DepartureDate);
                    const faireFmailiesDestinationObj = {
                      orginDepartureDate: orginDepartureDate,
                      orginDepartureTime: orginDepartureTime,
                      originName: destinationName,
                      originCity: destinationCity,
                      luxuryPickup: true,
                      loungeAccess: true,
                      BagAllowances: [
                        {
                          Quantity: Quantity,
                          WeightMeasureQualifier: WeightMeasureQualifier,
                          Weight: Weight+' '+WeightMeasureQualifier
                        }
                      ],
                      destinationName: originName,
                      destinationCity: originCity,
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
            let  ETTicketFares   = res.data.FareInfo.ETTicketFares;
            var  Quantity        = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Quantity;
            var  WeightMeasureQualifier = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].WeightMeasureQualifier;
            var  Weight          = res.data.FareInfo.ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].BagAllowances[0].Weight;
            let  RefItinerary    = '';
            
            const refWebClassDict = {};
              ETTicketFares.forEach((ticketFare,index) => {
                const originDestFares = ticketFare.OriginDestinationFares;
                const refWebClasses = originDestFares.map(fare => fare.RefWebClass);
                const areAllSame = refWebClasses.every(refWebClass => refWebClass === refWebClasses[0]);
                if(areAllSame){
                  refWebClassDict[refWebClasses[0]] = ticketFare.RefItinerary;
                }
              });
              console.log('refWebClassDict',refWebClassDict);
              for (const key in refWebClassDict) {
                  if (refWebClassDict.hasOwnProperty(key)) {
                      const ref = refWebClassDict[key];
                      const itinerary = Itineraries.find(item => item.Ref === ref);
                      if (itinerary) {
                        refWebClassDict[key] = {
                              "SaleCurrencyAmount": itinerary.SaleCurrencyAmount,
                              "RefItinerary": itinerary.Ref
                          };
                      }
                  }
              }
              console.log('refWebClassDict_1',refWebClassDict);
              if(searchData.OriginDestinations.length > 1){
                if((res.data.FareInfo.Itineraries.length > 8 && searchData.DateFlexible==true) || (res.data.FareInfo.Itineraries.length > 2 && searchData.DateFlexible==false)){
                  let Itinerariesdelight =  refWebClassDict[3];
                  RefItinerary         = Itinerariesdelight.RefItinerary;
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
                  let Itinerariesbliss  = refWebClassDict[2];
                  RefItinerary         =  Itinerariesbliss.RefItinerary;   
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
                  let Itinerariesdelight =  refWebClassDict[3]; 
                  let RefItinerary     =  Itinerariesdelight.RefItinerary;
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
                  let   Itinerariesbliss =  refWebClassDict[2];
                  RefItinerary       =  Itinerariesbliss.RefItinerary;
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
              
                const Itinerariesopulence =  refWebClassDict[1]; 
                RefItinerary         =  Itinerariesopulence.RefItinerary;
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
            
              DepartureDate = toISOString(Otr1);
              var Otr = toISOString(Otr1);
              Dtr = toISOString(Dtr1);
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
        });

        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
      
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
               Text:OptionalSpecialServices[key1].Text,
               Data:OptionalSpecialServices[key1].Data,
               Label: LabelName.split(';')[0],
               Describtion: LabelName.split(';')[1],
               RefSegment:OptionalSpecialServices[key1].RefSegment,
               RefPassenger:OptionalSpecialServices[key1].RefPassenger
             };
              let Code       = OptionalSpecialServices[key1].Code;
              let lastTwoChars = Code.slice(-2);
              if(lastTwoChars=='ML'){
                optspecial.fields.push(myObj);
              }
             
            //   const filteredData = EMDTicketFareOptions.filter((item) => {
            //     return  item.AssociatedSpecialServiceCode === OptionalSpecialServices[key1].Code;
            //   }).map((item) => {
            //   // Add more key-value pairs to each item
            //   return {
            //     ...item,
            //     RefPassenger:OptionalSpecialServices[key1].RefPassenger,
            //     RefSegment: OptionalSpecialServices[key1].RefSegment,
            //     // Add more key-value pairs as needed
            //   };
            // });
            // if(filteredData[0]!=null){
            //   dataPer.EMDTicketFareOptions.push(filteredData[0]);
            // }
             
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
    var URL = API_URL+'SearchFlightsForExchange?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    let RefETTicketFareAr = searchData.RefETTicketFare
    const RefETTicketFare = Object.keys(RefETTicketFareAr).map(key => {
      return {
        RefETTicketFare: RefETTicketFareAr[key].RefETTicketFare,
        Extensions: null
      };
    });
    const requestDataArray = OriginDestinationsArray.map(OriginDestinationsRes => {
      return { request: {
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
    }); 
    const promises = requestDataArray.map(requestData => {
      return axios.post(URL, requestData);
    });
    try {
      const responses = await Promise.all(promises); 
      const data = {
        delight: [],
        bliss: [],
        opulence: [],
      };
      var  OriginCode      =  searchData.OriginDestinations[0].OriginCode;
      var  DestinationCode =  searchData.OriginDestinations[0].DestinationCode;
      var LocOrgin =  await this.location.find({Code:OriginCode});
      for (const  loc1 in LocOrgin) {
        var originName =  LocOrgin[loc1].name;
        var originCity =  LocOrgin[loc1].city;
      }
      var LocDest =  await this.location.find({Code:DestinationCode});
      for (const  loc2 in LocDest) {
        var destinationName =  LocDest[loc2].name;
        var destinationCity =  LocDest[loc2].city;
      }
      responses.forEach((res, key) => { 
        const OriginDestinationsRes = OriginDestinationsArray[key]; 
        let faireFmailies = [];
        if(res.data.Segments!=null){
          const Segments = res.data.Segments;
          const Itineraries = res.data.FareInfo.Itineraries;
          let oriIncre = 0;
          let desIncre = 0;
          var  OriginCode      = OriginDestinationsRes[0].OriginCode;
          var  DestinationCode = OriginDestinationsRes[0].DestinationCode;
          for (const seg of Segments) {
            //for (const OriKey in OriginDestinationsRes) {
              if (seg.OriginCode === OriginDestinationsRes[0].OriginCode &&
                  seg.DestinationCode === OriginDestinationsRes[0].DestinationCode &&
                  oriIncre === 0) {
                  oriIncre += 1;
                  var  DepartureDate   = seg.FlightInfo.DepartureDate;
                  var  ArrivalDate     = seg.FlightInfo.ArrivalDate;
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
            if(OriginDestinationsRes.length >1){
              if (seg.OriginCode === OriginDestinationsRes[1].OriginCode &&
                  seg.DestinationCode === OriginDestinationsRes[1].DestinationCode && desIncre === 0) {
                desIncre += 1;
                var DepartureDate   = seg.FlightInfo.DepartureDate;
                var ArrivalDate     = seg.FlightInfo.ArrivalDate;
                var destinationArrivalTime = formattedTime(ArrivalDate ); 
                var destinationArrivalDate = localeDateString(ArrivalDate);
                var orginDepartureTime     = formattedTime(DepartureDate);
                var orginDepartureDate = localeDateString(DepartureDate);
                const faireFmailiesDestinationObj = {
                  orginDepartureDate: orginDepartureDate,
                  orginDepartureTime: orginDepartureTime,
                  originName: destinationName,
                  originCity: destinationCity,
                  luxuryPickup: true,
                  loungeAccess: true,
                  BagAllowances: [
                    {
                      Quantity: BagAllowances[0].Quantity,
                      WeightMeasureQualifier: BagAllowances[0].WeightMeasureQualifier,
                      Weight: BagAllowances[0].Weight
                    }
                  ],
                  destinationName: originName,
                  destinationCity: originCity,
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
          let  ETTicketFares   = res.data.FareInfo.ETTicketFares;
          let  RefItinerary    = "";
          const refWebClassDict = {};
          const BagAllowances = {};
            ETTicketFares.forEach((ticketFare,index) => {
              const originDestFares = ticketFare.OriginDestinationFares;
              const refWebClasses = originDestFares.map(fare => fare.RefWebClass);
              const areAllSame = refWebClasses.every(refWebClass => refWebClass === refWebClasses[0]);
              if(areAllSame){
                refWebClassDict[refWebClasses[0]] = ticketFare.RefItinerary;
                BagAllowances[0] = originDestFares.CouponFares[0].BagAllowances[0]; 
              }
            });
            for (const key in refWebClassDict) {
                if (refWebClassDict.hasOwnProperty(key)) {
                    const ref = refWebClassDict[key];
                    const itinerary = Itineraries.find(item => item.Ref === ref);
                    if (itinerary) {
                      refWebClassDict[key] = {
                            "SaleCurrencyAmount": itinerary.SaleCurrencyAmount,
                            "RefItinerary": itinerary.Ref
                        };
                    }
                }
            }  
          const Itinerariesdelight =  refWebClassDict[3];
          RefItinerary         = Itinerariesdelight.RefItinerary;
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
          if(res.data.FareInfo.Itineraries.length > 2){
            const Itinerariesbliss =  refWebClassDict[2];  
            RefItinerary         = Itinerariesbliss.RefItinerary;
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
          if(res.data.FareInfo.Itineraries.length > 2){
            const Itinerariesopulence =  refWebClassDict[1]; 
            RefItinerary         =  Itinerariesopulence.RefItinerary;
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
          DepartureDate = toISOString(Otr1);
          var Otr = toISOString(Otr1);
          let Dtr = toISOString(Dtr1);
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
      });
      return data;
    }catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  public async prepareExchangeFlights(prepareData: prepareExchangeFlightsDto): Promise<Search> {
    if (isEmpty(prepareData)) throw new HttpException(400, 'empty String');

    var URL = API_URL+'PrepareExchange?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
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
      var OptionalSpecialServices   =  res.data.OptionalSpecialServices;
      var Passengers        = res.data.Booking.Passengers;
      var SeatMaps          =  res.data.SeatMaps;
      var EMDTicketFareOptions =  res.data.FareInfo.EMDTicketFareOptions;
      dataPer.Passengers    = Passengers; 
      dataPer.SeatMaps = SeatMaps;
      var Segments = res.data.Booking.Segments;
      const refArray = Segments.filter(segment => segment.BookingClass.StatusCode === "HK").map(segment => segment.Ref);
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

            var type = '';
            if (refArray[0] === SpecialServices[key1].RefSegment) {
              var type = 'Departure';
            }
            if (refArray[1] === SpecialServices[key1].RefSegment) {
              var type = 'Arrival';
            }
            let myObj = {
              Code: SpecialServices[key1].Code,
              Text:SpecialServices[key1].Text,
              Data:SpecialServices[key1].Data,
              Label: LabelName,
              RefSegment:SpecialServices[key1].RefSegment,
              RefPassenger:SpecialServices[key1].RefPassenger,
              type:type
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
            var type = '';
            if (refArray[0] === OptionalSpecialServices[key1].RefSegment) {
              var type = 'Departure';
            }
            if (refArray[1] === OptionalSpecialServices[key1].RefSegment) {
              var type = 'Arrival';
            }
             let myObj = {
               Code: OptionalSpecialServices[key1].Code,
               Text:OptionalSpecialServices[key1].Text,
               Data:OptionalSpecialServices[key1].Data,
               Label: LabelName.split(';')[0],
               Describtion: LabelName.split(';')[1],
               RefSegment:OptionalSpecialServices[key1].RefSegment,
               RefPassenger:OptionalSpecialServices[key1].RefPassenger,
               type:type
             };
              let Code         = OptionalSpecialServices[key1].Code;
              let lastTwoChars = Code.slice(-2);
              if(lastTwoChars=='ML'){
                optspecial.fields.push(myObj);
              }
              
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
    let keys = ["code", "label", "information", "value", "description",'IsLuxuryBenefits', "priority", "valid"];
            
    for (const  key in codes) { 
      let ValueCodeProperties = codes[key].ValueCodeProperties;
      if(codes[key].Label=='DELIGHT'){
        ValueCodeProperties.forEach(item => {
          if(item.Name == 'DescriptionHtml'){
            var delight = extractKeyValuePairs(item.StringValue);
            delight.forEach(delightitem => {
              let mergedObj = {};
              var sp = delightitem.value.split(';'); // Split the value using a comma (change ',' to your desired delimiter)
              sp.forEach((value, index) => {
                const obj = {[keys[index]]: value };
                mergedObj = { ...mergedObj, ...obj };
              });
              data.delight.push(mergedObj);
            });
          }
        });
      }
      if(codes[key].Label=='BLISS'){
        ValueCodeProperties.forEach(item => { 
          if(item.Name == 'DescriptionHtml'){
            var bliss = extractKeyValuePairs(item.StringValue);
            bliss.forEach(blissitem => {
              let mergedObj = {};
              var sp = blissitem.value.split(';'); // Split the value using a comma (change ',' to your desired delimiter)
              sp.forEach((value, index) => {
                const obj = {[keys[index]]: value };
                mergedObj = { ...mergedObj, ...obj };
              });
              data.bliss.push(mergedObj);
            });
            
          }
        });
      }
      if(codes[key].Label=='OPULENCE'){
        ValueCodeProperties.forEach(item => { 
          if(item.Name == 'DescriptionHtml'){

            var opulence = extractKeyValuePairs(item.StringValue);
            opulence.forEach(opulenceitem => {
              let mergedObj = {};
              var sp = opulenceitem.value.split(';'); // Split the value using a comma (change ',' to your desired delimiter)
              sp.forEach((value, index) => {
                const obj = {[keys[index]]: value };
                mergedObj = { ...mergedObj, ...obj };
              });
              data.opulence.push(mergedObj);
            });
 
          }
        });
      }
    }
    const transformedFareFamily = {
      included:[],
      luxuryBenefit:[],
    };
    data.delight.forEach((fare,index) => {
      const fareItem = {
        code: fare.code,
        label: fare.label,
        delight: {
          information: fare.information,
          value: fare.value,
          description: fare.description,
        },
        bliss: {
          information: data.bliss[index].information,
          value: data.bliss[index].value,
          description: data.bliss[index].description,
        },
        opulence: {
          information: data.opulence[index].information,
          value: data.opulence[index].value,
          description: data.opulence[index].description,
        },
        priority: fare.priority,
        IsLuxuryBenefits:fare.IsLuxuryBenefits
      };
      if(fare.IsLuxuryBenefits=='0'){
        transformedFareFamily.included.push(fareItem);
      }else{
        transformedFareFamily.luxuryBenefit.push(fareItem);
      }
    });
     return transformedFareFamily;  
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
function split(arg0: string, value: any): any[] {
  throw new Error('Function not implemented.');
}

