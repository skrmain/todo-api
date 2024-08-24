import { Response, Router } from 'express';

import { AuthRequest, User } from '../../common/types';
import { successResponse } from '../../common/utils';
import { validateReqBody } from '../../common/middleware';
import { UpdateUserDetailSchema } from './user.validations';

import userService from './user.service';

class UserRouter {
    router: Router;
    constructor() {
        this.router = Router();

        this.router.get('/', this.getUser);
        this.router.patch('/', validateReqBody(UpdateUserDetailSchema), this.updateUser);
    }

    private async getUser(req: AuthRequest, res: Response) {
        const user = await userService.getOne({ email: req.user?.email || '' });
        return res.send(successResponse({ data: userService.parseUser(user) }));
    }

    private async updateUser(req: AuthRequest, res: Response) {
        await userService.updateOne({ _id: req.user?._id }, { name: req.body.name });
        return res.send(successResponse({ message: 'Details Updated' }));
    }
}

export default new UserRouter().router;
