import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { validationResult } from "express-validator";

import { User as UserModal } from "./modals";
import { LoginModel, MyRequest, MyResponse, RegisterModel } from "../../types";
import { JWT_SECRET } from "../../constants";
import { sendFailResponse, sendSuccessResponse } from "../../utils";

export const RegisterController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { name, email, password } = req.body as RegisterModel;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Registration Failed" });
    }

    const isEmailRegistered = (await UserModal.find({ email })).length > 0;

    if (isEmailRegistered) {
      throw new Error("Email Already Registered");
    }

    const registeredUser: any = (
      await UserModal.create({ name, email, password })
    ).toJSON();

    delete registeredUser.__v;
    delete registeredUser.createdAt;
    delete registeredUser.updatedAt;
    delete registeredUser.password;

    sendSuccessResponse(res, {
      message: "Registration successful",
      data: { user: registeredUser },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Registration Failed",
    });
  }
};

export const LoginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Login Failed" });
    }

    const { email, password } = req.body as LoginModel;

    const userData = await UserModal.findOne(
      { email, password },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );

    if (!userData) {
      throw new Error("Invalid Login Credentials");
    }

    const token = sign(userData.toObject(), JWT_SECRET);
    sendSuccessResponse(res, {
      message: "Login Successful",
      data: { user: userData, token },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Login Failed",
    });
  }
};

export const UserDetailController = async (req: MyRequest, res: MyResponse) => {
  try {
    sendSuccessResponse(res, {
      data: { user: req.user },
      message: "User Detail",
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Try Login Again",
    });
  }
};
