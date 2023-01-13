const TodoModel = require('./todo.models');

const getOne = (filter, select = '') => TodoModel.findOne(filter, `-__v ${select}`).lean();

const getAll = (filter, select = '') => TodoModel.find(filter, `-__v ${select}`).lean();

const create = ({ title, detail, userId }) => TodoModel.create({ title, detail, userId });

const exists = (filter) => TodoModel.exists(filter).lean();

const deleteOne = (filter) => TodoModel.deleteOne(filter).lean();

const updateOne = (filter, data) => TodoModel.updateOne(filter, data).lean();

module.exports = {
    create,
    getOne,
    exists,
    getAll,
    deleteOne,
    updateOne,
};
