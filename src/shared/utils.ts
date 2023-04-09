import mongoose, { Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';

import config from '../config';

// import { APIResponse } from './types';

export const successResponse = ({ message = 'Successful', data = {}, status = true, metadata = {} }) => {
    return { status, message, data, ...metadata };
};

// export const sendFailResponse = (res: Response, responseData: APIResponse) => {
//   const { error, errors, status = 'fail', statusCode = 400, message = 'Fail' } = responseData;
//   return res.status(statusCode).send({ status, message, error, errors });
// };

export const connectMongoDB = async (uri: string) => {
    try {
        const con = await mongoose.connect(uri, {
            dbName: 'test',
        });
        console.log(`⚡️[MongoDB] Connected to '${con.connection.name}' DB`);
    } catch (error) {
        console.log('[MongoDB] Error : ', error);
        process.exit(0);
    }
};

/**
 * To create a JWT token
 * @param payload data to use as payload in token
 * @param expiry number in hours, `default` 1
 * @returns token
 */
export const createToken = (payload: object, expiry = 1) => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * expiry; // In Hours

    return sign({ ...payload, exp }, config.jwt_secret);
};

export const verifyToken = (token: string) => verify(token, config.jwt_secret);

export const getObjectId = (id = '') => new Types.ObjectId(id);
