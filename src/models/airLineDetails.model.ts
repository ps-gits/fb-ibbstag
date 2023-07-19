import { model, Schema, Document } from 'mongoose';
import { AirLineDetails } from '@interfaces/cron.interface';

const AirLineDetailsSchema: Schema = new Schema({
    AirlineDesignator:{ type: String ,required: true},
    AirlineName:{ type: String ,required: true}, 
    AirlineLogoUrl:{ type: String ,required: true},
    VendorName:{ type: String ,required: true},
    VendorProfile:{ type: String ,required: true},
    MaxOriginDestinationCount:{ type: Number ,required: true},
    AllowPromoCode:{ type: Boolean ,required: true},
    AllowCustomerManagement:{ type: Boolean ,required: true}, 
    AllowBookWithoutCustomer:{ type: Boolean ,required: true}, 
    AllowSeating:{ type: Boolean ,required: true}, 
    AllowCancelSegment:{ type: Boolean ,required: true}, 
    AllowToPayInAccount:{ type: Boolean ,required: true},  
    AllowExchange:{ type: Boolean ,required: true}, 
    AllowedPassengerTypes:{ type: Array ,required: true}, 
    AllowedOriginDestinations:{ type: Array ,required: true}, 
    AllowedCurrencies:{ type: Array ,required: true}, 
    MaxPassengerCount:{ type: Number ,required: true}, 
    AllowedFormsOfPayment:{ type: Array ,required: true}, 
    FrequentFlyerLevels:{ type: Array ,required: true}, 
    DefaultCurrency:{ type: String ,required: true},
    DefaultCultureName:{ type: String ,required: true},
    AllowCheckIn:{ type: Boolean ,required: true}, 
    AllowToGetFlownCoupons:{ type: Boolean ,required: true},
    WebClassFilters:{ type: Array ,required: true}, 
    BookingVerificationRequired:{ type: Boolean ,required: true}, 
    AllowToPayCash:{ type: Boolean ,required: true}, 
    ResponseInfo:{ type: Object ,required: true},
    RefundConfig:{ type: Object ,required: true},
}); 

const airLineDetailsModel = model<AirLineDetails & Document>('airLineDetails', AirLineDetailsSchema); 
export default airLineDetailsModel;