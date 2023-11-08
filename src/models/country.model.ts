import { model, Schema, Document } from 'mongoose';
import { Country } from '@interfaces/cron.interface';

const CountrySchema: Schema = new Schema({
    Code:{ type: String ,required: true},
    Label:{ type: String ,required: true}, 
}); 
const countryModel = model<Country & Document>('country', CountrySchema); 
export default countryModel;