import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { OrderModel } from './models';

class OrderService<T> extends MongooseOperationsWrapper<T> {}

export default new OrderService(OrderModel);
