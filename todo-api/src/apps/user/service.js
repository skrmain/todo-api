const Database = require('../../shared/database');
const UserModel = require('./model');

class UserService extends Database {
    getOne(filter, select = '') {
        return super.getOne(filter, `-password -__v ${select}`);
    }

    getAll(filter, select = '') {
        return super.getAll(filter, `-password -__v ${select}`);
    }
}

const userService = new UserService(UserModel);

// delete userService.deleteOne;
module.exports = userService;
