import { UserModel } from './models';
import { Database } from '../../shared/database';

class UserService<T> extends Database<T> {}

export default new UserService(UserModel);
