// src/middlewares/authentication.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Utils/Security/token";
import {
  BadRequestException,
  UnauthorizedException,
} from "../Utils/Responsive/error.res";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth) throw new BadRequestException("Missing token");

  const [Beerar, token] = auth.split(" ");
  if (!token || Beerar !== "Bearer")
    throw new BadRequestException("Invalid token");

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedException("Invalid token");
  }
};
