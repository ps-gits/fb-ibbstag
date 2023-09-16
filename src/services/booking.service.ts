import { CreateBookingDto,CreateBookingExchangeDto,loadBookingDto,calendarDto,ModifyBookingDto,SearchBookingDto,
  PrepareBookingModiDto,CreateTicketDto,LoadMCOTicketDto,
  SendTicketConfirmationDto,AddItineraryDto,PrepareAdditionalItineraryDto,CancelBookingDto
  ,PrepareCancelBookingDto,paymentRequestDto,PaymentCheckDto,HeadersDto} from '@dtos/booking.dto';
import { HttpException } from '@exceptions/HttpException';
import { Booking,LoadBooking,Calendar,Payment} from '@interfaces/booking.interface'; 
import { Search } from '@interfaces/search.interface';
import { isEmpty,formatDate,generateOrderNumber,formattedTime,localeDateString,parseChildren,formatDuration } from '@utils/util';
import { API_URL,API_KEY} from '@config';
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

          
          let dataModify : Booking = await this.Responce(requestData,'CreateBooking');
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
            RemovedEMDTicketFares:[],
            EMDTicketFares:result.FareInfo.EMDTicketFares,
            RequestInfo: {
              AuthenticationKey: API_KEY,
              CultureName: 'en-GB'
            },
            Extensions: null
          }
        };
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
      EMDTicketFareOptions:[],
      cpd_code:""
    };
    if(res.data.Booking!=null){ 
      var SpecialServices   =  res.data.Booking.SpecialServices;
      var OptionalSpecialServices   =  res.data.OptionalSpecialServices;
      var Passengers        = res.data.Booking.Passengers;
      var SeatMaps          =  res.data.Booking.SeatMaps;
      var EMDTicketFareOptionsArr =  res.data.FareInfo.EMDTicketFareOptions;

      var EMDTicketFares =  res.data.Booking.FareInfo.EMDTicketFares; 
      var Segments = res.data.Booking.Segments;
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
      dataPer.cpd_code    = cpd_code; 
      dataPer.Passengers    = Passengers; 
      dataPer.SeatMaps = SeatMaps;
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
              type:type,
              RefSegment:SpecialServices[key1].RefSegment,
              RefPassenger:SpecialServices[key1].RefPassenger,
            };
            special.fields.push(myObj);
          }
        } 
        dataPer.PassengersDetails.push(special);
        
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
          Text:SpecialServicesObj.CTCH,
          RefPassenger: "Traveler_Type_1_Index_1",
          Code: "CTCH"
        } 
        SpecialServices.push(CTCH);
      }  
      // Request For CTCM
      if(SpecialServicesObj.CTCM!=''){
        const CTCM = {
          Text:SpecialServicesObj.CTCM,
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

//resolve(RefETTicketFare);
         
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
        <input type="hidden" name="accept-url" value="https://flightbooking-sitecore-pratiksde-gmailcom.vercel.app/api/paymentaccept"> <!-- Merchant's Browser URL -->
        <input type="hidden" name="cancel-url" value="https://flightbooking-sitecore-pratiksde-gmailcom.vercel.app/api/paymentcancel"> <!-- Merchant's Browser URL -->
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
    var URL = API_URL+'PrepareCheckin?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
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
    let res =  await axios.post(URL, requestData);

    let dataModify = {
      PassengersDetails: [],
      Passengers: {},
      Amount:{},
      OriginDestination: [],
      PnrInformation:{},
      RefETTicketFare:[],
      SeatMaps:[]
    };
    if(res.data.Booking != null){
      let response  = res.data;
      var  SpecialServices   =  res.data.Booking.SpecialServices;
      var  Passengers        = res.data.Booking.Passengers;

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
      let  FareInfo   = response.Booking.FareInfo
      var  SaleCurrencyAmountTotal  = FareInfo.SaleCurrencyAmountTotal;
      var  Segments                 = response.Booking.Segments;
      var  ETTicketFares            = FareInfo.ETTicketFares;
      var  RefETTicketFare          = response.Booking.TicketInfo.ETTickets;
      var  SeatMaps                 = response.Booking.SeatMaps;
      var  SaleCurrencyCode         = FareInfo.SaleCurrencyCode;
      dataModify.SeatMaps           = SeatMaps;
      if(RefETTicketFare.length==0){
        var  RefETTicketFare = response.Booking.MiscInfo.ExchangeableOriginDestinations[0].ETTicketFareTargets;
      }
      var  PassengersA      = response.Booking.Passengers;
      var  PnrInformation   = response.Booking.PnrInformation;
      let  PassengerQuantityChild  = 0;
      let  PassengerQuantityAdult  = 0;
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
          "SaleCurrencyCode":SaleCurrencyCode,
          "Extensions": null
        };
        dataModify.Amount = Amount; 
        dataModify.RefETTicketFare = RefETTicketFare;
        for (const  seg in Segments) {
          if(Segments[seg].BookingClass.StatusCode!=='XX')
          {
            console.log(ETTicketFares);
            let ct: number = 0;
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
              "ArrivalDate": localeDateString(Segments[seg].FlightInfo.DepartureDate),
              "OriginAirportTerminal": Segments[seg].FlightInfo.OriginAirportTerminal,
              "DestinationAirportTerminal": Segments[seg].FlightInfo.DestinationAirportTerminal,
              "BagAllowances":  BagAllowances
            };
            dataModify.OriginDestination.push(OriginDestination);
            dataModify.PnrInformation = PnrInformation;
          }  
        }
        
    }else{
      if (res.data.ResponseInfo.Error.Message) { 
        throw new HttpException(400,res.data.ResponseInfo.Error.Message);
      }
    }
    
    return dataModify;
  } 
  /*
  *   @function: 
  */
  public async checkIn(loadBookingData: loadBookingDto): Promise<Booking> {
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

  async bookingRequest(bookingData: any,method: any): Promise<any> {
   
    const obj = bookingData.booking;
    const Passengers = [];
    const SpecialServices = [];
    const FareInfo = {
                      EMDTicketFares: []
                  }; 
    //var AncillaryData     =  bookingData.AncillaryData
    var SeatMapDeparture  =  bookingData.SeatMap.departure;
    var SeatMapArrival    =  bookingData.SeatMap.arrival; 

    var MealsDeparture  =  bookingData.MealsDetails.departure;
    var MealsArrival    =  bookingData.MealsDetails.arrival; 

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
    // Make Request for sending
    if(method =='CreateBooking')
    {
      for (const  key in obj) { 
        var PassengerDetailsObj = obj[key].PassengerDetails;
        var SpecialServicesObj = obj[key].SpecialServices;
        var DocumentsObj = obj[key].Documents;
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
        // Request For CTCE
        if(SpecialServicesObj.CTCE){
          const CTCE = {
            Text:SpecialServicesObj.CTCE,
            RefPassenger:RefPassenger,
            Code: "CTCE"
          } 
          SpecialServices.push(CTCE);
        }
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
        // if(DocumentsObj){
        //   const DOC =  {
        //     Data: {
        //       Docs: {
        //         "Documents":DocumentsObj  
        //       },
        //       Fields: [
        //         "Documents[0].DocumentTypeCode",
        //         "Documents[0].DocumentNumber",
        //         "Documents[0].NationalityCountryCode"
        //       ]
        //     },
        //     RefPassenger:RefPassenger,
        //     Code: "DOCS"
        //   }
        //   SpecialServices.push(DOC);
        // }
      }
    }  
    const responce = {
        SpecialServices: SpecialServices,
        FareInfo:FareInfo,
        Passengers:Passengers
      }
    return responce;
  }
  
  async Responce(requestData: any,method:any): Promise<any> {
    var URL = API_URL+method+'?TimeZoneHandling=Ignore&DateFormatHandling=ISODateFormat';
    let res =  await axios.post(URL, requestData);

    let dataModify = {
      PassengersDetails: [],
      Passengers: {},
      Amount:{},
      OriginDestination: [],
      PnrInformation:{},
      RefETTicketFare:[],
      SeatMaps:[],
      FareRules:{},
      Res:res.data
    };
    if(res.data.Booking != null){
        let response  = res.data.Booking;
        var  SpecialServices   = response.SpecialServices;
        var  Passengers        = response.Passengers; 
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
        var  RefETTicketFare  = response.MiscInfo.ExchangeableOriginDestinations;
        var  SeatMaps         = response.SeatMaps;
        var  FareRules         = response.FareInfo.FareRules;
        dataModify.SeatMaps   = SeatMaps;

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
          "Extensions": null
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
              let BagAllowances = ETTicketFares[ct].OriginDestinationFares[0].CouponFares[0].BagAllowances[0];
              let OriginDestination =     {
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
              };
              dataModify.OriginDestination.push(OriginDestination);
              dataModify.PnrInformation = PnrInformation;
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
