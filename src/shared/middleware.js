/* eslint-disable no-param-reassign */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const Joi = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
const {
    Error: { ValidationError: MValidationError, CastError: MCastError },
} = require('mongoose');

const utils = require('./utils');

/**
 * To check for Auth
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns
 */
const checkAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(400);
            throw new Error("'authorization' token missing in header");
        }
        const token = req.headers.authorization.split('Bearer ')[1];
        req.user = utils.verifyToken(token).user;
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * To do JSON Parsing and handle JSON Parsing Error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.Next} next
 */
const checkJson = (req, res, next) => {
    express.json()(req, res, (error) => {
        if (!error) {
            return next();
        }
        res.status(400);
        error.fullMessage = error.message;
        error.message = 'Invalid data format.';
        return next(error);
    });
};

/**
 * To Handle Not Defined routes
 * @param {express.Request} req
 * @param {express.Response} res
 */
const handleInvalidPath = (req, res) => {
    res.status(404);
    throw new Error('Invalid Path.');
};

/**
 * To log Incoming Request
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.Next} next
 */
const logRequest = (req, res, next) => {
    console.log(`[req] ${req.hostname} : ${req.method} : ${req.path}`);
    next();
};

/**
 * To Validate Request Body
 * @param {Joi.ObjectSchema} schema
 * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => { }}
 */
const validateReqBody = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body);
    if (!error) {
        req.body = value;
        return next();
    }
    res.status(400);
    throw error;
};

/**
 * To Handle Error
 * @param {express.Errback} error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns
 */
// eslint-disable-next-line no-unused-vars
const handleError = (error, req, res, next) => {
    if (error instanceof MValidationError) {
        res.status(400);
        error.fullMessage = error.message;
        error.message = 'Invalid Input';
    } else if (error instanceof JsonWebTokenError) {
        res.status(401);
        error.fullMessage = error.message;
        error.message = 'Invalid Token';
    } else if (error instanceof MCastError) {
        res.status(400);
        error.fullMessage = error.message;
        error.message = 'Invalid Id';
    }

    const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    console.log('[handleError] ', error.message);
    return res.status(statusCode).send({ message: error.message, status: false });
};

module.exports = {
    checkAuth,
    checkJson,
    handleInvalidPath,
    handleError,
    logRequest,
    validateReqBody,
};
