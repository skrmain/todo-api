import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { SavedProductModel } from './models';

class SavedProductService<T> extends MongooseOperationsWrapper<T> {}

export default new SavedProductService(SavedProductModel);
