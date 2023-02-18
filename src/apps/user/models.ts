import { Schema, model } from 'mongoose';

import { dbCollections, EMAIL_REGEX } from '../../shared/constants';

interface IUser {
    name: string;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
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
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const User = model(dbCollections.user, UserSchema);
