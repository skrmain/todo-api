import { FilterQuery, UpdateQuery } from 'mongoose';

import { User, UserModel } from './user.models';

const userRepository = {
    getOne(filter: FilterQuery<User>, select = '') {
        return UserModel.findOne(filter, `${select} -__v`).lean();
    },

    getAll(filter: FilterQuery<User> = {}, select = '') {
        return UserModel.find(filter, `${select} -__v`).lean();
    },

    create(details: User) {
        return UserModel.create(details);
    },

    updateOne(filter: FilterQuery<User>, details: UpdateQuery<User>) {
        return UserModel.updateOne(filter, details).lean();
    },
};

export default userRepository;
