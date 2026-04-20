import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./Modules/Auth/auth.controller";
import medicalRecordRouter from "./Modules/MedicalRecord/medicalRecord.controller";
import echoVideoRouter from "./Modules/EchoVideos/echoVideos.controller";
import { globalErrorHandling } from "./Utils/Responsive/error.res";
import { config } from "dotenv";
import path from "node:path";
import modelResultRouter from "./Modules/ModelResult/modelResult.controller";

const bootstrab = () => {
  const app = express();
  config({ path: path.resolve("./config/.env.dev") });

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
    }),
  );

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/medical", medicalRecordRouter);
  app.use("/api/v1/echo", echoVideoRouter);
  app.use("/api/v1/result", modelResultRouter);

  app.use("{/dummy}", (_req: Request, res: Response) => {
    res.status(404).json({ message: "Not found endpoint" });
  });

  app.use(globalErrorHandling);

  return app;
};

export default bootstrab;
