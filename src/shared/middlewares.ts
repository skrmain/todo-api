import path from 'path';
import { Request } from 'express';

import multer from 'multer';
import formidable from 'formidable';

import { FormidableFieldFileType } from './types';

// const upload = multer({ dest: "uploads/" });

// Upload storage Setting
const DIR = './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //    if ! error
    cb(null, DIR);
    // else
    // cb(new Error("Email Already Exists"), DIR);
  },
  filename: (req, file, cb) => {
    console.log('D', req.body);
    console.log('E', req.file);
    console.log('F', file);
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

export const uploadFileM = multer({ storage: storage });

const form = formidable({
  multiples: true,
  keepExtensions: true,
  uploadDir: 'uploads',
});

export const uploadFileF = (req: Request) => {
  return new Promise<FormidableFieldFileType>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ fields, files });
    });
  });
};
