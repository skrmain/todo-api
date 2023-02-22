import userController from './../user/controller';

import { InvalidHttpRequestError, UnauthorizedHttpRequestError } from '../../shared/custom-errors';
import { ILoginBody, IRegisterBody } from './types';
import { createToken } from '../../shared/utils';

let instance: AuthController;

class AuthController {
    constructor() {
        if (instance) {
            throw new Error("Can't re instantiate");
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        instance = this;
    }

    public async registerUser(details: IRegisterBody) {
        const existingUser = await userController.getOne({ email: details.email });
        if (existingUser) {
            throw new InvalidHttpRequestError('Invalid Email');
        }

        await userController.create({ ...details });
        // TODO: send register mail with account activation link
    }

    public async loginUser(details: ILoginBody) {
        // TODO: Add check in other routes if account is activated or nots
        const user = await userController.getOne({ ...details }, '-createdAt -updatedAt');
        if (!user) {
            throw new UnauthorizedHttpRequestError('Invalid Login Credentials');
        }

        return createToken(user);
    }
}

const authController = Object.freeze(new AuthController());
export default authController;
