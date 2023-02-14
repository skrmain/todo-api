import { User } from './modals';

interface UserFilter {
    _id?: string;
    email?: string;
    password?: string;
}

interface UserUpdateDetails {
    name: string;
}

const getOne = (filter: UserFilter, select = '-__v -password') => User.findOne(filter, select).lean();

const getAll = (filter: UserFilter, select = '-__v -password') => User.find(filter, select).lean();

const create = (details: UserFilter) => User.create(details);

const updateOne = (filter: UserFilter, details: UserUpdateDetails) => User.updateOne(filter, details).lean();

export default { getOne, getAll, create, updateOne };
