# ExpressJS-TodoAPI

## Notes

- Environment Variables - refer - [src/config/index.js](src/config/index.js)
- API List with Payload - refer - [api.rest](./api.rest)

- Commands

```sh
docker images
docker run -p 8000:8000 -e NAME=ExpressJS-TodoAPI skrmain/expressjs-todo-api:latest
docker-compose up -d

# - Commands to Build Docker Images and Push to DockerHub
docker build -t skrmain/expressjs-todo-api .
docker tag skrmain/expressjs-todo-api:latest skrmain/expressjs-todo-api:VERSION

docker login -u USERNAME
docker push skrmain/expressjs-todo-api:latest
docker push skrmain/expressjs-todo-api:VERSION
```

## Changelog

- 0.3
  - REFACTOR:
    - Make consistent Import and Export Syntax
    - Add `DocComment` in Util and Middleware, for editor auto complete
    - Define DB Operation in respective `controller` file only
    - Remove Unused and Extra Files
  - CHORE: Updated `prettier`, `editorconfig` Configurations
  - FIX:
    - Restrict (Update & Delete) operation on `todo` can be performed by only `user` Created that.
    - Consistent and Proper Error Handling, Proper Response Status Code
    - Make consistent Response Structure
  - FEAT:
    - remove `auth` from auth routes
    - add `password` Encryption on registration
    - make `delete` status to `archive` for todo
  - DOCS:
    - Add `api.rest` - With Payloads, All Routes, Headers
- 0.2
  - todo, user, auth app
- 0.1
  - todo app without authentication
