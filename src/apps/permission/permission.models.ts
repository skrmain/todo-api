import { Schema, Types, model } from 'mongoose';
import { UserModel } from '../user/user.models';

export enum Permissions {
    read = 'read',
    write = 'write',
    delete = 'delete',
    share = 'share',
}

const PermissionSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: UserModel.modelName,
        },
        entity: {
            type: String,
            required: true,
        },
        entityId: {
            type: Types.ObjectId,
            required: true,
        },
        lastUpdatedBy: {
            type: Types.ObjectId,
            required: true,
            ref: UserModel.modelName,
        },
        permissions: {
            type: [String],
            default: [],
            enum: Object.values(Permissions),
        },
    },
    { timestamps: true }
);

export const PermissionModel = model('permissions', PermissionSchema);
