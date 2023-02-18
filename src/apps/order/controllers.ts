import { DbController } from '../../shared/db-controller';
import { Order } from './models';

const orderController = new DbController(Order);
export default orderController;
