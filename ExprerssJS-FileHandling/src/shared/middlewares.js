const { extname } = require('path');
const { Request, Response, NextFunction } = require('express');
const formidable = require('formidable');
const multer = require('multer');

const uploadFileM = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`),
    }),
});

const form = formidable({ multiples: true, keepExtensions: true, uploadDir: 'uploads' });

const uploadFileF = (req) =>
    new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            req.files = files;
            resolve(true);
        });
    });

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const fileUploadHandler = async (req, res, next) => {
    switch (req.params.uploadPackage) {
        case 'multer':
            return uploadFileM.array('avatar')(req, res, next);
        case 'formidable':
            await uploadFileF(req);
            break;
    }
    next();
};

module.exports = { fileUploadHandler };
