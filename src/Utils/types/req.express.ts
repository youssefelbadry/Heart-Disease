import { JwtPayload } from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    decoded?: JwtPayload;
    uploadedFilePath?: string;
  }
}
