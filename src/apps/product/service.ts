import { Database } from '../../shared/database';
import { ProductModel } from './models';

class ProductService<T> extends Database<T> {}

export default new ProductService(ProductModel);
