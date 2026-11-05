import { InvalidHttpRequestError, UnauthorizedHttpRequestError } from '../../errors/custom-errors.js';
import { createToken, verifyToken } from '../../common/utils.js';
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
}

export default new AuthService();
