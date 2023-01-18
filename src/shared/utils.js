const mongoose = require('mongoose');
const { sign, verify } = require('jsonwebtoken');
const { createHmac } = require('crypto');

const config = require('../config');

const connectMongoDB = async () => {
    try {
        const con = await mongoose.connect(config.mongoDbUri, { dbName: config.dbName });
        console.log(`[MongoDB] Connected to '${con.connection.name}' DB`);
    } catch (err) {
        console.log('[MongoDB] Error : ', err.message);
        process.exit(0);
    }
};

const successResponse = ({ message = 'Successful', data = {}, status = true }) => ({ data, status, message });

const failResponse = ({ message = 'Fail', data = {}, status = false }) => ({ data, status, message });

/**
 *
 * @param {object} data - payload object
 * @param {number} expiry - expiry duration in hours
 */
const createToken = (data, expiry = 1) => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * expiry; // In Hours

    return sign({ ...data, exp }, config.jwtSecret);
};

/**
 *
 * @param {string} token - value to verify
 * @returns token payload
 */
const verifyToken = (token) => verify(token, config.jwtSecret);

/**
 * To Encrypt Data using `HMAC-SHA-256`
 * @param {string} data
 * @returns Encrypted data
 */
const encrypt = (data) => createHmac('sha256', config.encryptionSecret).update(data).digest('hex');

/**
 * To Handle `unhandledRejection` Errors
 * - Ref: https://codefibershq.com/blog/handling-promise-rejections-in-expressjs-nodejs-with-ease
 * - Ref: More Improvement - https://github.com/davidbanham/express-async-errors/blob/master/index.js
 *   - Using - `express-async-errors`
 * @param {*} fn
 * @returns
 */
const asyncWrapper = (fn) => async (req, res, next) => {
    try {
        return await fn(req, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    connectMongoDB,
    successResponse,
    failResponse,
    createToken,
    verifyToken,
    encrypt,
    asyncWrapper,
};
