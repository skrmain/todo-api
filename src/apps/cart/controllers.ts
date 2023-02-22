import { Cart } from './models';
import { DbController } from '../../shared/db-controller';

const cartController = new DbController(Cart);
export default cartController;
