import { Request } from 'express';

export interface User {
    email: string;
    name: string;
    _id: string;
}

export interface AuthRequest<P = any, ResB = any, ReqB = any, Q = any> extends Request<P, ResB, ReqB, Q> {
    user?: User;
}
