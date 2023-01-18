// import { Response } from 'express';
import mongoose from 'mongoose';
import { sign, verify } from 'jsonwebtoken';

import config from '../config';

// import { APIResponse } from './types';

export const successResponse = ({ message = 'Successful', data = {}, status = true }) => {
    return { status, message, data };
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

export const createToken = (payload: object) => sign(payload, config.jwt_secret);

export const verifyToken = (token: string) => verify(token, config.jwt_secret);
