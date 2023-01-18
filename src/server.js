const express = require('express');
const cors = require('cors');

const middleware = require('./shared/middleware');
const utils = require('./shared/utils');

const app = express();

app.use(cors());
app.use(middleware.checkJson);
app.use(middleware.logRequest);

app.get(
    '/',
    // eslint-disable-next-line no-unused-vars
    utils.asyncWrapper(async (req, res) => {
        throw new Error('Invalid Path');
    })
);

app.use('/', require('./apps/auth/auth.routes'));
app.use('/todo', middleware.checkAuth, require('./apps/todo/todo.routes'));
app.use('/user', middleware.checkAuth, require('./apps/user/user.routes'));

app.use(middleware.handleInvalidPath);
app.use(middleware.handleError);

module.exports = { app };
