import { Product } from './models';
import { DbController } from '../../shared/db-controller';

const productController = new DbController(Product);
export default productController;
