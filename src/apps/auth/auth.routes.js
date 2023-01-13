const { Router } = require('express');

const middleware = require('../../shared/middleware');
const utils = require('../../shared/utils');
const userController = require('../user/user.controllers');
const authValidation = require('./auth.validation');

const router = Router();

router.post('/register', middleware.validateReqBody(authValidation.VRegisterSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (await userController.exists({ username })) {
            res.status(400);
            throw new Error("'username' unavailable");
        }

        if (await userController.exists({ email })) {
            res.status(400);
            throw new Error("'email' unavailable");
        }

        await userController.create(username, email, utils.encrypt(password));

        return res.send(utils.successResponse({ message: 'Registration Successful' }));
    } catch (error) {
        return next(error);
    }
});

router.post('/login', middleware.validateReqBody(authValidation.VLoginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userController.getOne({ email, password: utils.encrypt(password) }, '-createdAt -updatedAt');
        if (!user) {
            res.status(400);
            throw new Error('Invalid Credentials');
        }

        const token = utils.createToken({ user });
        return res.send(utils.successResponse({ message: 'Login Successful', data: { user, token } }));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
