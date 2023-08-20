// eslint-disable-next-line no-unused-vars
const { Request, Response, NextFunction } = require('express');

// eslint-disable-next-line object-curly-newline
const { successResponse, encrypt, createToken, verifyToken } = require('../../shared/utils');
const userService = require('../user/service');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (await userService.exists({ username })) {
            res.status(400);
            throw new Error("'username' unavailable");
        }

        if (await userService.exists({ email })) {
            res.status(400);
            throw new Error("'email' unavailable");
        }

        await userService.create({ username, email, password: encrypt(password) });

        return res.send(successResponse({ message: 'Registration Successful' }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.getOne({ email, password: encrypt(password) }, '-createdAt -updatedAt');
        if (!user) {
            res.status(400);
            throw new Error('Invalid Credentials');
        }

        const token = createToken({ user });
        const refresh = createToken({ user }, 24 * 30);
        return res.send(successResponse({ message: 'Login Successful', data: { token, refresh } }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const refreshAccessToken = async (req, res, next) => {
    try {
        const { user } = verifyToken(req.body.refresh);
        const token = createToken({ user });
        return res.send(successResponse({ data: { token } }));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
};
