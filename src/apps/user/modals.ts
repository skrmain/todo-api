import { Schema, model } from "mongoose";

import { EMAIL_REGEX } from "../../constants";

const UserSchema = new Schema(
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

export const User = model("User", UserSchema);
