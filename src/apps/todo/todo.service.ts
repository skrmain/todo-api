import permissionService from '../permission/permission.service';
import { Permissions } from '../permission/permission.models';
import { findTodoById, insertTodo, removeTodoById, todoExistsById, updateTodoById } from './todo.repository';

type TodoListInput = {
    userId?: string;
    pageNumber: number;
    pageSize: number;
    sortOrder: string;
    sortBy: string;
    status?: string;
    title?: string;
};

type TodoCreateInput = {
    title: string;
    detail?: string;
};

class TodoService {
    async create(details: TodoCreateInput, userId?: string) {
        const todo = await insertTodo({ ...details, userId });
        await permissionService.create({
            userId,
            entity: 'todo',
            entityId: todo._id,
            lastUpdatedBy: userId,
            permissions: [...Object.values(Permissions)],
        });
        return todo;
    }

    async getUserTodos({ userId, pageNumber, pageSize, status, title }: TodoListInput) {
        const filter: Record<string, unknown> = {};
        if (status) {
            filter['todoId.status'] = status;
        }
        if (title) {
            filter['todoId.title'] = { $regex: new RegExp(title, 'i') };
        }

        const { todos, total } = await permissionService.findUserTodos({
            userId,
            filter,
            pageNumber,
            pageSize,
        });

        return {
            todos: todos.map((todo) => this.parseUserTodo(todo)),
            total,
        };
    }

    async getOne(id: string, userId?: string) {
        const todo = await findTodoById(id, '-userId');
        const todoPermissions = await permissionService.getOne({ entityId: id, userId });
        return this.parseUserTodo({ todoId: todo, permissions: todoPermissions?.permissions });
    }

    async update(id: string, changes: Record<string, unknown>) {
        return updateTodoById(id, changes);
    }

    async delete(id: string) {
        await removeTodoById(id);
        await permissionService.deleteMany({ entityId: id });
    }

    exists(id: string) {
        return todoExistsById(id);
    }

    parseUserTodo(todo: any) {
        return {
            _id: todo.todoId?._id,
            title: todo.todoId?.title,
            detail: todo.todoId?.detail,
            status: todo.todoId?.status,
            createdAt: todo.todoId?.createdAt,
            updateAt: todo.todoId?.updatedAt,
            permissions: todo.permissions,
        };
    }
}

export default new TodoService();
