import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import { invalidPathHandler, parseJson, requestErrorHandler } from './common/middleware';

import Routes from './routes';

export const app = express();

app.use(parseJson);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', Routes);

app.use(invalidPathHandler);
app.use(requestErrorHandler);
