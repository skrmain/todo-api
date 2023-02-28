import { FilterQuery, Model } from 'mongoose';
import { readFile } from 'fs/promises';

import { IProduct, IProductImages, Product } from './models';
import { DbController } from '../../shared/db-controller';
import { IProductDetails, IProductFilter, IProductQuery, IProductSaveDetails } from './types';
import { InvalidHttpRequestError, NotFoundHttpRequestError } from '../../shared/custom-errors';

import savedProductController from './../saved/controllers';

// NOTE: Issue in adding type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: ProductController<any>;

class ProductController<T> extends DbController<T> {
    constructor(model: Model<T>) {
        super(model);
        if (instance) {
            throw new Error("Can't re instantiate");
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        instance = this;
    }

    public async getProducts(query: IProductQuery) {
        const { limit = 10, page = 1, search = '', sortBy = 'createdAt', sortOrder = 'desc', category = '', brand = '' } = query;
        const filter: FilterQuery<IProduct> = {};

        if (search) {
            filter.name = { $regex: search };
        }
        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = brand;
        }
        const products = await this.getWithQuery(filter, { limit, page, sortBy, sortOrder });
        const total = await productController.count(filter);

        return { data: products, metaData: { page, limit, sortBy, sortOrder, total } };
    }

    public async getProduct(details: IProductFilter) {
        const product = await productController.getOne(details);
        if (!product) {
            throw new NotFoundHttpRequestError("Product doesn't exists.");
        }

        return product;
    }

    public async addProduct(details: IProductDetails) {
        // TODO: add check if product is added by same user
        // TODO: add user type or role check
        const { name, brand, category, description, price, images: _images } = details;
        const productExists = await productController.exists({ name });
        if (productExists) {
            throw new InvalidHttpRequestError('Product with same name already exists.');
        }

        const images: IProductImages[] = [];

        // TODO: add logic to clear image from `/tmp`
        if (_images) {
            if (_images instanceof Array)
                for (const image of _images) {
                    images.push({
                        name: image.originalFilename ?? '',
                        size: image.size,
                        mimetype: image.mimetype ?? '',
                        buffer: await readFile(image.filepath),
                    });
                }
            else {
                images.push({
                    name: _images.originalFilename ?? '',
                    size: _images.size,
                    mimetype: _images.mimetype ?? '',
                    buffer: await readFile(_images.filepath),
                });
            }
        }

        return (await productController.create({ name, brand, category, description, price, images })).toObject();
    }

    public async saveProduct(details: IProductSaveDetails) {
        const { userId, productId } = details;
        const productExists = await productController.exists({ _id: productId });
        if (!productExists) {
            throw new NotFoundHttpRequestError("Product doesn't Exists");
        }

        const isSaved = await savedProductController.exists({ userId, productId });
        if (isSaved) {
            return false;
        }
        await savedProductController.create({ userId, productId });
        return true;
    }

    public async removeProduct(details: IProductSaveDetails) {
        const { userId, productId } = details;
        await savedProductController.deleteOne({ userId, productId });
        return true;
    }

    public async sendProductImage(details: any) {
        return details;
    }
}

const productController = Object.freeze(new ProductController(Product));
export default productController;
