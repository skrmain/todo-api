import { CartModel } from './models';
import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';

class CartService<T> extends MongooseOperationsWrapper<T> {}

export default new CartService(CartModel);
