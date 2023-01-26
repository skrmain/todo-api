# ExpressJS-StoreAPI

## Notes

```sh
docker compose up -d mongo
npm run start:dev
```

## APIs

| **auth** | **method:path - detail**                                      |
| :------: | :------------------------------------------------------------ |
|          | **apps/auth**                                                 |
|    N     | `POST:/login`                                                 |
|    N     | `POST:/register`                                              |
|    N     | `PUT:/forgot-password` TODO:                                  |
|    N     | `PUT:/set-password/:token` TODO:                              |
|    N     | `PUT:/activate-account/:activationToken` TODO:                |
|          | **apps/user**                                                 |
|    Y     | `GET:/me`                                                     |
|    Y     | `PATCH:/me` - To update detail TODO:                          |
|    Y     | `DELETE:/me` - To delete accounts TODO:                       |
|          | **apps/product**                                              |
|    N     | `GET:/products`                                               |
|    N     | `GET:/products/:productId`                                    |
|    Y     | `POST:/products`                                              |
|    Y     | `PATCH:/products` TODO:                                       |
|    Y     | `DELETE:/products` TODO:                                      |
|    Y     | `PUT:/products/:productId/save` TODO:                         |
|    Y     | `DELETE:/products/:productId/save` TODO:                      |
|          | **apps/cart**                                                 |
|    Y     | `GET:/cart` - get product from cart                           |
|    Y     | `POST:/cart` - create cart                                    |
|    Y     | `PUT:/cart` - add product to cart                             |
|    Y     | `DELETE:/cart/products/:productId` - remove product from cart |
|    Y     | `POST:/cart/checkout` - to order product of cart TODO:        |
|    Y     | `DELETE:/cart/` - delete(empty) cart                          |
|          | **apps/order**                                                |
|    Y     | `GET:/order` - to get orders TODO:                            |
|    Y     | `GET:/order/:orderId` - to get a order detail TODO:           |
|          | **apps/saved**                                                |
|    Y     | `GET:/saved` - to get saved products TODO:                    |
