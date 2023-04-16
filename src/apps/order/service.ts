import { Database } from '../../shared/database';
import { OrderModel } from './models';

class OrderService<T> extends Database<T> {}

export default new OrderService(OrderModel);
