const UserModel = require('./user.models');

const getOne = (filter, select = '') => UserModel.findOne(filter, `-password -__v ${select}`).lean();

const create = (username, email, password) => UserModel.create({ username, email, password });

const exists = (filter) => UserModel.exists(filter).lean();

module.exports = { create, getOne, exists };
