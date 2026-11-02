import { Schema, Types, model } from 'mongoose';
import { UserModel } from '../user/user.models.js';

export enum Permissions {
    read = 'read',
    write = 'write',
    delete = 'delete',
    share = 'share',
}

export interface Permission {
    userId: Types.ObjectId | string;
    entity: string;
    entityId: Types.ObjectId | string;
    lastUpdatedBy: Types.ObjectId | string;
    permissions: Permissions[];
}

const PermissionSchema = new Schema<Permission>(
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
