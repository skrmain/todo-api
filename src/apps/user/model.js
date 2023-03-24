const { Schema, model } = require('mongoose');
const { ModelNames } = require('../../shared/constants');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            maxlength: 200,
        },
    },
    { timestamps: true }
);

module.exports = model(ModelNames.user, UserSchema);
