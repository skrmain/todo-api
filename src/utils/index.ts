import { Response } from "express";

import { APIResponse } from "../types";

export const sendSuccessResponse = (
  res: Response,
  responseData: APIResponse
) => {
  const {
    data,
    status = "success",
    statusCode = 200,
    message = "Success",
  } = responseData;

  return res.status(statusCode).send({ status, message, data });
};

export const sendFailResponse = (res: Response, responseData: APIResponse) => {
  const {
    error,
    errors,
    status = "fail",
    statusCode = 400,
    message = "Fail",
  } = responseData;

  return res.status(statusCode).send({ status, message, error, errors });
};
