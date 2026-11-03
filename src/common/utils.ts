import { createHmac } from 'crypto';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export const successResponse = ({ message = 'Successful', data = {}, metadata = {} }) => {
    return { status: true, message, data, ...metadata };
};

// export const sendFailResponse = (res: Response, responseData: APIResponse) => {
//   const { error, errors, status = 'fail', statusCode = 400, message = 'Fail' } = responseData;
//   return res.status(statusCode).send({ status, message, error, errors });
// };

export const createToken = (payload: object, expiry = 1) => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * expiry; // In Hours

    return jwt.sign({ ...payload, exp }, env.JWT_SECRET);
};

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET);

export const getObjectId = (id = '') => new Types.ObjectId(id);

export const encrypt = (data: any) => createHmac('sha256', env.ENCRYPTION_SECRET).update(data).digest('hex');

export const isValidObjectId = (value: string) => {
    try {
        getObjectId(value);
        return true;
    } catch {
        return false;
    }
};

export const join = (obj?: object | string | null) => {
    if (typeof obj === 'string') return obj;

    return Object.entries(obj || {})
        .map((v) => v.join(': '))
        .join(' || ');
};
