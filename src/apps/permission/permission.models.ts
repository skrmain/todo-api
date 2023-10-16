import { Schema, Types, model } from 'mongoose';

import { dbCollections } from '../../shared/constants';

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
            ref: dbCollections.user,
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
            ref: dbCollections.user,
        },
        permissions: {
            type: [String],
            default: [],
            enum: Object.values(Permissions),
        },
    },
    { timestamps: true }
);

export const PermissionModel = model(dbCollections.permissions, PermissionSchema);
