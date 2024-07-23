import { Schema, Types, model } from 'mongoose';

import { DbCollections } from '../../common/constants';

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
            ref: DbCollections.user,
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
            ref: DbCollections.user,
        },
        permissions: {
            type: [String],
            default: [],
            enum: Object.values(Permissions),
        },
    },
    { timestamps: true }
);

export const PermissionModel = model(DbCollections.permissions, PermissionSchema);
