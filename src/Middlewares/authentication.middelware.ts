// src/middlewares/authentication.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Utils/Security/token";
import {
  BadRequestException,
  UnauthorizedException,
} from "../Utils/Responsive/error.res";
import patientRepository from "../DB/Repository/patient.repository";
import { JwtPayload } from "jsonwebtoken";
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throw new BadRequestException("Missing token");
  }

  const [bearer, token] = auth.split(" ");

  if (!token || bearer !== "Bearer") {
    throw new BadRequestException("Invalid token format");
  }

  try {
    const decoded = verifyToken(token) as JwtPayload & { id: number };

    req.user = decoded;

    const patient = await patientRepository.findById(decoded.id);
    if (!patient) {
      throw new UnauthorizedException("User not found");
    }

    // ✔ logout logic (invalidate old tokens)
    if (patient.logged_out_at && decoded.iat) {
      const tokenIssuedAt = decoded.iat * 1000;
      const logoutAt = new Date(patient.logged_out_at).getTime();

      if (tokenIssuedAt < logoutAt) {
        throw new UnauthorizedException(
          "You are logged out, please login again",
        );
      }
    }

    next();
  } catch (err: any) {
    console.log("Auth Error:", err?.message);

    if (err instanceof UnauthorizedException) {
      throw err;
    }

    if (err.name === "TokenExpiredError") {
      throw new UnauthorizedException("Token expired");
    }

    throw new UnauthorizedException("Invalid token");
  }
};
