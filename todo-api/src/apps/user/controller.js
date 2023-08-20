// eslint-disable-next-line no-unused-vars
const { Request, Response, NextFunction } = require('express');

const { successResponse } = require('../../shared/utils');
const userService = require('./service');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const userDetail = async (req, res, next) => {
    try {
        const user = await userService.getOne({ _id: req.user._id });
        return res.send(successResponse({ data: user }));
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
const usersSearch = async (req, res, next) => {
    try {
        const users = await userService.getAll({ username: { $regex: req.query.username } }, '-email -createdAt -updatedAt');
        return res.send(successResponse({ data: users }));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    userDetail,
    usersSearch,
};
