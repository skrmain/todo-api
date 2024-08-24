import config from './config';
import { connect } from 'mongoose';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import { checkAuth, invalidPathHandler, parseJson, requestErrorHandler } from './common/middleware';
import { join, logger } from './common/utils';

import TodoRoutes from './apps/todo/todo.routes';
import UserRoutes from './apps/user/user.routes';
import AuthRouter from './apps/auth/auth.routes';

(async () => {
    logger.verbose(`⚡️[MongoDB] Connecting to DB: ${config.dbName}`);
    const con = await connect(config.mongodbUri, { dbName: config.dbName });
    logger.verbose(`⚡️[MongoDB] Connected to DB: '${con.connection.name}' || HOST: ${con.connection.host}`);

    const app = express();

    app.use(cors());
    app.use(parseJson);
    app.use(express.urlencoded({ extended: true }));
    app.get('/', (req, res) => res.send('Ok'));
    app.use('/', AuthRouter);
    app.use('/todos', checkAuth, TodoRoutes);
    app.use('/user', checkAuth, UserRoutes);
    app.use(invalidPathHandler);
    app.use(requestErrorHandler);
    const server = app.listen(config.port, () => logger.verbose('⚡️[Server]: Started Listening'));
    logger.verbose(`⚡️[Server]: ${join(server.address())}`);
})();
