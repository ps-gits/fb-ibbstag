import { model, Schema, Document } from 'mongoose';
import { EligibleOriginDestinations } from '@interfaces/cron.interface';

const eligibleOriginDestinationsSchema: Schema = new Schema({
    TargetDate:{ type: String },
    OriginCode:{ type: String ,required: true},
    DestinationCode:{ type: String ,required: true},
    Date:{ type: String ,required: true},
}); 
const eligibleOriginDestinationsModel = model<EligibleOriginDestinations & Document>('eligibleOriginDestinations', eligibleOriginDestinationsSchema); 
export default eligibleOriginDestinationsModel;
