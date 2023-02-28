const express = require('express');
const { join } = require('path');

const { fileUploadHandler } = require('./shared/middlewares');
const { getSavedFiles, saveMulterFilesInfo, saveFormidableFilesInfo } = require('./shared/utils');

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => res.send('Ok'));

app.post('/upload/:uploadPackage', fileUploadHandler, async (req, res) => {
    if (req.params.uploadPackage === 'multer') {
        await saveMulterFilesInfo(req.file || req.files);
    } else if (req.params.uploadPackage === 'formidable') {
        await saveFormidableFilesInfo(req.files);
    }
    res.send({ message: 'Upload Success' });
});

app.get('/uploads', async (req, res) => {
    const data = await getSavedFiles();
    res.send({ total: data.length, data });
});

app.get('/download/:fileName', async (req, res) => {
    const filePath = join(__dirname, '..', '/uploads/', req.params.fileName);

    res.download(filePath, (error) => {
        if (error) {
            console.log('[error] ', error);
            res.status(400).send({ message: 'Invalid Path', status: false });
        }
    });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
