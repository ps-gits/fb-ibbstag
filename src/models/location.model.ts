import { model, Schema, Document } from 'mongoose';
import { Location } from '@interfaces/cron.interface';

const locationSchema: Schema = new Schema({
    Code:{ type: String ,required: true},
    Label:{ type: String ,required: true},
    icao: { type: String ,required: true},
    iata: { type: String ,required: true},
    name: { type: String ,required: true},
    city:{ type: String ,required: true},
    region: { type: String },
    country: { type: String ,required: true},
    elevation_ft: { type: String ,required: true},
    latitude:{ type: String ,required: true},
    longitude:{ type: String ,required: true},
    timezone:{ type: String ,required: true},
    currency: { type: String ,required: true},
    symbol: { type: String ,required: true},
    cpd_code:{type:String}
}); 
const locationModel = model<Location & Document>('location', locationSchema); 
export default locationModel;
