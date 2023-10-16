import { createHmac } from 'crypto';
import mongoose, { Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';

import config from '../config';
import { CustomHelpers } from 'joi';

// import { APIResponse } from './types';

export const successResponse = ({ message = 'Successful', data = {}, status = true, metadata = {} }) => {
    return { status, message, data, ...metadata };
};

// export const sendFailResponse = (res: Response, responseData: APIResponse) => {
//   const { error, errors, status = 'fail', statusCode = 400, message = 'Fail' } = responseData;
//   return res.status(statusCode).send({ status, message, error, errors });
// };

/**
 * To create a JWT token
 * @param payload data to use as payload in token
 * @param expiry number in hours, `default` 1
 * @returns token
 */
export const createToken = (payload: object, expiry = 1) => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * expiry; // In Hours

    return sign({ ...payload, exp }, config.jwtSecret);
};

export const verifyToken = (token: string) => verify(token, config.jwtSecret);

export const getObjectId = (id = '') => new Types.ObjectId(id);

export const encrypt = (data: any) => createHmac('sha256', config.encryptionSecret).update(data).digest('hex');

/**
 * To Handle `unhandledRejection` Errors
 * - Ref: https://codefibershq.com/blog/handling-promise-rejections-in-expressjs-nodejs-with-ease
 * - Ref: More Improvement - https://github.com/davidbanham/express-async-errors/blob/master/index.js
 *   - Using - `express-async-errors`
 * @param {*} fn
 * @returns
 */
export const asyncWrapper = (fn: any) => async (req: any, res: any, next: any) => {
    try {
        return await fn(req, res);
    } catch (error) {
        return next(error);
    }
};

export const ValidateObjectId = (value: any, helper: CustomHelpers) => {
    try {
        getObjectId(value);
        return true;
    } catch (error) {
        return helper.message({ custom: error instanceof Error ? error.message : 'Invalid ObjectId' });
    }
};
