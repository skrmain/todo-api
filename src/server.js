const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// eslint-disable-next-line object-curly-newline
const { checkAuth, checkJson, handleError, handleInvalidPath, logRequest } = require('./shared/middleware');
const utils = require('./shared/utils');
const { SwaggerOptions } = require('./shared/constants');

const app = express();
const specs = swaggerJSDoc(SwaggerOptions);

app.use(cors());
app.use(checkJson);
app.use(logRequest);

app.get(
    '/async-error',
    // eslint-disable-next-line no-unused-vars
    utils.asyncWrapper(async (req, res) => {
        throw new Error('Invalid Path');
    })
);

app.get('/', (req, res) => res.send('Ok'));
app.use('/', require('./apps/auth/route'));
app.use('/todos', checkAuth, require('./apps/todo/route'));
app.use('/users', checkAuth, require('./apps/user/route'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(handleInvalidPath);
app.use(handleError);

module.exports = { app };
