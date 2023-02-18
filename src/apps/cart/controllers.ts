import { DbController } from '../../shared/db-controller';
import { Cart } from './models';

const cartController = new DbController(Cart);
export default cartController;
