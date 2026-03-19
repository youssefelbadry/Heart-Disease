import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import * as z from "zod";
import { BadRequestException } from "../Utils/Responsive/error.res";

type keyReqType = keyof Request;
type SchemaType = Partial<Record<keyReqType, ZodTypeAny>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validtaionErrors: Array<{
      key: keyReqType;
      issues: Array<{ message: string; path: (string | number | symbol)[] }>;
    }> = [];

    for (const key of Object.keys(schema) as keyReqType[]) {
      const zodSchema = schema[key];
      if (!zodSchema) continue;

      const validationResults = zodSchema.safeParse(req[key]);
      if (!validationResults.success) {
        const errors = validationResults.error as ZodError;
        validtaionErrors.push({
          key,
          issues: errors.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        });
      }
    }

    if (validtaionErrors.length > 0) {
      throw new BadRequestException("Validation Error", {
        cause: validtaionErrors,
      });
    }

    return next();
  };
};

export const generaFeild = {
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be at most 30 characters" }),

  email: z
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),

  confirmPassword: z.string(),

  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
};
