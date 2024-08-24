import { NextFunction, Request, Response, Router } from 'express';
import { OAuth2Client } from 'google-auth-library';

import userService from '../user/user.service';

import { InvalidHttpRequestError, UnauthorizedHttpRequestError } from '../../common/custom-errors';
import { createToken, successResponse, verifyToken } from '../../common/utils';
import { googleOAuthCred } from '../../config';
import { AuthRequest, User } from '../../common/types';
import { validateReqBody } from '../../common/middleware';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './auth.validations';

export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

class AuthRouter {
    router: Router;
    constructor() {
        this.router = Router();

        this.router.post('/register', validateReqBody(RegisterSchema), this.register);
        this.router.post('/login', validateReqBody(LoginSchema), this.login);
        this.router.post('/token', validateReqBody(TokenRefreshSchema), this.refreshAccessToken);
        this.router.get('/authorize-url', this.getAuthorizeUrl);
        this.router.post('/callback', this.callback);
    }
    private async register(req: Request<any, any, RegisterBody>, res: Response) {
        const details = req.body;
        const existingUser = await userService.getOne({ email: details.email });
        if (existingUser) {
            throw new InvalidHttpRequestError('Invalid Email');
        }

        // TODO: Add password Encryption
        await userService.create({ ...details });
        // TODO: send register mail with account activation link
        return res.send(successResponse({ message: 'Registration successful' }));
    }

    private async login(req: Request<any, any, LoginBody>, res: Response) {
        const details = req.body;

        // TODO: Add password Encryption
        // TODO: Add check in other routes if account is activated or nots
        const user = await userService.getOne({ ...details }, '-createdAt -updatedAt');
        if (!user) {
            throw new UnauthorizedHttpRequestError('Invalid Login Credentials');
        }

        const token = createToken(user);
        const refresh = createToken(user, 24 * 30);
        return res.send(successResponse({ message: 'Login Successful', data: { token, refresh } }));
    }

    private async refreshAccessToken(req: Request, res: Response) {
        const data: any = verifyToken(req.body.refresh);
        const token = createToken(data);
        return res.send(successResponse({ data: { token } }));
    }

    // TODO:
    private async getAuthorizeUrl(req: Request, res: Response) {
        const oAuthClient = new OAuth2Client({
            clientId: googleOAuthCred.web.client_id,
            clientSecret: googleOAuthCred.web.client_secret,
            redirectUri: googleOAuthCred.web.redirect_uris[0],
        });

        const authorizeUrl = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile'],
        });

        return res.send(successResponse({ data: { authorizeUrl } }));
    }

    // TODO:
    private async callback(req: Request, res: Response) {
        console.log('Req.Query', req.query);
        const { code } = req.query;

        if (!code) throw new Error('"code" does not exists in query');

        const oAuthClient = new OAuth2Client({
            clientId: googleOAuthCred.web.client_id,
            clientSecret: googleOAuthCred.web.client_secret,
            redirectUri: googleOAuthCred.web.redirect_uris[0],
        });

        const re = await oAuthClient.getToken(code.toString());
        console.log('R ', re);

        oAuthClient.setCredentials(re.tokens);

        if (!re.tokens.access_token) {
            throw new Error("access_token doesn't exists");
        }

        const tokenInfo = await oAuthClient.getTokenInfo(re.tokens.access_token);

        return res.send(successResponse({ message: 'Success' }));
    }
}

export default new AuthRouter().router;
