import { join } from 'path';
import { Router, Request, Response } from 'express';

import { uploadFileF, uploadFileM } from '../shared/middlewares';
import { getFilesInfo, saveFilesInfoF, saveFilesInfoM } from '../shared/utils';

const router = Router();

router.post(
  '/uploadM',
  uploadFileM.array('avatar'),
  async (req: Request, res: Response) => {
    if (req.file) {
      saveFilesInfoM(req.file);
    } else if (req.files && req.files instanceof Array) {
      saveFilesInfoM(req.files);
    }
    res.send({
      message: 'Upload Success',
      file: req.file,
      files: req.files,
      body: req.body,
    });
  }
);

router.post('/uploadF', async (req: Request, res: Response) => {
  const result = await uploadFileF(req);

  await saveFilesInfoF(result.files);

  res.send({ message: 'Upload Success', ...result, body: req.body });
});

router.get('/uploads', async (req: Request, res: Response) => {
  const data = await getFilesInfo();
  res.send({ status: 'success', message: 'Files Data', data: data });
});

router.get('/download/:name', async (req: Request, res: Response) => {
  if (!req.params.name) {
    console.log('name not exists in params to download');
    return res.send({ message: 'Invalid' });
  }

  const fileName = req.params.name;
  const filePath = join(__dirname, '../../..', '/uploads/');

  res.download(filePath + fileName, (err) => {
    if (err) {
      console.log('Found invalid path for download');
      res.status(500).send({
        message: 'File can not be downloaded: ' + err,
      });
    }
  });
});

export default router;
