import { Schema, model, Types } from 'mongoose';

interface User {
    _id?: string | Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    email: string;
    password: string;
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
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const UserModel = model('users', UserSchema);
