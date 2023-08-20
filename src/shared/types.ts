import { Request } from 'express';
import { Types } from 'mongoose';

export interface User {
    email: string;
    name: string;
    _id: string;
}

export interface AuthRequest<P = any, ResB = any, ReqB = any, Q = any> extends Request<P, ResB, ReqB, Q> {
    user?: User;
}

export interface IBaseModel {
    _id?: string | Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
}

// export interface APIResponse {
//   data?: any;
//   message?: string;
//   status?: "success" | "fail";
//   statusCode?: number;
//   error?: string;
//   errors?: any[];
// }
