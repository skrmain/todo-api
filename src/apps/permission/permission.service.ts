import { InvalidHttpRequestError } from '../../common/custom-errors';
import permissionRepository from './permission.repository';

class PermissionService {
    getOne(...args: Parameters<typeof permissionRepository.getOne>) {
        return permissionRepository.getOne(...args);
    }

    exists(...args: Parameters<typeof permissionRepository.exists>) {
        return permissionRepository.exists(...args);
    }

    create(...args: Parameters<typeof permissionRepository.create>) {
        return permissionRepository.create(...args);
    }

    updateOne(...args: Parameters<typeof permissionRepository.updateOne>) {
        return permissionRepository.updateOne(...args);
    }

    deleteOne(...args: Parameters<typeof permissionRepository.deleteOne>) {
        return permissionRepository.deleteOne(...args);
    }

    deleteMany(...args: Parameters<typeof permissionRepository.deleteMany>) {
        return permissionRepository.deleteMany(...args);
    }

    findUserTodos(...args: Parameters<typeof permissionRepository.findUserTodos>) {
        return permissionRepository.findUserTodos(...args);
    }

    async grantTodoAccess({
        todoId,
        userId,
        updatedBy,
        permissions,
    }: {
        todoId: string;
        userId: string;
        updatedBy?: string;
        permissions: string[];
    }) {
        if (updatedBy?.toString() === userId.toString()) {
            throw new InvalidHttpRequestError('Invalid Operation');
        }

        const existingPermission = await this.getOne({ entityId: todoId, userId });
        if (existingPermission) {
            await this.updateOne(
                { _id: existingPermission._id },
                { $set: { permissions: [...permissions] } },
            );
            return;
        }

        await this.create({
            entityId: todoId,
            entity: 'todo',
            userId,
            lastUpdatedBy: updatedBy,
            permissions: [...permissions],
        });
    }

    revokeTodoAccess(todoId: string, userId: string) {
        return this.deleteOne({ entityId: todoId, userId });
    }
}

export default new PermissionService();
