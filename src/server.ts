import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import { checkAuth, invalidPathHandler, requestErrorHandler, requestLogger } from './shared/middleware';

import AuthRoutes from './apps/auth/routes';
import UserRoutes from './apps/user/routes';
import ProductRoutes from './apps/product/routes';
import CartRoutes from './apps/cart/routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(requestLogger);

app.get('/', (req, res) => res.send({ status: 'Active⚡' }));
app.use('/', AuthRoutes);
app.use('/me', checkAuth, UserRoutes);
app.use('/products', ProductRoutes);
app.use('/cart', checkAuth, CartRoutes);
// app.use('/images', express.static('images'));

app.use(invalidPathHandler);
app.use(requestErrorHandler);
