import { Request, Response, NextFunction } from "express";
import logger from "../logger/winston.logger";
import { ApiError } from "../utils/ApiError";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof Error) {
    error = new ApiError(500, err.message, [], err.stack);
  } else {
    error = new ApiError(500, "Something went wrong");
  }

  logger.error(
    "Error message:",
    error.message,
    "Errors:",
    Array.isArray(error.errors) ? error.errors : []
  );

  const responsePayload: Record<string, any> = {
    success: error.success,
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(responsePayload);
};

export { errorHandler };
