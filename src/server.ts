import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { invalidPathHandler, parseJson, requestErrorHandler } from './common/middleware';
import { swaggerOptions } from './common/constants';

import Routes from './routes';
import logger from './common/logger';

export const app = express();

app.use(parseJson);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));

app.use('/', Routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

app.use(invalidPathHandler);
app.use(requestErrorHandler);
