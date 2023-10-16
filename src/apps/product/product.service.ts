import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { ProductModel } from './product.models';

class ProductService<T> extends MongooseOperationsWrapper<T> {}

export default new ProductService(ProductModel);
