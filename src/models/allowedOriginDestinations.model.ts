import { model, Schema, Document } from 'mongoose';
import { AllowedOriginDestinations } from '@interfaces/cron.interface';

const AllowedOriginDestinationsSchema: Schema = new Schema({
    OriginCode:{ type: String ,required: true},
    DestinationCodes:{ type: Array ,required: true}, 
}); 
const allowedOriginDestinationsModel = model<AllowedOriginDestinations & Document>('allowedOriginDestinations', AllowedOriginDestinationsSchema); 
export default allowedOriginDestinationsModel;