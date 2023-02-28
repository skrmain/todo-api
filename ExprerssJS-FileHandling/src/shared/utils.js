const formidable = require('formidable');
const { existsSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');

const dataFilePath = join(__dirname, '../../uploads', 'data.json');

const parseFormidableFileData = (data) => ({
    mimetype: data.mimetype,
    mtime: data.mtime,
    newFilename: data.newFilename,
    originalFilename: data.originalFilename,
    size: data.size,
    filepath: data.filepath,
});

const parseMulterFileData = (data) => ({
    mimetype: data.mimetype,
    mtime: null,
    newFilename: data.filename,
    originalFilename: data.originalname,
    size: data.size,
    filepath: data.path,
});

const writeFilesInfo = async (newFiles) => {
    const oldFiles = await getSavedFiles();
    await writeFile(dataFilePath, JSON.stringify([...oldFiles, ...newFiles]));
    return true;
};

const getSavedFiles = async () => {
    if (!existsSync(dataFilePath)) {
        await writeFile(dataFilePath, '[]');
    }
    const rawData = await readFile(dataFilePath, { encoding: 'utf8' });
    const dataArray = JSON.parse(rawData || '[]');

    const data = dataArray.map((val) => {
        delete val.filepath;
        return val;
    });

    return data;
};

/**
 *
 * @param {formidable.Files} filesData
 */
const saveFormidableFilesInfo = async (filesData) => {
    const filesInfo = [];
    Object.keys(filesData).forEach((key) => {
        const files = filesData[key];

        if (files instanceof Array) {
            files.forEach((file) => {
                filesInfo.push(parseFormidableFileData(file));
            });
        } else {
            filesInfo.push(parseFormidableFileData(files));
        }
    });

    await writeFilesInfo(filesInfo);
};

/**
 *
 * @param {Express.Multer.File[] | Express.Multer.File} files
 */
const saveMulterFilesInfo = async (files) => {
    const filesInfo = [];

    if (files instanceof Array) {
        files.forEach((file) => {
            filesInfo.push(parseMulterFileData(file));
        });
    } else {
        filesInfo.push(parseMulterFileData(files));
    }

    await writeFilesInfo(filesInfo);
};

module.exports = {
    getSavedFiles,
    saveFormidableFilesInfo,
    saveMulterFilesInfo,
};
