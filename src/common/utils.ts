import { createHmac } from 'crypto';
import { Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import winston, { format } from 'winston';
import { CustomHelpers } from 'joi';

import config from '../config';

export const successResponse = ({ message = 'Successful', data = {}, metadata = {} }) => {
    return { status: true, message, data, ...metadata };
};

// export const sendFailResponse = (res: Response, responseData: APIResponse) => {
//   const { error, errors, status = 'fail', statusCode = 400, message = 'Fail' } = responseData;
//   return res.status(statusCode).send({ status, message, error, errors });
// };

export const createToken = (payload: object, expiry = 1) => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * expiry; // In Hours

    return sign({ ...payload, exp }, config.jwtSecret);
};

export const verifyToken = (token: string) => verify(token, config.jwtSecret);

export const getObjectId = (id = '') => new Types.ObjectId(id);

export const encrypt = (data: any) => createHmac('sha256', config.encryptionSecret).update(data).digest('hex');

export const ValidateObjectId = (value: any, helper: CustomHelpers) => {
    try {
        getObjectId(value);
        return true;
    } catch (error) {
        return helper.message({ custom: error instanceof Error ? error.message : 'Invalid ObjectId' });
    }
};

export const join = (obj?: object | string | null) => {
    if (typeof obj === 'string') return obj;

    return Object.entries(obj || {})
        .map((v) => v.join(': '))
        .join(' || ');
};

export const logger = winston.createLogger({
    level: 'silly',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new winston.transports.Console()],
});
