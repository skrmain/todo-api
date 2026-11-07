# todo-api

## Ref

- https://hub.docker.com/r/skrmain/todo-api

## Notes

```sh
docker build -t todo-api .

docker run --rm --name todo-api -p 8000:8000 todo-api
```

## Todo API

Todos are stored in memory and reset when the server restarts. Each todo has an
integer `id`, a non-empty `title`, and a boolean `completed` value.

- `GET /todos` lists todos as `{ "todos": [...] }`.
- `POST /todos` creates a todo from `{ "title": "...", "completed": false }`
  and returns `{ "todo": ... }`.
- `GET /todos/:id` reads a todo.
- `PUT /todos/:id` replaces a todo; `PATCH /todos/:id` updates supplied fields.
- `DELETE /todos/:id` deletes a todo.

Single-todo reads and updates return `{ "todo": ... }`. Invalid todo input
returns `400`, missing todos return `404`, and deletion returns `204`.
