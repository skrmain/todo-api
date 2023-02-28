import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';

import { checkAuth, invalidPathHandler, requestErrorHandler } from './shared/middleware';

import AuthRoutes from './apps/auth/routes';
import UserRoutes from './apps/user/routes';
import ProductRoutes from './apps/product/routes';
import CartRoutes from './apps/cart/routes';
import OrderRoutes from './apps/order/routes';
import SavedRoutes from './apps/saved/routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => res.send('Ok'));
app.use('/', AuthRoutes);
app.use('/me', checkAuth, UserRoutes);
app.use('/products', ProductRoutes);
app.use('/cart', checkAuth, CartRoutes);
app.use('/orders', checkAuth, OrderRoutes);
app.use('/saved', checkAuth, SavedRoutes);
// app.use('/images', express.static('images'));

app.use(invalidPathHandler);
app.use(requestErrorHandler);
