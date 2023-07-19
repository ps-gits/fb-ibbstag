import { model, Schema, Document } from 'mongoose';
import { SpecialServiceCode } from '@interfaces/cron.interface';

const specialServiceCodeSchema: Schema = new Schema({
    Code:{ type: String ,required: true},
    Label:{ type: String },
    ValueCodeProperties:{ type: Array},
    Extensions:{ type: String},
}); 
const specialServiceCodeModel = model<SpecialServiceCode & Document>('specialServiceCode', specialServiceCodeSchema); 
export default specialServiceCodeModel;
