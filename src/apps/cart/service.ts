import { CartModel } from './models';
import { Database } from '../../shared/database';

class CartService<T> extends Database<T> {}

export default new CartService(CartModel);
