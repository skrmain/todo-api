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
|    Y     | `POST:/token/refresh` TODO:                                   |
|          | **apps/user**                                                 |
|    Y     | `GET:/me`                                                     |
|    Y     | `PATCH:/me` - To update detail                                |
|    Y     | `DELETE:/me` - To delete accounts TODO:                       |
|          | **apps/product**                                              |
|    N     | `GET:/products`                                               |
|    N     | `GET:/products/:productId`                                    |
|   Y(A)   | `POST:/products`                                              |
|   Y(A)   | `PATCH:/products` TODO:                                       |
|   Y(A)   | `DELETE:/products` TODO:                                      |
|    Y     | `PUT:/products/:productId/save`                               |
|    Y     | `DELETE:/products/:productId/save`                            |
|          | **apps/cart**                                                 |
|    Y     | `GET:/cart` - get product from cart                           |
|    Y     | `POST:/cart` - create cart                                    |
|    Y     | `PUT:/cart` - add product to cart                             |
|    Y     | `DELETE:/cart/products/:productId` - remove product from cart |
|    Y     | `POST:/cart/checkout` - to order product of cart              |
|    Y     | `DELETE:/cart/` - delete(empty) cart                          |
|          | **apps/order**                                                |
|    Y     | `GET:/order` - to get orders                                  |
|    Y     | `GET:/order/:orderId` - to get a order detail                 |
|          | **apps/saved**                                                |
|    Y     | `GET:/saved` - to get saved products                          |
