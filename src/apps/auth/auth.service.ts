import { OAuth2Client } from 'google-auth-library';

import { InvalidHttpRequestError, UnauthorizedHttpRequestError } from '../../errors/custom-errors.js';
import { createToken, verifyToken } from '../../common/utils.js';
import { googleOAuthCred } from '../../config/index.js';
import userService from '../user/user.service.js';

type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

type LoginInput = {
    email: string;
    password: string;
};

class AuthService {
    async register(details: RegisterInput) {
        const existingUser = await userService.getOne({ email: details.email });
        if (existingUser) {
            throw new InvalidHttpRequestError('Invalid Email');
        }

        // TODO: Add password Encryption
        await userService.create({ ...details });
        // TODO: send register mail with account activation link
    }

    async login(details: LoginInput) {
        // TODO: Add password Encryption
        // TODO: Add check in other routes if account is activated or nots
        const user = await userService.getOne({ ...details }, '-createdAt -updatedAt');
        if (!user) {
            throw new UnauthorizedHttpRequestError('Invalid Credentials');
        }

        return {
            token: createToken(user),
            refresh: createToken(user, 24 * 30),
        };
    }

    refreshAccessToken(refresh: string) {
        const data: any = verifyToken(refresh);
        return createToken(data);
    }

    getAuthorizeUrl() {
        const oAuthClient = this.createOAuthClient();
        return oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile'],
        });
    }

    async callback(code?: string) {
        if (!code) {
            throw new Error('"code" does not exists in query');
        }

        const oAuthClient = this.createOAuthClient();
        const result = await oAuthClient.getToken(code);
        oAuthClient.setCredentials(result.tokens);

        if (!result.tokens.access_token) {
            throw new Error("access_token doesn't exists");
        }

        await oAuthClient.getTokenInfo(result.tokens.access_token);
    }

    private createOAuthClient() {
        return new OAuth2Client({
            clientId: googleOAuthCred.web.client_id,
            clientSecret: googleOAuthCred.web.client_secret,
            redirectUri: googleOAuthCred.web.redirect_uris[0],
        });
    }
}

export default new AuthService();
