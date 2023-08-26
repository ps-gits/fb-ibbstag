import { model, Schema, Document } from 'mongoose';
import { BookingHistory } from '@interfaces/booking.interface';

const bookingHistorySchema: Schema = new Schema({
    pnrcode:{ type: String ,required: true},
    name: { type: String ,required: true},
    email: { type: String },
    surname:{ type: String ,required: true},
    originCode: { type: String ,required: true},
    destinationCode: { type: String ,required: true},
    originDate: { type: String ,required: true},
    destinationDate: { type: String ,required: true},
    paymentmethod: { type: String },
    isTicket:{type:Boolean},
    transactionId: { type: String },
    cardNumber: { type: String },
    cardHolderName: { type: String } 
}); 
const bookingHistoryModel = model<BookingHistory & Document>('BookingHistory', bookingHistorySchema); 
export default bookingHistoryModel;
