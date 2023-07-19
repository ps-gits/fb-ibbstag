import { model, Schema, Document } from 'mongoose';
import { PersonalDetails } from '@interfaces/cron.interface';

const personalDetailsSchema: Schema = new Schema({
    pnrcode:{ type: String ,required: true},
    name: { type: String ,required: true},
    surname:{ type: String ,required: true},
    originCode: { type: String ,required: true},
    destinationCode: { type: String ,required: true},
    originDate: { type: String ,required: true},
    destinationDate: { type: String ,required: true}
}); 
const personalDetailsModel = model<PersonalDetails & Document>('personalDetails', personalDetailsSchema); 
export default personalDetailsModel;
