import { User } from './models';
import { DbController } from '../../shared/db-controller';

const userController = new DbController(User);
export default userController;
