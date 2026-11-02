import { UpdateQuery } from 'mongoose';

import { User, UserModel } from './user.models.js';

type UserFilter = Partial<User>;

const userRepository = {
    getOne(filter: UserFilter, select = '') {
        return UserModel.findOne(filter, `${select} -__v`).lean();
    },

    getAll(filter: UserFilter = {}, select = '') {
        return UserModel.find(filter, `${select} -__v`).lean();
    },

    create(details: User) {
        return UserModel.create(details);
    },

    updateOne(filter: UserFilter, details: UpdateQuery<User>) {
        return UserModel.updateOne(filter, details).lean();
    },
};

export default userRepository;
