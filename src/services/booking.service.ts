import { CreateBookingDto,CreateBookingExchangeDto,loadBookingDto,calendarDto,ModifyBookingDto,SearchBookingDto,
  PrepareBookingModiDto,CreateTicketDto,LoadMCOTicketDto,
  SendTicketConfirmationDto,AddItineraryDto,PrepareAdditionalItineraryDto,CancelBookingDto
  ,PrepareCancelBookingDto,paymentRequestDto,PaymentCheckDto,HeadersDto,CabsbookDto} from '@dtos/booking.dto';
import { HttpException } from '@exceptions/HttpException';
import { Booking,LoadBooking,Calendar,Payment} from '@interfaces/booking.interface'; 
import { Search } from '@interfaces/search.interface';
import { isEmpty,formatDate,generateOrderNumber,formattedTime,localeDateString,parseChildren,formatDuration } from '@utils/util';
import { API_URL,API_KEY,END_POINT,CLIENT_ID,CLIENT_SECRET} from '@config';
import locationModel from '@models/location.model';
import specialServiceCodeModel from '@models/specialServiceCode.model';
import bookingHistoryModel from '@models/bookingHistory.model';
import { length } from 'class-validator';
const crypto = require('crypto');
const axios = require('axios');
/* 
*   @function: 
*/
class BookingService {
  public location               = locationModel;
  public specialServiceCode     = specialServiceCodeModel;
  public bookingHistory         = bookingHistoryModel;

  public async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    if (isEmpty(bookingData)) throw new HttpException(400, 'booking request Data is empty'); 
    const BookingData = new Promise(async (resolve, reject) => {
      try {
          const result = await this.bookingRequest(bookingData,'CreateBooking');
          const requestData = {
          request: {  
            Offer:  {
                      RefItinerary: bookingData.RefItinerary,
                      Ref: bookingData.Ref
                    },
            SpecialServices: result.SpecialServices,
            FareInfo:result.FareInfo,
            Passengers:result.Passengers,
            DeferredIssuance:true,
            RequestInfo: {
              AuthenticationKey: API_KEY,
              CultureName: 'en-GB'
            },
            Extensions: null
          }
          };

          var marketingInfo = bookingData.booking[0].PassengerDetails.marketingInfo;
          let dataModify : Booking = await this.Responce(requestData,'CreateBooking',marketingInfo);
          resolve(dataModify);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  } 
  public async modifyBooking(modifybookingData: ModifyBookingDto): Promise<Booking> {
    if (isEmpty(modifybookingData)) throw new HttpException(400, 'booking request Data is empty'); 
    const BookingData = new Promise(async (resolve, reject) => {
      try {
        const result = await this.bookingRequest(modifybookingData,'ModifyBooking');
        const requestData = {
          request: {   
            Passengers: result.Passengers,
            UniqueID: {
              TypeCode: "PnrCode",
              ID:modifybookingData.PnrCode
            }, 
            Verification:{
              PassengerName: modifybookingData.PassengerName
            },
            SpecialServices: result.SpecialServices,
            RemovedSpecialServices:[],
            DeferredIssuance:true,
            RemovedEMDTicketFares:[...result.RemovedFareInfo.RemovedEMDTicketFareForBags, ...result.RemovedFareInfo.RemovedEMDTicketFareForSports],
            EMDTicketFares:result.FareInfo.EMDTicketFares,
            RequestInfo: {
              AuthenticationKey: API_KEY,
              CultureName: 'en-GB'
            },
            Extensions: null
          }
        };
        //resolve(requestData);
        let dataModify : Booking = await this.Responce(requestData,'ModifyBooking');
        resolve(dataModify);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  }
  public async searchBooking(serachbookingData: SearchBookingDto): Promise<Booking> {
    if (isEmpty(serachbookingData)) throw new HttpException(400, 'Search booking request Data is empty'); 
    var URL = API_URL+'SearchBooking?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {  
        CustomerRef: serachbookingData.CustomerRef, 
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
  public async prepareBookingModification(preparebookingData: PrepareBookingModiDto): Promise<Search> {
    if (isEmpty(preparebookingData)) throw new HttpException(400, 'Search booking request Data is empty'); 
    var URL = API_URL+'PrepareBookingModification?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {  
        UniqueID: {
          TypeCode: preparebookingData.TypeCode,
          ID:preparebookingData.ID
        }, 
        Verification:{
          PassengerName: preparebookingData.PassengerName
        },
        DeferredIssuance:false,
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
      PassengersDetailsForCheckin:[], 
      MealsDetails:[],
      Passengers:[],
      SeatMaps:[],
      EMDTicketFareOptions:[],
      cpd_code:"",
      res:res.data 

    };
    if(res.data.Booking!=null){ 
      var response = res.data.Booking; 
      var SpecialServices   =  response.SpecialServices;
      var OptionalSpecialServices   =  res.data.OptionalSpecialServices;
      var SpecialServicesForCheckIns=  res.data.SpecialServices;
      var Passengers                =  response.Passengers;
      var SeatMaps                  =  response.SeatMaps;
      var EMDTicketFareOptionsArr   =  res.data.FareInfo.EMDTicketFareOptions;
      var ETTicketFares             =  response.FareInfo.ETTicketFares; 
      var EMDTicketFares            =  response.FareInfo.EMDTicketFares;
      var EMDTicketFaresAr          =  res.data.FareInfo.EMDTicketFares; 
      var SaleCurrencyCode          =  response.FareInfo.SaleCurrencyCode;
      var Segments                  = response.Segments;
      const refArray = Segments.filter(segment => segment.BookingClass.StatusCode === "HK").map(segment => segment.Ref);
      
      EMDTicketFareOptionsArr.forEach((option) => {
        // Access properties of each option within the loop
        const count = EMDTicketFares.filter((item) => {
          return item.AncillaryCode === option.AncillaryCode;
        }).length;
        option.count = count;
        
        // Perform actions with the properties
        dataPer.EMDTicketFareOptions.push(option)
      }); 
  
      const currencyOrg = await this.location.find({ Code: Segments[0].OriginCode });
      let cpd_code; // Declare the variables outside the loop
      currencyOrg.forEach((currencyData) => {
        cpd_code = currencyData.cpd_code;
      });
      dataPer.cpd_code   = cpd_code; 
      dataPer.Passengers = Passengers; 
      if(preparebookingData.checkInPassengers.length > 0){
        const refSegmentValue = preparebookingData.checkInPassengers.length > 0 ? preparebookingData.checkInPassengers[0].RefSegment : null;
        dataPer.SeatMaps   = SeatMaps.filter(item => item.RefSegment === refSegmentValue);

      }else{
        dataPer.SeatMaps   = SeatMaps;
      }
      const prepaidExcessBaggageVoucher = EMDTicketFareOptionsArr.find(item => item.AssociatedSpecialServiceCode === "EXBG");

      const prepaidExcessSportsVoucher = EMDTicketFareOptionsArr.find(item => item.AssociatedSpecialServiceCode === "SPEQ");
       
      var ECTC = true;
      for (const  pass in Passengers) { 

        if (prepaidExcessBaggageVoucher) {
          const appliableRefSegments = prepaidExcessBaggageVoucher.AppliableRefSegments;

          if (Array.isArray(appliableRefSegments)) {
              dataPer.Passengers[pass].bags = []; 
              for (let i = 0; i < appliableRefSegments.length; i++) {
                const bagAllowancesArray = await Promise.all(ETTicketFares.map((item) => {
                  const couponFare = item.OriginDestinationFares.find((fare) =>
                    fare.CouponFares.some((fare2) =>
                      appliableRefSegments[i] === fare2.RefSegment
                    )
                  );

                  if (couponFare) {
                    return couponFare.CouponFares[0].BagAllowances[0];
                  } else {
                    return null; // If no match is found, you can choose to return null or some default value
                  }
                }));

                const RemovedBags = EMDTicketFares
                .filter(item => item.RefPassenger === Passengers[pass].Ref && item.RefSegment === appliableRefSegments[i] && item.AssociatedSpecialServiceCode === "EXBG")
                .map(item => item.Ref);

                const RemovedSports = EMDTicketFares
                .filter(item => item.RefPassenger === Passengers[pass].Ref && item.RefSegment === appliableRefSegments[i] && item.AssociatedSpecialServiceCode === "SPEQ")
                .map(item => item.Ref);



                const RemovedBags2 = EMDTicketFaresAr
                .filter(item => item.RefPassenger === Passengers[pass].Ref && item.RefSegment === appliableRefSegments[i] && item.AssociatedSpecialServiceCode === "EXBG")
                .map(item => item.Ref);

                const RemovedSports2 = EMDTicketFaresAr
                .filter(item => item.RefPassenger === Passengers[pass].Ref && item.RefSegment === appliableRefSegments[i] && item.AssociatedSpecialServiceCode === "SPEQ")
                .map(item => item.Ref);


                var RemovedBagsArr =  RemovedBags.filter(value => !RemovedBags2.includes(value));
                var RemovedSportsArr =  RemovedSports.filter(value => !RemovedSports2.includes(value));

  
                let bagObj = { 
                  Label:prepaidExcessBaggageVoucher.Label,
                  Code :prepaidExcessBaggageVoucher.AssociatedSpecialServiceCode,
                  RefSegment: appliableRefSegments[i],
                  RefPassenger:Passengers[pass].Ref,
                  Data:'',
                  Text:'',
                  SaleCurrencyCode:SaleCurrencyCode,
                  EMDTicketFareForBags:prepaidExcessBaggageVoucher,
                  RemovedEMDTicketFareForBags:RemovedBagsArr,
                  BagAllowances:bagAllowancesArray[0],
                  EMDTicketFareForSports:prepaidExcessSportsVoucher,
                  RemovedEMDTicketFareForSports:RemovedSportsArr
                };
                dataPer.Passengers[pass].bags.push(bagObj); 
            }
          }
        } 
        let specialfoChechIn = {
          fields:[]
        };
        let special = {
          fields:[]
        };
        let optspecial = {
          fields:[]
        };

        const seatData = EMDTicketFareOptionsArr.find(item => item.AssociatedSpecialServiceCode === "SEAT");
 
        if (seatData) {
          const seatRefSegments = seatData.AppliableRefSegments;
          //const seatRefSegments = seatData.AppliableRefSegments;

          if (Array.isArray(seatRefSegments)) {
              for (let i = 0; i < seatRefSegments.length; i++) {
               // if(seatRefSegments[i]==Passengers[pass].Ref)
                //{ 
                  let myObj = {
                    Code :seatData.AssociatedSpecialServiceCode,
                    Data:'',
                    Text:'',
                    Label:seatData.Label, 
                    type:'',
                    RefSegment: seatRefSegments[i],
                    RefPassenger:Passengers[pass].Ref,
                  };
                  specialfoChechIn.fields.push(myObj);
                //}  
             }
          }
        }

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
              type:type,
              RefSegment:SpecialServices[key1].RefSegment,
              RefPassenger:SpecialServices[key1].RefPassenger,
            };
            special.fields.push(myObj);
          }
        } 
        dataPer.PassengersDetails.push(special);

        for (const  key1 in SpecialServicesForCheckIns) { 
          if(SpecialServicesForCheckIns[key1].RefPassenger==Passengers[pass].Ref)
          {  
            var Label = await this.specialServiceCode.find({Code:SpecialServicesForCheckIns[key1].Code});
            for (const  lab in Label) {
              var LabelName =  Label[lab].Label;
            }

            var type = '';
            if (refArray[0] === SpecialServicesForCheckIns[key1].RefSegment) {
              var type = 'Departure';
            }
            if (refArray[1] === SpecialServicesForCheckIns[key1].RefSegment) {
              var type = 'Arrival';
            }
            // if(SpecialServicesForCheckIns[key1].Code==='DOCS'){
            //   let Fields = [
            //       "Documents[0].IssueCountryCode",
            //       "Documents[0].NationalityCountryCode",
            //       "Documents[0].DocumentExpiryDate",
            //       "Documents[0].DocumentIssuanceDate",
            //       "Documents[0].DocumentTypeCode",
            //       "Documents[0].DocumentNumber"
            //   ];

            //   SpecialServicesForCheckIns[key1].Data.Fields  = Fields;
            // }
            let myObj = {
              Code: SpecialServicesForCheckIns[key1].Code,
              Text:SpecialServicesForCheckIns[key1].Text,
              Data:SpecialServicesForCheckIns[key1].Data,
              Label: LabelName,
              type:type,
              RefSegment:SpecialServicesForCheckIns[key1].RefSegment,
              RefPassenger:SpecialServicesForCheckIns[key1].RefPassenger,
            };
            specialfoChechIn.fields.push(myObj);
          }
        } 
       
        for (const  key1 in OptionalSpecialServices) { 
            
               
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
              //if(OptionalSpecialServices[key1].Code==='EXT-ECTC'){
                if(ECTC){
                  var ECTC = false;
                  let myObj = {
                    Code: 'EXT-ECTC',//OptionalSpecialServices[key1].Code,
                    Text:OptionalSpecialServices[key1].Text,
                    Data:OptionalSpecialServices[key1].Data,
                    Label: LabelName,
                    type:type,
                    RefSegment:OptionalSpecialServices[key1].RefSegment,
                    RefPassenger:OptionalSpecialServices[key1].RefPassenger,
                  };
                  specialfoChechIn.fields.push(myObj);
                }
              //}
             
             
        } 


        dataPer.PassengersDetailsForCheckin.push(specialfoChechIn);
 
        for (const  key1 in OptionalSpecialServices) { 
          if(OptionalSpecialServices[key1].RefPassenger==Passengers[pass].Ref)
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
              Label: LabelName,
              RefSegment:OptionalSpecialServices[key1].RefSegment,
              RefPassenger:OptionalSpecialServices[key1].RefPassenger,
              type:type
            };
            let Code         = OptionalSpecialServices[key1].Code;
              let lastTwoChars = Code.slice(-2);
              if(lastTwoChars=='ML'){
                optspecial.fields.push(myObj);
              }
            
            // const filteredData = EMDTicketFareOptions.filter((item) => {
            //   return  item.AssociatedSpecialServiceCode === OptionalSpecialServices[key1].Code;
            // }).map((item) => {
            
            //   return {
            //     ...item,
            //     RefPassenger:OptionalSpecialServices[key1].RefPassenger,
            //     RefSegment: OptionalSpecialServices[key1].RefSegment,
                
            //   };
            // });
            // if(filteredData[0]!=null){
            //   dataPer.EMDTicketFareOptions.push(filteredData[0]);
            // }
          }
        } 
        dataPer.MealsDetails.push(optspecial);
      }
    }else{
      if (res.data.ResponseInfo.Error.Message) throw new HttpException(400, res.data.ResponseInfo.Error.Message); 
    }
    return dataPer;
  }
  /*
  *   @function: 
  */
  public async loadBooking(loadBookingData: loadBookingDto): Promise<Booking> {
    if (isEmpty(loadBookingData)) throw new HttpException(400, 'booking Data is empty');
      const BookingData = new Promise(async (resolve, reject) => {
      try {
          const requestData = {
              request: {
                UniqueID:{
                  TypeCode: loadBookingData.TypeCode,
                  ID: loadBookingData.ID
                },
                IncludeFareRules: true,
                IncludeSeatMaps: true,
                IncludeSegmentStops: true,
                IncludeDCSCoupons: true,
                Verification:  {
                    PassengerName: loadBookingData.PassengerName
                },
                RequestInfo: {
                  AuthenticationKey: API_KEY,
                  CultureName: 'en-GB'
                },
              }
          };
          let data : Booking = await this.Responce(requestData,'LoadBooking');
          resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  }  
   
  /*
  *   @function: calendar
  */
  public async calendar(calendarData: calendarDto): Promise<Calendar> {
    if (isEmpty(calendarData)) throw new HttpException(400, 'calendar Data is empty');
    var URL = API_URL+'Calendar?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {
        OriginDestinationQueries:{
          StartDate: calendarData.StartDate,
          EndDate: calendarData.EndDate,
          OriginCode: calendarData.OriginCode,
          DestinationCode: calendarData.DestinationCode
        },
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
 
  public async createTicket(createTicketData: CreateTicketDto, callback: () => void): Promise<Booking> {
    if (isEmpty(createTicketData)) throw new HttpException(400, 'Create ticket request Data is empty');
    var URL = API_URL+'CreateTicket?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const BookingVal2 = new Promise(async (resolve, reject) => {
        try {
            setTimeout(async () => {
                const query = { 'pnrcode': createTicketData.ID };
                const BookingVal = await this.bookingHistory.findOne(query); 
                if (BookingVal && BookingVal.transactionId === null) {
                    // Invoke the callback when transactionId is null
                    callback();
                } 
                if (!isEmpty(BookingVal.transactionId)) {
                    
                    setTimeout(async () => {
                        const BookingHis = await this.bookingHistory.findOne(query);
                        const requestData = {
                          request: {
                              UniqueID: {
                                  TypeCode: "PnrCode",
                                  ID: createTicketData.ID
                              },
                              Verification: {
                                  PassengerName: createTicketData.PassengerName
                              },
                              RequestInfo: {
                                  AuthenticationKey: API_KEY,
                                  CultureName: 'en-GB'
                              },
                              Extensions: null
                          }
                      };
                      
                      // Check if Amount is not equal to 0
                      if (createTicketData.Amount !== 0) {
                          requestData.request.Fops = [{
                              Code: 'Credit_Card',
                              Amount: createTicketData.Amount,
                              UnsecureCardInfo: {
                                  TransactionNumber: BookingHis.transactionId,
                                  CardNumber: BookingHis.cardNumber
                              },
                              MiscInfo: {
                                  RecordReferenceNumber: "10000250"
                              }
                          }];
                      }
                             
                        let data = this.Responce(requestData,'CreateTicket');
                        resolve(data);
                    }, 500);
                } else {
                  const requestData = {
                    request: {
                        UniqueID: {
                            TypeCode: "PnrCode",
                            ID: createTicketData.ID
                        },
                        Verification: {
                            PassengerName: createTicketData.PassengerName
                        },
                        RequestInfo: {
                            AuthenticationKey: API_KEY,
                            CultureName: 'en-GB'
                        },
                        Extensions: null
                    }
                };
                
                // Check if Amount is not equal to 0
                if (createTicketData.Amount !== 0) {
                    requestData.request.Fops = [{
                        Code: 'Credit_Card',
                        Amount: createTicketData.Amount,
                        UnsecureCardInfo: {
                            TransactionNumber: BookingHis.transactionId,
                            CardNumber: BookingHis.cardNumber
                        },
                        MiscInfo: {
                            RecordReferenceNumber: "10000250"
                        }
                    }];
                }          
                  let data =   this.Responce(requestData,'CreateTicket');
                  resolve(data);
                }
            }, 500);
        } catch (error) {
            reject(error);
        }
    });
    return BookingVal2;
  }
  public async loadMCOTicket(loadMCOTicketData: LoadMCOTicketDto): Promise<Booking> {
    if (isEmpty(loadMCOTicketData)) throw new HttpException(400, 'Load MCO ticket request Data is empty'); 
    var URL = API_URL+'LoadMCOTickets?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {  
        CurrencyCode: loadMCOTicketData.CurrencyCode, 
        CustomerReference:{
          Login:loadMCOTicketData.Login,
          RefCustomer:loadMCOTicketData.RefCustomer
        },
        PnrReference:{
          PnrCode:loadMCOTicketData.PnrCode,
          DocumentNumber:loadMCOTicketData.DocumentNumber
        },
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
  public async sendTicketConfirmation(sendTicketConfirmationData: SendTicketConfirmationDto): Promise<Booking> {
    if (isEmpty(sendTicketConfirmationData)) throw new HttpException(400, 'Load Send ticket Confirmation request Data is empty'); 
    var URL = API_URL+'SendTicketConfirmation?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {  
        UniqueID:{
          TypeCode: sendTicketConfirmationData.TypeCode,
          ID: sendTicketConfirmationData.ID
        }, 
        Verification:  {
            PassengerName: sendTicketConfirmationData.PassengerName
        },
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
  public async addItinerary(addItineraryData: AddItineraryDto): Promise<Booking> {
    if (isEmpty(addItineraryData)) throw new HttpException(400, 'Add Itinerary request Data is empty'); 
    var URL = API_URL+'AddItinerary?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';

    const obj = addItineraryData;
    const Passengers = [];
    const SpecialServices = [];
    const FareInfo = {
                      EMDTicketFares: []
                  };
   
     
      var SpecialServicesObj = obj.SpecialServices;
      var DocumentsObj = obj.Documents;
      // For Special Services DOB
      if(SpecialServicesObj.EXTADOB!=''){
        const Dob = {
            Data: {
              Adof: {
                DateOfBirth: SpecialServicesObj.EXTADOB
              },
              Fields: [
                "DateOfBirth"
              ]
            },
            RefPassenger: "Traveler_Type_1_Index_1",
            Code: "EXT-ADOB"
          }
        
        SpecialServices.push(Dob);
      }
      // Request For CTCE
      if(SpecialServicesObj.CTCE!=''){
        const CTCE = {
          Text:SpecialServicesObj.CTCE,
          RefPassenger: "Traveler_Type_1_Index_1",
          Code: "CTCE"
        } 
        SpecialServices.push(CTCE);
      }
      // Request For CTCH
      if(SpecialServicesObj.CTCH!=''){
        const CTCH = {
          Text:String(SpecialServicesObj.CTCH).replace(/\s/g, ''),
          RefPassenger: "Traveler_Type_1_Index_1",
          Code: "CTCH"
        } 
        SpecialServices.push(CTCH);
      }  
      // Request For CTCM
      if(SpecialServicesObj.CTCM!=''){
        const CTCM = {
          Text:String(SpecialServicesObj.CTCM).replace(/\s/g, ''),
          RefPassenger: "Traveler_Type_1_Index_0",
          Code: "CTCM"
        } 
        SpecialServices.push(CTCM);
      }  


      if(DocumentsObj){
        const DOC =  {
          Data: {
            Docs: {
              "Documents":DocumentsObj  
            },
            Fields: [
              "Documents[0].DocumentTypeCode",
              "Documents[0].DocumentNumber",
              "Documents[0].NationalityCountryCode"
            ]
          },
          RefPassenger: "Traveler_Type_1_Index_0",
          Code: "DOCS"
        }
        SpecialServices.push(DOC);
      }
    
    const requestData = {
      request: {  
        Offer:  {
          RefItinerary: addItineraryData.RefItinerary,
          Ref: addItineraryData.Ref
        },
        SpecialServices: SpecialServices,
        FareInfo:FareInfo,
        Passengers:Passengers, 

        UniqueID:{
          TypeCode: addItineraryData.TypeCode,
          ID: addItineraryData.ID
        }, 
        Verification:  {
            PassengerName: addItineraryData.PassengerName
        },
        Segments:addItineraryData.Segments,
        PromoCode:addItineraryData.PromoCode,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
  public async prepareAdditionalItinerary(addItineraryData: PrepareAdditionalItineraryDto): Promise<Booking> {
    if (isEmpty(addItineraryData)) throw new HttpException(400, 'Prepare Additional Itinerary request Data is empty'); 
    var URL = API_URL+'PrepareAdditionalItinerary?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const FareInfo = {
        EMDTicketFares: []
    };
    const requestData = {
      request: {  
        Offer:{
          RefItinerary: addItineraryData.RefItinerary,
          Ref: addItineraryData.Ref
        },
        FareInfo:FareInfo,
        UniqueID:{
          TypeCode: addItineraryData.TypeCode,
          ID: addItineraryData.ID
        }, 
        Verification:  {
            PassengerName: addItineraryData.PassengerName
        },
        Segments:addItineraryData.Segments,
        PromoCode:addItineraryData.PromoCode,
        IncludeAllOptionalSpecialServices:true,
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = res.data;
    return data;
  }
  public async cancelBooking(cancelBookingData: CancelBookingDto): Promise<Booking> {
    if (isEmpty(cancelBookingData)) throw new HttpException(400, 'Cancel Booking request Data is empty'); 
    const BookingData = new Promise(async (resolve, reject) => {
      try {
          const requestData = {
            request: {  
              UniqueID:{
                TypeCode: "PnrCode",
                ID: cancelBookingData.PnrCode
              }, 
              Verification:  {
                  PassengerName: cancelBookingData.PassengerName
              },
              CancelSettings: {
                RefundRequestSettings:    {
                    Message: "Refund initiated on Beond IBE by Passenger",
                    RefundRequestActionCode: "Create",
                    ShouldCancelSegments: true
                }
              }, 
              RequestInfo: {
                AuthenticationKey: API_KEY,
                CultureName: 'en-GB'
              },
              Extensions: null
            }
          };
          let data : Booking = await this.Responce(requestData,'Cancel');
          resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  } 
  public async prepareCancelBooking(prepareCancelBookingData: PrepareCancelBookingDto): Promise<Booking> {
    if (isEmpty(prepareCancelBookingData)) throw new HttpException(400, 'Prepare Additional Itinerary request Data is empty'); 
    var URL = API_URL+'PrepareCancel?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    const requestData = {
      request: {  
        UniqueID:{
          TypeCode: "PnrCode",
          ID: prepareCancelBookingData.PnrCode
        }, 
        Verification:  {
            PassengerName: prepareCancelBookingData.PassengerName
        },
        CancelSettings: {
          RefundSettings:{}
        },  
        
        RequestInfo: {
          AuthenticationKey: API_KEY,
          CultureName: 'en-GB'
        },
        Extensions: null
      }
    };
    let res =  await axios.post(URL, requestData);
    let data = {
      Passengers: {},
      Amount:{},
      OriginDestination: [],
      PnrInformation:{}
    };
    if(res.data.Booking != null){
      let response  = res.data;
      let FareInfo =  response.Booking.FareInfo;
      var SaleCurrencyAmountToRefund = response.FareInfo.SaleCurrencyAmountToRefund;
      var Segments                = response.Booking.Segments;
      var ETTicketFares           = FareInfo.ETTicketFares;
      var PassengersA             = response.Booking.Passengers;
      var PnrInformation          = response.Booking.PnrInformation;
      var SaleCurrencyCode        = FareInfo.SaleCurrencyCode;
      let PassengerQuantityChild  = 0;
      let PassengerQuantityAdult = 0;
      for (const  pas in PassengersA) {
        if(PassengersA[pas].PassengerTypeCode=='AD'){
          PassengerQuantityAdult += PassengersA[pas].PassengerQuantity;
        }
        if(PassengersA[pas].PassengerTypeCode=='CHD'){
          PassengerQuantityChild += PassengersA[pas].PassengerQuantity;
        }
         
        let Passengers =  {
          "Adult": PassengerQuantityAdult,
          "Children": PassengerQuantityChild
        };
        data.Passengers = Passengers;
      }  
        
        let Amount  =  {
          "DiscountAmount":0,
          "BaseAmount": 0,
          "TaxAmount": 0,
          "TotalAmount": SaleCurrencyAmountToRefund.TotalAmount,
          "MilesAmount": SaleCurrencyAmountToRefund.MilesAmount,
          "SaleCurrencyCode":SaleCurrencyCode,
          "Extensions": null
        };
        data.Amount = Amount; 
        for (const  seg in Segments) {
          if(Segments[seg].BookingClass.StatusCode!=='XX')
          {
            let ct: number = 0;
            console.log(ETTicketFares);
            console.log(ETTicketFares[ct].OriginDestinationFares[0].CouponFares[0]);
            let BagAllowancesArr = ETTicketFares[ct].OriginDestinationFares[0].CouponFares[0].BagAllowances[0];
            console.log(BagAllowancesArr);
            let BagAllowances  =  {
              "Quantity": BagAllowancesArr.Quantity,
              "WeightMeasureQualifier": BagAllowancesArr.WeightMeasureQualifier,
              "Weight":BagAllowancesArr.Weight,
              "Extensions": BagAllowancesArr.Extensions,
              "CarryOn": BagAllowancesArr.CarryOn
            };

            var OriginCode1 = await this.location.find({Code:Segments[seg].OriginCode});
            for (const  loc2 in OriginCode1) {
              var OriginCity =  OriginCode1[loc2].city;
            }
            var DestinationCode1 = await this.location.find({Code:Segments[seg].DestinationCode});
            for (const  loc2 in DestinationCode1) {
              var DestinationCity =  DestinationCode1[loc2].city;
            }
            let OriginDestination =     {
              "OriginCode": Segments[seg].OriginCode,
              "OriginCity": OriginCity,
              "DestinationCode": Segments[seg].DestinationCode,
              "DestinationCity":DestinationCity,
              "DepartureDate": localeDateString(Segments[seg].FlightInfo.ArrivalDate),
              "OrginDepartureTime":formattedTime(Segments[seg].FlightInfo.DepartureDate),
              "DestinationArrivalTime":formattedTime(Segments[seg].FlightInfo.ArrivalDate),
              "ArrivalDate":  localeDateString(Segments[seg].FlightInfo.DepartureDate),
              "OriginAirportTerminal": Segments[seg].FlightInfo.OriginAirportTerminal,
              "DestinationAirportTerminal": Segments[seg].FlightInfo.DestinationAirportTerminal,
              "BagAllowances":  BagAllowances,
              "FlightNumber": Segments[seg].FlightInfo.FlightNumber,
              "Stops": Segments[seg].FlightInfo.Stops,
              "Remarks":Segments[seg].FlightInfo.Remarks,
            };
            data.OriginDestination.push(OriginDestination);
            data.PnrInformation = PnrInformation;
          }  
        }
        
    }else{
      if (res.data.ResponseInfo.Error.Message) { 
        throw new HttpException(400,res.data.ResponseInfo.Error.Message);
      }
    }
    return data;
  } 

  public async cabsBooking__(modifybookingData: ModifyBookingDto): Promise<Booking> {
    if (isEmpty(modifybookingData)) throw new HttpException(400, 'Cabs booking require Data is empty'); 
    var URL = API_URL+'LoadBooking?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    
    const requestDataTTl = {
        request: {
          UniqueID:{
            TypeCode: "PnrCode",
            ID:modifybookingData.PnrCode,
          },
          IncludeFareRules: true,
          IncludeSeatMaps: true,
          IncludeSegmentStops: true,
          IncludeDCSCoupons: true,
          Verification:  {
              PassengerName: modifybookingData.PassengerName,
          },
          RequestInfo: {
            AuthenticationKey: API_KEY,
            CultureName: 'en-GB'
          },
        }
    };
    let resTTl =  await axios.post(URL, requestDataTTl);
    let resTTlData  = resTTl.data.Booking.TicketInfo.ETTickets;
    
    const endpoint = END_POINT+'oauth2/token';
    const clientId = CLIENT_ID;
    const clientSecret = CLIENT_SECRET; 
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestData = new URLSearchParams();
    requestData.append('grant_type', 'client_credentials');
    let res =  await axios.post(endpoint, requestData,{ headers });
    let data = JSON.stringify({
      "entitlement_type": "voucher",
      "coverage": {
        "type": "distance",
        "details": {
          "valid_from": "2023-09-15",
          "valid_until": "2023-12-31",
          "value": 50,
          "unit": "KM",
          "redemption_limit": 2
        }
      },
      "services": [
        {
          "type": "ride",
          "conditions": {
            "categories": [
              "transfer"
            ],
            "vehicle_classes": [
              "business_class",
              "business_van"
            ],
            "start_date": "2023-09-15",
            "end_date": "2023-12-31"
          }
        }
      ],
      "booking": {
        "reference": modifybookingData.PnrCode,
        "service_designator": "FLIGHT123",
        "guests": 1,
        "departure": "MUC",
        "arrival": "DXB",
        "start_date": "2023-10-01T00:00:00+00:00",
        "end_date": "2023-10-02T00:00:00+00:00"
      },
      "guest": {
        "lead": true,
        "title": "mr",
        "first_name": "John",
        "last_name": "Doe",
        "email": "your@email.com"
      }
    }); 
    let config = {
      method: 'post', 
      url: END_POINT+'entitlements',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer '+res.data.access_token, 
      },
      data : data
    };
    let res2 =  await axios.request(config);
    if(res2.data.uuid){

    }
    res2.data.cabsUrl = 'https://beond.blacklane.com';
    return res2.data;
  } 

  public async cabsBooking(modifybookingData: ModifyBookingDto): Promise<Booking> {
    if (isEmpty(modifybookingData)) throw new HttpException(400, 'Cabs booking require Data is empty'); 
    var URL = API_URL+'LoadBooking?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    
    const requestDataTTl = {
        request: {
          UniqueID:{
            TypeCode: "PnrCode",
            ID:modifybookingData.PnrCode,
          },
          IncludeFareRules: true,
          IncludeSeatMaps: true,
          IncludeSegmentStops: true,
          IncludeDCSCoupons: true,
          Verification:  {
              PassengerName: modifybookingData.PassengerName,
          },
          RequestInfo: {
            AuthenticationKey: API_KEY,
            CultureName: 'en-GB'
          },
        }
    };
    let resTTl =  await axios.post(URL, requestDataTTl);
    let resTTlData       = resTTl.data.Booking.TicketInfo.ETTickets;
    let Passengers       = resTTl.data.Booking.Passengers[0].NameElement;
    let specialServices  = resTTl.data.Booking.SpecialServices;
     
    const ctceService = specialServices.find(service => service.Code === "CTCE");
    let email = "";
    if(ctceService){
      let email = ctceService.Text;
    }
    let CouponsDataArr = resTTlData[0].Coupons;
    let PnrCode = modifybookingData.PnrCode;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const entitlementsArray = [];
    for (const CouponsData of CouponsDataArr) {
        const flightNumber    = CouponsData.SegmentSold.FlightInfo.FlightNumber;
        const ArrivalDate     = CouponsData.SegmentSold.FlightInfo.ArrivalDate;
        const DepartureDate     = CouponsData.SegmentSold.FlightInfo.DepartureDate;
        const OriginCode      = CouponsData.SegmentSold.OriginCode;
        const DestinationCode = CouponsData.SegmentSold.DestinationCode;
        
        let dataJson = JSON.stringify({
          "entitlement_type": "voucher",
          "coverage": {
            "type": "distance",
            "details": {
              "valid_from":formattedDate,
              "valid_until": localeDateString(ArrivalDate),
              "value": 50,
              "unit": "KM",
              "redemption_limit": 2
            }
          },
          "services": [
            {
              "type": "ride",
              "conditions": {
                "categories": [
                  "transfer"
                ],
                "vehicle_classes": [
                  "business_class",
                  "business_van"
                ],
                "start_date": localeDateString(DepartureDate),
                "end_date": localeDateString(ArrivalDate),
              }
            }
          ],
          "booking": {
            "reference": modifybookingData.PnrCode,
            "service_designator": flightNumber,
            "guests": 1,
            "departure": OriginCode,
            "arrival": DestinationCode,
            "start_date": "2023-10-01T00:00:00+00:00",
            "end_date": "2023-10-02T00:00:00+00:00"
          },
          "guest": {
            "lead": true,
            "title": "mr",
            "first_name":Passengers.Firstname,
            "last_name":Passengers.Surname,
            "email": "your@email.com"
          }
        }); 
        entitlementsArray.push(dataJson);
    } 
    const endpoint = END_POINT+'oauth2/token';
    const clientId = CLIENT_ID;
    const clientSecret = CLIENT_SECRET; 
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    const requestData = new URLSearchParams();
    requestData.append('grant_type', 'client_credentials');
    let res =  await axios.post(endpoint, requestData,{ headers });

    const promises = entitlementsArray.map(data => {
      let config = {
        method: 'post', 
        url: END_POINT+'entitlements',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer '+res.data.access_token, 
        },
        data : data
      };

      return axios.request(config);
    });

   try {
    
    const responses = await Promise.all(promises); 
      responses[0].data.cabsUrl = 'https://beond.blacklane.com';
      return responses[0].data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    } 
     
    // if(res2.data.uuid){

    // }
    // res2.data.cabsUrl = 'https://beond.blacklane.com';
    // return res2.data;
  }  
   
  public async exchangeCreateBooking(bookingData: CreateBookingExchangeDto): Promise<Booking> {
    if (isEmpty(bookingData)) throw new HttpException(400, 'booking request Data is empty'); 
    const BookingData = new Promise(async (resolve, reject) => {
      try {
        const result = await this.bookingRequest(bookingData,'Exchange');
        let RefETTicketFareAr = bookingData.RefETTicketFare;
        const RefETTicketFare =  RefETTicketFareAr.map(item => {
          const RefETTicketFare = item.ETTicketFareTargets[0].RefETTicketFare;
          const CouponOrders = item.ETTicketFareTargets[0].CouponOrders;
          const Extensions = item.Extensions;
          return { RefETTicketFare, Extensions,CouponOrders };
        });
        const requestData = {
          request: { 
            UniqueID:{
              TypeCode: "PnrCode",
              ID:bookingData.PnrCode
            },
            Verification: { 
              PassengerName:bookingData.PassangerLastname
            },
            TicketFaresToExchange:RefETTicketFare,
            Offer: {
                      RefItinerary: bookingData.RefItinerary,
                      Ref: bookingData.Ref
                    },
            SpecialServices: result.SpecialServices,
            FareInfo:result.FareInfo,
            //Passengers:result.Passengers,
            RequestInfo: {
              AuthenticationKey: API_KEY,
              CultureName: 'en-GB'
            },
            Extensions: null
          }
        };
       
        let data : Booking = await  this.Responce(requestData,'Exchange');
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  } 
  public async paymentRequest(paymentRequestData: paymentRequestDto): Promise<Payment> {
    if (isEmpty(paymentRequestData)) throw new HttpException(400, 'Payment request Data is empty'); 
    const query = { 'pnrcode': paymentRequestData.PnrCode };
    const BookingVal = await this.bookingHistory.findOne(query);
    // Generate a random order number with a length of 8 characters
    const randomOrderNumber =  paymentRequestData.PnrCode+'_'+generateOrderNumber(3);
    const clientId = '11100';
    const orderNo = randomOrderNumber;
    const email   = BookingVal.email;
    //const amount =  Math.trunc(paymentRequestData.amount)*100;
    const value = paymentRequestData.amount;
    const roundedValue = value.toFixed(2);
    const amount =  parseFloat(roundedValue*100).toFixed(0);
    const countryId = paymentRequestData.cpd_code;
    const salt = 'az1sx2dc3fv';
    // Concatenate the parameters to form the input string
    // clientid+orderid+amount+countryid+email+salt
    const inputString = clientId + orderNo + amount + countryId + email + salt;
    // Generate SHA512 hash of the input string to obtain the SALT value
    const saltHash = crypto.createHash('sha512').update(inputString).digest('hex');
    //<input type="hidden" name="amount" value="`+Math.trunc(paymentRequestData.amount)+`.00">
    const html = `
      <form id="hpp" method="post" action=" https://ehpp2.uat.europe-west1.cellpoint.app/views/web.php">
        <input type="hidden" name="country" value="`+countryId+`"> <!-- ISO country Code --> 
        <input type="hidden" name="amount" value="`+roundedValue+`">
        <input type="hidden" name="clientid" value="11100">
        <input type="hidden" name="account" value="111002">
        <input type="hidden" name="orderid" value="`+orderNo+`">
        <input type="hidden" name="currency-code" value="`+countryId+`"> <!-- ISO currency Code-->
        <!-- <input type="hidden" name="mobile" value="9898989898"> -->
        <input type="hidden" name="email" value="`+email+`">
        <input type="hidden" name="response-content-type" value="2">
        <input type="hidden" name="txntype" value="1">
        <input type="hidden" name="hmac" value="`+saltHash+`">
        <input type="hidden" name="accept-url" value="https://fe-flight-booking.vercel.app/api/paymentaccept"> <!-- Merchant's Browser URL -->
        <input type="hidden" name="cancel-url" value="https://fe-flight-booking.vercel.app/api/paymentcancel"> <!-- Merchant's Browser URL -->
        <input type="hidden" name="callback-url" value="https://flight.manageprojects.in/paymentCheck"> <!-- Merchant's Server URL -->
         
      </form>
    `;
    let data = {
      html: '',
    };
    data.html = html;
    return data;
  }
  public async paymentCheck(paymentCheckData: PaymentCheckDto): Promise<Payment> {
    if (isEmpty(paymentCheckData)) throw new HttpException(400, 'booking request Data is empty'); 
    let InsertData = {
      paymentmethod:'',
      transactionId:'',
      cardNumber:'',
      cardHolderName:''
    };
    InsertData.transactionId  = paymentCheckData['mpoint-id'];
    InsertData.cardNumber     = paymentCheckData['card-number'];
    InsertData.cardHolderName = paymentCheckData['card-holder-name'];
    InsertData.paymentmethod  = paymentCheckData['payment-method'];
    let pnrcode = paymentCheckData['orderid'];
    let pnrcode2 = pnrcode.split('_');
    const result = await this.bookingHistory.updateOne({ "pnrcode": pnrcode2[0] },{$set: InsertData});

    let data = {
      html:'',
    };
    return data;
  } 
  /*
  *   @function: 
  */
  public async prepareCheckin(loadBookingData: loadBookingDto): Promise<Booking> {

     if (isEmpty(loadBookingData)) throw new HttpException(400, 'booking Data is empty');
      const BookingData = new Promise(async (resolve, reject) => {
      try {

          const requestData = {
            request: {
              UniqueID:{
                TypeCode: "PnrCode",
                ID: loadBookingData.ID
              },
             
              Verification:  {
                  PassengerName: loadBookingData.PassengerName
              },
              DeferredIssuance:false,
              IncludeAllOptionalSpecialServices: true,
              RequestInfo: {
                AuthenticationKey: API_KEY,
                CultureName: 'en-GB'
              },
              Extensions: null
            }
          };
           
          let data : Booking = await this.Responce(requestData,'PrepareCheckin');
          resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  } 
  /*
  *   @function: 
  */
  public async checkIn(CheckinBookingData: checkinBookingDto): Promise<Booking> {
    if (isEmpty(CheckinBookingData)) throw new HttpException(400, 'booking Data is empty');
    const BookingData = new Promise(async (resolve, reject) => {
      try { 
        const transformedData = {};
        CheckinBookingData.PassengersChackin.forEach(passenger => {
            const { CheckinStatus,DocumentNumber, CouponOrder } = passenger;
            if (CheckinStatus) {
              if (!transformedData[DocumentNumber]) {
                  transformedData[DocumentNumber] = {
                      CouponOrders: []
                  };
              }
            transformedData[DocumentNumber].CouponOrders.push(CouponOrder);
          }
        });

        // Convert the transformed data object to an array
        const resultArray = Object.entries(transformedData).map(([DocumentNumber, data]) => ({
            CouponOrders: data.CouponOrders,
            DocumentNumber
        }));
          const requestData = {
            request: {
              UniqueID:{
                TypeCode: "PnrCode",
                ID: CheckinBookingData.ID
              },
              ETTicketTargets:resultArray,

              Verification:  {
                  PassengerName: CheckinBookingData.PassengerName
              },
               DeferredIssuance:false,
              RequestInfo: {
                AuthenticationKey: API_KEY,
                CultureName: 'en-GB'
              },
            }
          };
          //resolve(requestData);
          let data : Booking = await this.Responce(requestData,'Checkin');
          resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  } 
  /*
  *   @function: 
  */
  public async unCheck(loadBookingData: loadBookingDto): Promise<Booking> {
    if (isEmpty(loadBookingData)) throw new HttpException(400, 'booking Data is empty');
    const BookingData = new Promise(async (resolve, reject) => {
      try {
          const requestData = {
            request: {
              UniqueID:{
                TypeCode: "PnrCode",
                ID: loadBookingData.ID
              }, 
              Verification:  {
                  PassengerName: loadBookingData.PassengerName
              },
              RequestInfo: {
                AuthenticationKey: API_KEY,
                CultureName: 'en-GB'
              },
            }
          };
          let data : Booking = await this.Responce(requestData,'Uncheck');
          resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    return  BookingData;
  }

  public async updateCabs(cabsbookData: CabsbookDto): Promise<Payment> {
    if (isEmpty(cabsbookData)) throw new HttpException(400, 'Cabs request Data is empty');

    let InsertData = {
      uuid:'',
      event:'',
      pickup:{},
      dropoff:{},
      payload:{},

    };
    InsertData.uuid      = cabsbookData.payload.uuid;
    InsertData.event     = cabsbookData.payload.event;
    InsertData.pickup    = cabsbookData.payload.service.details.pickup;
    InsertData.dropoff   = cabsbookData.payload.service.details.dropoff;
    InsertData.payload   = cabsbookData.payload;
    let pnrcode          = cabsbookData.payload.service.details.booking_number;
    const result = await this.bookingHistory.updateOne({ "pnrcode": pnrcode },{$set: InsertData});
    const query = { 'pnrcode': pnrcode };
    const BookingHis = await this.bookingHistory.findOne(query);
    if(BookingHis){
        const requestData = {
            request: {   
              Passengers: [],
              UniqueID: {
                TypeCode: "PnrCode",
                ID:pnrcode
              }, 
              Verification:{
                PassengerName:BookingHis.surname
              },
              SpecialServices: [
                   {
                    "Text": "DWC 06:00 Raffles The Palm Crescent West, Palm Jumeirah CTC +33601010101",
                    "RefPassenger": "2103",
                    "RefSegment": "5152",
                    "Code": "LIMO"
                  }

                ],
              RemovedSpecialServices:[],
              DeferredIssuance:true,
              RemovedEMDTicketFares:[],
              EMDTicketFares:[],
              RequestInfo: {
                AuthenticationKey: API_KEY,
                CultureName: 'en-GB'
              },
              Extensions: null
            }
          };
       
      let dataModify : Booking = await this.Responce(requestData,'ModifyBooking');
    }else{
      return true;
    }
    return dataModify;
  }
  async bookingRequest(bookingData: any,method: any): Promise<any> {
   
    const obj = bookingData.booking;
    const Passengers = [];
    const SpecialServices = [];
    const FareInfo = {
                      EMDTicketFares: []
                  }; 
    const RemovedFareInfo = {
                      RemovedEMDTicketFareForBags: [],
                      RemovedEMDTicketFareForSports:[]
                  }; 
    //var AncillaryData     =  bookingData.AncillaryData
    var SeatMapDeparture  =  bookingData.SeatMap.departure;
    var SeatMapArrival    =  bookingData.SeatMap.arrival; 

    var MealsDeparture  =  bookingData.MealsDetails.departure;
    var MealsArrival    =  bookingData.MealsDetails.arrival; 
    var BaggageDeparture  =  '';
    var BaggageArrival    = '';
    if(method =='ModifyBooking')
    {
      var BaggageDeparture  =  bookingData.BaggageDetails.departure;
      var BaggageArrival    =  bookingData.BaggageDetails.arrival;
       // Request For Ancillary
      if(BaggageDeparture.length > 0){
        BaggageDeparture.forEach((bags) => {
          for (let i = 0; i < bags.ExcessBaggageWeight; i++) {
            const BAG = {
              RefPassenger: bags.RefPassenger,
              RefSegment: bags.RefSegment,
              Label: bags.RefPassenger,
              AssociatedSpecialServiceCode: bags.Code,
              AncillaryCode: bags.EMDTicketFareForBags.AncillaryCode,
              ServiceTypeCode: bags.EMDTicketFareForBags.ServiceTypeCode,
              RefItinerary:bags.EMDTicketFareForBags.RefItinerary,
              Ref: bags.EMDTicketFareForBags.Ref,
              SaleCurrencyAmount:bags.EMDTicketFareForBags.SaleCurrencyAmount
            }
            FareInfo.EMDTicketFares.push(BAG);
          }
          for (let i = 0; i < bags.SportsEquipment; i++) {
            const BAG = {
              RefPassenger: bags.RefPassenger,
              RefSegment: bags.RefSegment,
              Label: bags.RefPassenger,
              AssociatedSpecialServiceCode: bags.Code,
              AncillaryCode: bags.EMDTicketFareForSports.AncillaryCode,
              ServiceTypeCode: bags.EMDTicketFareForSports.ServiceTypeCode,
              RefItinerary:bags.EMDTicketFareForSports.RefItinerary,
              Ref: bags.EMDTicketFareForSports.Ref,
              SaleCurrencyAmount:bags.EMDTicketFareForSports.SaleCurrencyAmount
            }
            FareInfo.EMDTicketFares.push(BAG);
          }
          RemovedFareInfo.RemovedEMDTicketFareForBags   =   [...RemovedFareInfo.RemovedEMDTicketFareForBags, ...bags.RemovedEMDTicketFareForBags];
          RemovedFareInfo.RemovedEMDTicketFareForSports =   [...RemovedFareInfo.RemovedEMDTicketFareForSports, ...bags.RemovedEMDTicketFareForSports];
        }); 
      }
      
      if(BaggageArrival.length > 0){
        BaggageArrival.forEach((bags) => {
          for (let i = 0; i < bags.ExcessBaggageWeight; i++) {
       
            const BAG = {
              RefPassenger: bags.RefPassenger,
              RefSegment: bags.RefSegment,
              Label: bags.RefPassenger,
              AssociatedSpecialServiceCode: bags.Code,
              AncillaryCode: bags.EMDTicketFareForBags.AncillaryCode,
              ServiceTypeCode: bags.EMDTicketFareForBags.ServiceTypeCode,
              RefItinerary:bags.EMDTicketFareForBags.RefItinerary,
              Ref: bags.EMDTicketFareForBags.Ref,
              SaleCurrencyAmount:bags.EMDTicketFareForBags.SaleCurrencyAmount
            }
            FareInfo.EMDTicketFares.push(BAG);
          }
          

          for (let i = 0; i < bags.SportsEquipment; i++) {
       
            const BAG = {
              RefPassenger: bags.RefPassenger,
              RefSegment: bags.RefSegment,
              Label: bags.RefPassenger,
              AssociatedSpecialServiceCode: bags.Code,
              AncillaryCode: bags.EMDTicketFareForSports.AncillaryCode,
              ServiceTypeCode: bags.EMDTicketFareForSports.ServiceTypeCode,
              RefItinerary:bags.EMDTicketFareForSports.RefItinerary,
              Ref: bags.EMDTicketFareForSports.Ref,
              SaleCurrencyAmount:bags.EMDTicketFareForSports.SaleCurrencyAmount
            }
            FareInfo.EMDTicketFares.push(BAG); 
          }  
          RemovedFareInfo.RemovedEMDTicketFareForBags   =   [...RemovedFareInfo.RemovedEMDTicketFareForBags, ...bags.RemovedEMDTicketFareForBags];
          RemovedFareInfo.RemovedEMDTicketFareForSports =   [...RemovedFareInfo.RemovedEMDTicketFareForSports, ...bags.RemovedEMDTicketFareForSports];
        }); 
      } 
    }  

    // Request For Ancillary
    // if(AncillaryData.length > 0){
    //   AncillaryData.forEach((anci) => {
    //    const filteredData = bookingData.EMDTicketFareOptions.filter((item) => {
    //       return  item.AncillaryCode === anci.AncillaryCode;
    //     }).map((item) => {
    //       // Add more key-value pairs to each item
    //       return {
    //         ...item,
    //         RefPassenger:anci.RefPassenger,
    //         RefSegment: anci.RefSegment,
    //         // Add more key-value pairs as needed
    //       };
    //     });
    //     FareInfo.EMDTicketFares.push(filteredData[0]);
    //   });
      
    // } 
    // Request For Meal
    if(MealsArrival.length > 0){
      MealsArrival.forEach((meal) => {
        const MEALS = {
          Text:meal.Label,
          RefPassenger:meal.RefPassenger,
          RefSegment:meal.RefSegment,
          Code: meal.Code
        } 
        SpecialServices.push(MEALS);
      });
    } 
    
    // Request For Meal
    if(MealsDeparture.length > 0){
      MealsDeparture.forEach((meal) => {
        const MEALS = {
          Text:meal.Label,
          RefPassenger:meal.RefPassenger,
          RefSegment:meal.RefSegment,
          Code: meal.Code
        } 
        SpecialServices.push(MEALS);
      });
    } 
     
    if(BaggageDeparture == '' || BaggageArrival=='') 
    {
      // Request For SEAT
      if(SeatMapArrival.length > 0){
        SeatMapArrival.forEach((seat) => {
          const SEAT = {
            Data: {
              Seat: {
                SeatRow: seat.RowNumber,
                SeatLetter: seat.Letter
              }
            },
            RefPassenger:seat.RefPassenger,
            RefSegment: seat.RefSegment,
            Code: "SEAT"
          } 
          SpecialServices.push(SEAT);
   

          const filteredData = bookingData.EMDTicketFareOptions.filter((item) => {
            return  item.AncillaryCode === seat.AssociatedAncillaryCode;
          }).map((item) => {
            // Add more key-value pairs to each item
            return {
              ...item,
              RefPassenger:seat.RefPassenger,
              RefSegment: seat.RefSegment,
              // Add more key-value pairs as needed
            };
          });
          FareInfo.EMDTicketFares.push(filteredData[0])
        });
        
      } 
      // Request For SEAT
      if(SeatMapDeparture.length > 0){
        SeatMapDeparture.forEach((seat) => {
          const SEAT = {
            Data: {
              Seat: {
                SeatRow: seat.RowNumber,
                SeatLetter: seat.Letter
              }
            },
            RefPassenger:seat.RefPassenger,
            RefSegment: seat.RefSegment,
            Code: "SEAT"
          } 
          SpecialServices.push(SEAT);
          const filteredData = bookingData.EMDTicketFareOptions.filter((item) => {
            return  item.AncillaryCode === seat.AssociatedAncillaryCode;
          }).map((item) => {
            // Add more key-value pairs to each item
            return {
              ...item,
              RefPassenger:seat.RefPassenger,
              RefSegment: seat.RefSegment,
              // Add more key-value pairs as needed
            };
          });
          FareInfo.EMDTicketFares.push(filteredData[0])
        });
        
      }
    }    
                
    // Make Request for sending
    
      for (const  key in obj) { 
        var PassengerDetailsObj = obj[key].PassengerDetails;
        var SpecialServicesObj = obj[key].SpecialServices;
        var DocumentsObj = obj[key].PassPortDocuments;
        var VisaDocuments = obj[key].VisaDocuments;
        var RefPassenger = PassengerDetailsObj.Ref;
        
        const newPassengerObjs = {
          Ref: RefPassenger,
          RefClient: "P"+key,
          PassengerQuantity: 1,
          PassengerTypeCode: PassengerDetailsObj.PassengerType,
          NameElement: {
            CivilityCode: PassengerDetailsObj.CivilityCode,
            Firstname: PassengerDetailsObj.Firstname,
            Surname: PassengerDetailsObj.Surname,
          },
          Extensions: [],
          
        };
        Passengers.push(newPassengerObjs);

         // Request For CTCH
          if(SpecialServicesObj.CTCH){
            const CTCH = {
              Text:SpecialServicesObj.CTCH,
              RefPassenger: RefPassenger,
              Code: "CTCH"
            } 
            SpecialServices.push(CTCH);
          }  
          // Request For CTCM
          if(SpecialServicesObj.CTCM){
            const CTCM = {
              Text:SpecialServicesObj.CTCM,
              RefPassenger: RefPassenger,
              Code: "CTCM"
            } 
            SpecialServices.push(CTCM);
          } 

           // Request For CTCE
          if(SpecialServicesObj.CTCE){
            const CTCE = {
              Text:SpecialServicesObj.CTCE,
              RefPassenger:RefPassenger,
              Code: "CTCE"
            } 
            SpecialServices.push(CTCE);
          }
          
        if(method =='CreateBooking')
        {
          // For Special Services DOB
          if(SpecialServicesObj.EXTADOB){
            const Dob = {
                Data: {
                  Adof: {
                    DateOfBirth: SpecialServicesObj.EXTADOB
                  },
                  Fields: [
                    "DateOfBirth"
                  ]
                },
                RefPassenger: RefPassenger,
                Code: "EXT-ADOB"
              }
            
            SpecialServices.push(Dob);
          }
         
          
          // Request For CHLD
          if(SpecialServicesObj.CHLD){
            const CHLD = {
                Data: {
                  Chld: {
                    DateOfBirth: SpecialServicesObj.CHLD
                  },
                  Fields: [
                    "DateOfBirth"
                  ]
                },
                RefPassenger: RefPassenger,
                Code: "CHLD"
              }
            
            SpecialServices.push(CHLD);
          }
          
          // Request For BAGR
          if(SpecialServicesObj.BAGR){
            const BAGR = {
              Text:SpecialServicesObj.BAGR,
              RefPassenger:RefPassenger,
              Code: "BAGR"
            } 
            SpecialServices.push(BAGR);
          }  
          // Request For INFT
          if(SpecialServicesObj.INFT){
            const INFT = {
              Text:SpecialServicesObj.INFT,
              RefPassenger:RefPassenger,
              Code: "INFT"
            } 
            SpecialServices.push(INFT);
          } 
          // Request For UMNR
          if(SpecialServicesObj.UMNR){
            const UMNR = {
              Text:SpecialServicesObj.UMNR,
              RefPassenger:RefPassenger,
              Code: "UMNR"
            } 
            SpecialServices.push(UMNR);
          }  
          // Request For CTCF
          if(SpecialServicesObj.CTCF){
            const CTCF = {
              Text:SpecialServicesObj.CTCF,
              RefPassenger:RefPassenger,
              Code: "CTCF"
            } 
            SpecialServices.push(CTCF);
          }  
          // Request For FOID
          if(SpecialServicesObj.FOID){
            const FOID = {
              Text:SpecialServicesObj.FOID,
              RefPassenger:RefPassenger,
              Code: "FOID"
            } 
            SpecialServices.push(FOID);
          } 
          
          // Request For DOCA
          if(SpecialServicesObj.DOCA){
            const DOCA = {
              Text:SpecialServicesObj.DOCA,
              RefPassenger:RefPassenger,
              Code: "DOCA"
            } 
            SpecialServices.push(DOCA);
          } 
          // Request For PCTC
          if(SpecialServicesObj.PCTC){
            const PCTC = {
              Text:SpecialServicesObj.PCTC,
              RefPassenger:RefPassenger,
              Code: "PCTC"
            } 
            SpecialServices.push(PCTC);
          } 

          // Request For EXTECTC
          if(SpecialServicesObj.EXTECTC){
            const EXTECTC = {
              Text:SpecialServicesObj.EXTECTC,
              RefPassenger:RefPassenger,
              Code: "EXTECTC"
            } 
            SpecialServices.push(EXTECTC);
          }


          
        } 
        if(DocumentsObj){
            const DOC =  {
              Data: {
                Docs: {
                  //"Documents":DocumentsObj  
                  "Documents":[
                          {
                            "IssueCountryCode": "FR",
                            "NationalityCountryCode": "FR",
                            "DateOfBirth": "1993-03-19T00:00:00",
                            "Gender": "M",
                            "DocumentExpiryDate": "2025-02-10T00:00:00",
                            "DocumentIssuanceDate": "2023-01-10T00:00:00",
                            "Firstname": DocumentsObj[0].Firstname,
                            "Surname": DocumentsObj[0].Surname,
                            "DocumentTypeCode": "PP",
                            "DocumentNumber": "30068246" 
                          }
                        ] , 
                } 
              },
              RefPassenger:RefPassenger,
              Code: "DOCS"
            }
            SpecialServices.push(DOC);
          }
        if(VisaDocuments){

            const DOCO = {
              Data: {
                //Doco:VisaDocuments[0]
                Doco:{
                    "PlaceOfBirth": "FR", 
                    "Extensions": null
                },
              },
              RefPassenger:RefPassenger,
              Code: "DOCO"
            }
            SpecialServices.push(DOCO);
        }

           
      }
      
    const responce = {
        SpecialServices: SpecialServices,
        FareInfo:FareInfo,
        RemovedFareInfo:RemovedFareInfo,
        Passengers:Passengers
      }
    return responce;
  }
  
  async Responce(requestData: any,method:any,marketingInfo:false): Promise<any> {
    var URL = API_URL+method+'?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    let res =  await axios.post(URL, requestData);

    let dataModify = {
      PassengersDetails: [],
      PassengersDetailsCheckin: [],
      Passengers: {},
      PassengersChackin:[],
      Amount:{},
      OriginDestination: [],
      PnrInformation:{},
      RefETTicketFare:[],
      SeatMaps:[],
      FareRules:{},
      IsCabBooking:false,
      IsCheckinAllow:false,
      Res:res.data
    };
    //return dataModify;
    if(res.data.Booking != null){
        var CheckinStatusResult = [];
        let response  = res.data.Booking;
        var  SpecialServices   = response.SpecialServices;
        var  Passengers        = response.Passengers; 
        if(method=='PrepareCheckin'){

        

          var CheckinTargets   = res.data.CheckinTargets;
          var TicketInfo       = res.data.Booking.TicketInfo.ETTickets;
          const checkableCases = CheckinTargets.filter(entry =>
            entry.ETTicketCheckinList.every(ticket =>
              ticket.ETCouponCheckinList.every(coupon =>
                coupon.CheckinStatusCode === 'Checkable' || coupon.CheckinStatusCode === 'APISValidationError'
              )
            )
          );
          if(checkableCases){
            dataModify.IsCheckinAllow  = true;
          }

           
          CheckinTargets.forEach(checkinTarget => {
            checkinTarget.ETTicketCheckinList.forEach(etTicketCheckin => {
              etTicketCheckin.ETCouponCheckinList.forEach(couponCheckin => {
                const matchingEtTicket = TicketInfo.find(etTicket => etTicket.DocumentNumber === etTicketCheckin.DocumentNumber);
                var checkInStateus = false;
                if(couponCheckin.CheckinStatusCode === 'Checkable' || couponCheckin.CheckinStatusCode === 'APISValidationError'){
                  var checkInStateus = true;
                }
                //if (matchingEtTicket) {
                  let PassengersCheckin = Passengers.find(entry => entry.Ref === matchingEtTicket.RefPassenger);
                  dataModify.PassengersChackin.push({
                    "CheckinStatus": checkInStateus,
                    "DocumentNumber": etTicketCheckin.DocumentNumber,
                    "CouponOrder": couponCheckin.CouponOrder,
                    "RefPassenger": matchingEtTicket.RefPassenger,
                    "RefSegment": '',
                    "CheckinStatusCode":couponCheckin.CheckinStatusCode,
                    "Firstname":PassengersCheckin.NameElement.Firstname,
                    "Surname":PassengersCheckin.NameElement.Surname,
                    // Add additional properties as needed
                  });
               // }
              });
            });
          });
          
            var CheckinStatusResult = await Object.values(dataModify.PassengersChackin.reduce((acc, item) => {
                const { CheckinStatus, CouponOrder } = item;
                acc[CouponOrder] = acc[CouponOrder] || { CheckinStatus: false, CouponOrder };
                acc[CouponOrder].CheckinStatus = acc[CouponOrder].CheckinStatus || CheckinStatus;
                return acc;
            }, {})).filter(item => item.CheckinStatus);
        }
        for (const  pass in Passengers) {
          let special = {
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
          dataModify.PassengersDetails.push(special);

        }
        if(method=='Exchange' || method=='ModifyBooking'){
          var  SaleCurrencyAmountTotal = response.FareInfo.SaleCurrencyAmountToPay;
        }else{
          var  SaleCurrencyAmountTotal = response.FareInfo.SaleCurrencyAmountTotal;
        }
        var  Segments         = response.Segments;
        var  ETTicketFares    = response.FareInfo.ETTicketFares;
        var  EMDTicketFares   = response.FareInfo.EMDTicketFares;
        var  SaleCurrencyCode = response.FareInfo.SaleCurrencyCode;
        var  RefETTicketFare  = response.MiscInfo.ExchangeableOriginDestinations;
        var  SeatMaps         = response.SeatMaps;
        var  FareRules        = response.FareInfo.FareRules;
        dataModify.SeatMaps   = SeatMaps;
         const CheckCabs = EMDTicketFares.find(item => item.AssociatedSpecialServiceCode === "PDGT");
         if (CheckCabs) {
          dataModify.IsCabBooking = true;
         }
        if(method!='Cancel' && FareRules.length > 0){
          dataModify.FareRules = FareRules.map(rule => ({
            Text: rule.FareConditionText.Text,
            Value: rule.FareConditionText.Value,
            Children: parseChildren(rule.FareConditionText.Children),
            Extensions: null
          }));
        }
        const totalSeatAmountSum = EMDTicketFares
          .filter(item => item.AssociatedSpecialServiceCode === "SEAT")
          .map(item => item.SaleCurrencyAmount.TotalAmount)
          .reduce((sum, amount) => sum + amount, 0);

         
        var  PassengersA      = response.Passengers;
        var  PnrInformation   = response.PnrInformation;
        let  PassengerQuantityChild  = 0;
        let  PassengerQuantityAdult  = 0;
        if(method=='Checkin' || method=='PrepareCheckin111'){

            var TicketInfo             = res.data.Booking.TicketInfo.ETTickets;
            var BoardingPassList       = res.data.Booking.MiscInfo.BoardingPassList;
            const TicketPrintHttpLink       = res.data.Booking.MiscInfo.TicketPrintHttpLink;
            const etTicketsMap = new Map(TicketInfo.map(etTicket => [etTicket.RefPassenger, etTicket]));
            const passengersMap = new Map(PassengersA.map(passenger => [passenger.Ref, passenger]));

            // Merge data based on RefPassenger
            const mergedData = [];
            for (const [refPassenger, etTicketInfo] of etTicketsMap) {
                if (passengersMap.has(refPassenger)) {
                    const passengerInfo = passengersMap.get(refPassenger);
                    const mergedInfo = { ...etTicketInfo, PassengerInfo: passengerInfo };
                    mergedData.push(mergedInfo);
                }
            }


            // Create a mapping of DocumentNumber to HttpLink values
            const documentNumberToHttpLinks = BoardingPassList.reduce((acc, boardingPass) => {
                if (boardingPass.HttpLink) {
                    const existingLinks = acc[boardingPass.DocumentNumber] || [];
                    acc[boardingPass.DocumentNumber] = [...existingLinks, boardingPass.HttpLink];
                }
                return acc;
            }, {});

            const documentNumberToCouponOrders = BoardingPassList.reduce((acc, boardingPass) => {
                if (boardingPass.CouponOrders) {
                    const existingCouponOrders = acc[boardingPass.DocumentNumber] || [];
                    acc[boardingPass.DocumentNumber] = [...existingCouponOrders, boardingPass.CouponOrders];
                }
                return acc;
            }, {});

            const CouponOrderValue = requestData.request.ETTicketTargets.length > 0 ? requestData.request.ETTicketTargets[0].CouponOrder : 2;

            // Iterate through passengersDetailsCheckin and associate HttpLink details
            const passengersWithHttpLinks = mergedData.map(passenger => {
                const documentNumber = passenger.DocumentNumber;
                const httpLinks = documentNumberToHttpLinks[documentNumber] || [];
                const CouponOrders = documentNumberToCouponOrders[documentNumber] || [];
                //const couponOrderObjects = passenger.Coupons.filter(coupon => [CouponOrders].includes(coupon.CouponOrder));
                const couponOrderObjects = passenger.Coupons.find(coupon => coupon.CouponOrder === CouponOrderValue);
                const Coupons  = passenger.Coupons[1];

                // var OriginCodePass = await this.location.find({Code:Coupons.SegmentSold.OriginCode});
                // for (const  loc2 in OriginCode1) {
                //   var OriginCity =  OriginCodePass[loc2].city;
                //   var OriginName =  OriginCodePass[loc2].name;
                // }
                // var DestinationCodePass = await this.location.find({Code:Coupons.SegmentSold.DestinationCode});
                // for (const  loc2 in DestinationCode1) {
                //   var DestinationCity =  DestinationCodePass[loc2].city;
                //   var DestinationName =  DestinationCodePass[loc2].name;
                // }
                return {
                    //...passenger,
                    //OriginCity: OriginCity,
                    OriginCode: Coupons.SegmentSold.OriginCode,
                    //OriginName: OriginName,
                    DestinationCode: Coupons.SegmentSold.DestinationCode,
                    //DestinationCity:DestinationCity,
                    //DestinationName:DestinationName,
                    RefPassenger:passenger.RefPassenger,
                    RefETTicketFare:passenger.RefETTicketFare,
                    PassengerQuantity:passenger.PassengerInfo.PassengerQuantity,
                    PassengerTypeCode:passenger.PassengerInfo.PassengerTypeCode,
                    CivilityCode:passenger.PassengerInfo.NameElement.CivilityCode,
                    Firstname:passenger.PassengerInfo.NameElement.Firstname,
                    Surname:passenger.PassengerInfo.NameElement.Surname,
                    Seat:'',
                    BookingReference:passenger.DocumentNumber,
                    CouponOrders:couponOrderObjects,
                    Coupons:passenger.Coupons,
                    GateNumber:'',
                    TicketNumber:passenger.DocumentNumber,
                    DocumentNumber:passenger.DocumentNumber,
                    HttpLinks: 'https://tstws2.ttinteractive.com/'+httpLinks[0],
                    FlightNumber: Coupons.SegmentSold.FlightInfo.OperatingAirlineDesignator+'-'+Coupons.SegmentSold.FlightInfo.FlightNumber,
                    AircraftType: Coupons.SegmentSold.FlightInfo.EquipmentText,
                    WebClass:'',
                    BoardingTime:'',
                    RefuelingStop:'',
                    TicketPrintHttpLink:'https://tstws2.ttinteractive.com/'+TicketPrintHttpLink,
                };
            });
            
            dataModify.PassengersDetailsCheckin  =  passengersWithHttpLinks;
        }
        for (const  pas in PassengersA) {
          if(PassengersA[pas].PassengerTypeCode=='AD'){
            PassengerQuantityAdult += PassengersA[pas].PassengerQuantity;
          }
          if(PassengersA[pas].PassengerTypeCode=='CHD'){
            PassengerQuantityChild += PassengersA[pas].PassengerQuantity;
          }
          let Passengers =  {
            "Adult": PassengerQuantityAdult,
            "Children": PassengerQuantityChild
          };
          dataModify.Passengers = Passengers;
         
        }
        let Amount  =  {
          "DiscountAmount":SaleCurrencyAmountTotal.DiscountAmount,
          "BaseAmount": SaleCurrencyAmountTotal.BaseAmount,
          "TaxAmount": SaleCurrencyAmountTotal.TaxAmount,
          "TotalAmount": SaleCurrencyAmountTotal.TotalAmount,
          "MilesAmount": SaleCurrencyAmountTotal.MilesAmount,
          "SeatAmount": totalSeatAmountSum,
          "Extensions": null,
          "SaleCurrencyCode":SaleCurrencyCode,
        };
          dataModify.Amount = Amount; 
          dataModify.RefETTicketFare = RefETTicketFare;
          for (const  seg in Segments) {
            if(Segments[seg].BookingClass.StatusCode!=='XX')
            { 
              const FareBasisCode = ETTicketFares[0].OriginDestinationFares[0].CouponFares[0].FareBasisCode;
              const secondCharacter = FareBasisCode[1];
              if(secondCharacter=='D'){
                var Luxury = false;
                var Lounge = false;
              }
              if(secondCharacter=='B'){
                var Luxury = false;
                var Lounge =true;
              }
              if(secondCharacter=='O'){
                var Luxury = true;
                var Lounge =true;
              }
             
              let ct: number = 0;
              // let BagAllowances = ETTicketFares[ct].OriginDestinationFares[0].CouponFares[0].BagAllowances[0];
              // let BagAllowances  =  {
              //   "Quantity": BagAllowancesArr.Quantity,
              //   "WeightMeasureQualifier": BagAllowancesArr.WeightMeasureQualifier,
              //   "Weight":BagAllowancesArr.Weight+' '+BagAllowancesArr.WeightMeasureQualifier,
              //   "Extensions": BagAllowancesArr.Extensions,
              //   "CarryOn": BagAllowancesArr.CarryOn
              // };

              var OriginCode1 = await this.location.find({Code:Segments[seg].OriginCode});
              for (const  loc2 in OriginCode1) {
                var OriginCity =  OriginCode1[loc2].city;
                var OriginName =  OriginCode1[loc2].name;
              }
              var DestinationCode1 = await this.location.find({Code:Segments[seg].DestinationCode});
              for (const  loc2 in DestinationCode1) {
                var DestinationCity =  DestinationCode1[loc2].city;
                var DestinationName =  DestinationCode1[loc2].name;
              }
              //let CheckinStatusArr = {};
              let BagAllowances = ETTicketFares[ct].OriginDestinationFares[0].CouponFares[0].BagAllowances[0];
              let CheckinStatusArr = await CheckinStatusResult.find(entry => entry.CouponOrder === parseInt(seg)+1);
              let CheckinStatusOrgDes = false;
              if(CheckinStatusArr){
                let CheckinStatusOrgDes = CheckinStatusArr.CheckinStatus;
              }
              if(parseInt(seg)+1 == 2){
                 let CheckinStatusOrgDes = true;
              }

              // Update RefSegment based on CouponOrder
              dataModify.PassengersChackin.forEach(item => {
                const { CouponOrder } = item;
                if (CouponOrder === 1 && parseInt(seg)+1 === 1) {
                    item.RefSegment = Segments[seg].Ref;
                } else if (CouponOrder === 2 && parseInt(seg)+1 ===2) {
                    item.RefSegment =Segments[seg].Ref;
                }
              });
              let OriginDestination =     {
                "RefSegment":Segments[seg].Ref,
                "OriginCode": Segments[seg].OriginCode,
                "OriginCity": OriginCity,
                "OriginName": OriginName,
                "DestinationCode": Segments[seg].DestinationCode,
                "DestinationCity":DestinationCity,
                "DestinationName":DestinationName,
                "DepartureDate": localeDateString(Segments[seg].FlightInfo.DepartureDate),
                "OrginDepartureTime":formattedTime(Segments[seg].FlightInfo.DepartureDate),
                "DestinationArrivalTime":formattedTime(Segments[seg].FlightInfo.ArrivalDate),
                "ArrivalDate": localeDateString(Segments[seg].FlightInfo.ArrivalDate),
                "OriginAirportTerminal": Segments[seg].FlightInfo.OriginAirportTerminal,
                "DestinationAirportTerminal": Segments[seg].FlightInfo.DestinationAirportTerminal,
                "BagAllowances":  BagAllowances,
                "Luxury":Luxury,
                "Lounge":Lounge,
                "WebClass":secondCharacter,
                "FlightNumber": Segments[seg].FlightInfo.OperatingAirlineDesignator+'-'+Segments[seg].FlightInfo.FlightNumber,
                "Stops": Segments[seg].FlightInfo.Stops,
                "Remarks":Segments[seg].FlightInfo.Remarks,
                "Duration":formatDuration(Segments[seg].FlightInfo.DurationMinutes),
                "Meal":'',
                "Seat":'',
                "Terminal":'',
                "AircraftType":Segments[seg].FlightInfo.EquipmentText,
                "CheckinStatus": CheckinStatusOrgDes, 
                "CheckinStatusResult": CheckinStatusArr, 
                "CouponOrder": parseInt(seg)+1,
              };
              dataModify.OriginDestination.push(OriginDestination);
              dataModify.PnrInformation = PnrInformation;
              // if(method=='Checkin00' ){
              //   for (const  passCheckIn in passengersWithHttpLinks) {

              //     passengersWithHttpLinks[passCheckIn].OriginCode =  Segments[seg].OriginCode,
              //     passengersWithHttpLinks[passCheckIn].OriginCity = OriginCity,
              //     passengersWithHttpLinks[passCheckIn].OriginName = OriginName,
              //     passengersWithHttpLinks[passCheckIn].DestinationCode = Segments[seg].DestinationCode,
              //     passengersWithHttpLinks[passCheckIn].DestinationCity = DestinationCity,
              //     passengersWithHttpLinks[passCheckIn].DestinationName = DestinationName,
              //     passengersWithHttpLinks[passCheckIn].DepartureDate =  localeDateString(Segments[seg].FlightInfo.DepartureDate),
              //     passengersWithHttpLinks[passCheckIn].OrginDepartureTime = formattedTime(Segments[seg].FlightInfo.DepartureDate),
              //     passengersWithHttpLinks[passCheckIn].DestinationArrivalTime = formattedTime(Segments[seg].FlightInfo.ArrivalDate),
              //     passengersWithHttpLinks[passCheckIn].ArrivalDate = localeDateString(Segments[seg].FlightInfo.ArrivalDate),
              //     passengersWithHttpLinks[passCheckIn].OriginAirportTerminal = Segments[seg].FlightInfo.OriginAirportTerminal,
              //     passengersWithHttpLinks[passCheckIn].DestinationAirportTerminal = Segments[seg].FlightInfo.DestinationAirportTerminal,
                  
              //     dataModify.PassengersDetailsCheckin.push(passengersWithHttpLinks[passCheckIn]);
              //   }
              // } 
            }  
          }
          if(method=='CreateBooking'){
            let email = SpecialServices.find(item => item.Code === 'CTCE');
             
            let BookingHistory = {	
              pnrcode:PnrInformation.PnrCode,	
              name: PassengersA[0].NameElement.Firstname,	
              surname:PassengersA[0].NameElement.Surname,	
              originCode: Segments[0].OriginCode,	
              destinationCode: Segments[0].DestinationCode,	
              originDate:localeDateString(Segments[0].FlightInfo.ArrivalDate),	
              destinationDate: localeDateString(Segments[0].FlightInfo.DepartureDate),	
              isTicket:false,
              email:email.Text,
              marketingInfo:marketingInfo
            };	
          
            this.bookingHistory.insertMany(BookingHistory);
          }  
          
    }else{
      if (res.data.ResponseInfo.Error.Message) { 
        throw new HttpException(400,res.data.ResponseInfo.Error.Message);
      }
    }
    return dataModify;
  }
}
export default BookingService;
