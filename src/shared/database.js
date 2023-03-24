// eslint-disable-next-line no-unused-vars
const { Model } = require('mongoose');

class Database {
    model;

    /**
     *
     * @param {Model} model
     */
    constructor(model) {
        this.model = model;
    }

    getOne(filter, select = '') {
        return this.model.findOne(filter, `-__v ${select}`).lean();
    }

    getAll(filter, select = '') {
        return this.model.find(filter, `-__v ${select}`).lean();
    }

    create(detail) {
        return this.model.create(detail);
    }

    exists(filter) {
        return this.model.exists(filter).lean();
    }

    deleteOne(filter) {
        return this.model.deleteOne(filter).lean();
    }

    updateOne(filter, data) {
        return this.model.updateOne(filter, data).lean();
    }
}

module.exports = Database;
