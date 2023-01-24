import { User } from './modals';

interface UserFilter {
    email: string;
    password?: string;
}

const getOne = (filter: UserFilter, select = '-__v -password') => User.findOne(filter, select).lean();

const getAll = (filter: UserFilter, select = '-__v -password') => User.find(filter, select).lean();

const create = (details: UserFilter) => User.create(details);

export default { getOne, getAll, create };
