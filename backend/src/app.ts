import express, { type Application } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morganMiddleware from "./logger/morgan.logger";
import { errorHandler } from "./middlewares/error.middlewares";

const app: Application = express();

app.use(morganMiddleware);
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(cookieparser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

import healthCheckRouter from "./routes/healthcheck.routes";
import userRouter from "./routes/user.routes";

app.use("/api/v1/task-manager/healthCheck", healthCheckRouter);
app.use("/api/v1/task-manager/users", userRouter);

export default app;
