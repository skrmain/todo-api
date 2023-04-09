import { UserModel } from './models';
import { FilterQuery } from 'mongoose';

import { Database } from '../../shared/database';

class UserService<T> extends Database<T> {
    getOne(filter: FilterQuery<T>, select = '') {
        return super.getOne(filter, `-password -__v ${select}`);
    }

    getAll(filter: FilterQuery<T> = {}, select = '') {
        return super.getAll(filter, `-password -__v ${select}`);
    }
}

export default new UserService(UserModel);
