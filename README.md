# ExpressJS-TodoAPI

## Notes

- https://hub.docker.com/r/skrmain/expressjs-todo-api

```sh
# Commands to Build Docker Images and Push to DockerHub
docker login -u USERNAME
bash build_and_push.sh
```

## APIs

| **auth** | **method:path**        |
| :------: | :--------------------- |
|          | **apps/auth**          |
|    N     | `POST:/login`          |
|    N     | `POST:/register`       |
|          | **apps/user**          |
|    Y     | `POST:/user`           |
|          | **apps/todo**          |
|    Y     | `POST:/todo`           |
|    Y     | `GET:/todo`            |
|    Y     | `GET:/todo/:todoId`    |
|    Y     | `PATCH:/todo/:todoId`  |
|    Y     | `DELETE:/todo/:todoId` |

## [Changelog](./changelog.md)
