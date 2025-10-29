import type { Request, Response } from "express";
import logger from "../logger/winston.logger";
import { ApiResponse } from "../utils/ApiResponse";

export const healthcheck = (req: Request, res: Response) => {
  logger.info("Health check passed");
  return res.status(200).json(new ApiResponse(200, {}, "Health check passed"));
};
