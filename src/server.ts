import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { checkAuth, invalidPathHandler, parseJson, requestErrorHandler } from './shared/middleware';
import { swaggerOptions } from './shared/constants';

import AuthRoutes from './apps/auth/routes';
import UserRoutes from './apps/user/routes';
import ProductRoutes from './apps/product/routes';
import CartRoutes from './apps/cart/routes';
import OrderRoutes from './apps/order/routes';
import SavedRoutes from './apps/savedProduct/routes';
import NoteRoutes from './apps/note/routes';
import logger from './shared/logger';
import { asyncWrapper } from './shared/utils';

export const app = express();
const openApiSpecification = swaggerJsdoc(swaggerOptions);

app.use(parseJson);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));

app.get('/', (req, res) => res.send('Ok'));
app.use('/', AuthRoutes);
app.use('/users', checkAuth, UserRoutes);
app.use('/products', ProductRoutes);
app.use('/carts', checkAuth, CartRoutes);
app.use('/orders', checkAuth, OrderRoutes);
app.use('/saved', checkAuth, SavedRoutes);
app.use('/notes', checkAuth, NoteRoutes);
app.get(
    '/async-error',
    // eslint-disable-next-line no-unused-vars
    asyncWrapper(async (req: any, res: any) => {
        throw new Error('Invalid Path');
    })
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification));
// app.use('/images', express.static('images'));

app.use(invalidPathHandler);
app.use(requestErrorHandler);
