import { Database } from '../../shared/database';
import { SavedProductModel } from './models';

class SavedProductService<T> extends Database<T> {}

export default new SavedProductService(SavedProductModel);
