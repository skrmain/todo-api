import { Schema, model, Types } from 'mongoose';

import { DbCollections, EMAIL_REGEX, UserStatus } from '../../common/constants';

interface User {
    _id?: string | Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    email: string;
    password: string;
    status: string;
    isEmailVerified: boolean;
}

const UserSchema = new Schema<User>(
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

export const UserModel = model(DbCollections.user, UserSchema);
