import { DbController } from '../../shared/db-controller';
import { SavedProduct } from './models';

const savedProductController = new DbController(SavedProduct);
export default savedProductController;
