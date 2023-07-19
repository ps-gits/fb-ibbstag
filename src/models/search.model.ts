import { model, Schema, Document } from 'mongoose';
import { Search } from '@interfaces/search.interface';

const saerchSchema: Schema = new Schema({
   
}); 
const searchModel = model<Search & Document>('search', saerchSchema); 
export default searchModel;
