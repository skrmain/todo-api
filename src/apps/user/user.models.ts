import { Schema, model } from 'mongoose';

import { dbCollections, EMAIL_REGEX, UserStatus } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';

interface IUser extends IBaseModel {
    name: string;
    email: string;
    password: string;
    status: string;
    isEmailVerified: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: EMAIL_REGEX,
        },
        status: {
            type: String,
            emum: Object.values(UserStatus),
            default: UserStatus.pending,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const UserModel = model(dbCollections.user, UserSchema);
