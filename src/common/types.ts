import { Request } from 'express';

export interface User {
    email: string;
    name: string;
    _id: string;
}

export interface AuthRequest<P = any, ResB = any, ReqB = any, Q = any> extends Request<P, ResB, ReqB, Q> {
    user?: User;
}

export enum SortOrder {
    asc = 'asc',
    desc = 'desc',
}

export enum MongoSortOrder {
    asc = 1,
    desc = -1,
}
