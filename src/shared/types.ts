import { Request } from 'express';

export interface User {
    email: string;
    name: string;
    _id: string;
}

export interface AuthRequest extends Request {
    user?: User;
}

// export interface APIResponse {
//   data?: any;
//   message?: string;
//   status?: "success" | "fail";
//   statusCode?: number;
//   error?: string;
//   errors?: any[];
// }
