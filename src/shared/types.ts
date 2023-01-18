import { Request } from 'express';

export interface User {
    email: string;
    name: string;
    _id: string;
}

export interface AuthRequest extends Request {
    user?: User;
}

// export interface MyResponse extends Response {}

// export interface RegisterModel {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface LoginModel {
//   email: string;
//   password: string;
// }

// export interface APIResponse {
//   data?: any;
//   message?: string;
//   status?: "success" | "fail";
//   statusCode?: number;
//   error?: string;
//   errors?: any[];
// }
