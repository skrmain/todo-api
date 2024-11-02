import { FilterQuery } from 'mongoose';

import { MongooseOperationsWrapper } from '../../common/mongoose-operations-wrapper';
import { UserModel } from './user.models';

class UserService<T> extends MongooseOperationsWrapper<T> {
    getOne(filter: FilterQuery<T>, select = '') {
        return super.getOne(filter, `-password -__v ${select}`);
    }

    getAll(filter: FilterQuery<T> = {}, select = '') {
        return super.getAll(filter, `-password -__v ${select}`);
    }

    parseUser(user?: any) {
        return {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            createdAt: user?.createdAt,
        };
    }
}

export default new UserService(UserModel);
