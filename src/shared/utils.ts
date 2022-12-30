import formidable from 'formidable';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { FileInfoType } from './types';

export const UploadDataFilePathFromRoot = 'uploads/data.json';

const dataFilePath = join(__dirname, '../..', UploadDataFilePathFromRoot);

export const getFilesInfo = async () => {
  if (!existsSync(dataFilePath)) {
    console.log('Data file not exists');
    await writeFile(dataFilePath, '[]');
  }
  const rawData = await readFile(dataFilePath, {
    encoding: 'utf8',
  });

  const dataArray: Array<FileInfoType> = JSON.parse(rawData || '[]');

  const data = dataArray.map((val) => {
    delete val.filepath;
    return val;
  });

  return data;
};

export const saveFilesInfoF = async (filesData: formidable.Files) => {
  const filesInfo: FileInfoType[] = [];
  Object.keys(filesData).forEach((value) => {
    const files = filesData[value];

    if (files instanceof Array) {
      files.forEach((val2) => {
        const file: FileInfoType = {
          mimetype: val2.mimetype,
          mtime: val2.mtime,
          newFilename: val2.newFilename,
          originalFilename: val2.originalFilename,
          size: val2.size,
          filepath: val2.filepath,
        };
        filesInfo.push({ ...file });
      });
    } else {
      filesInfo.push({
        mimetype: files.mimetype,
        mtime: files.mtime,
        newFilename: files.newFilename,
        originalFilename: files.originalFilename,
        size: files.size,
        filepath: files.filepath,
      });
    }
  });

  await writeFilesInfo(filesInfo);
};

export const saveFilesInfoM = async (
  filesData: Express.Multer.File[] | Express.Multer.File
) => {
  const filesInfo: FileInfoType[] = [];

  if (filesData instanceof Array) {
    filesData.forEach((val2) => {
      const file: FileInfoType = {
        mimetype: val2.mimetype,
        mtime: null,
        newFilename: val2.filename,
        originalFilename: val2.originalname,
        size: val2.size,
        filepath: val2.path,
      };
      filesInfo.push({ ...file });
    });
  } else {
    filesInfo.push({
      mimetype: filesData.mimetype,
      mtime: null,
      newFilename: filesData.filename,
      originalFilename: filesData.originalname,
      size: filesData.size,
      filepath: filesData.path,
    });
  }

  await writeFilesInfo(filesInfo);
};

const writeFilesInfo = async (filesInfo: FileInfoType[]) => {
  const oldInfo = await getFilesInfo();

  filesInfo.forEach((val) => {
    oldInfo.push(val);
  });

  await writeFile(dataFilePath, JSON.stringify(oldInfo));
  console.log('File write success');
  return true;
};
