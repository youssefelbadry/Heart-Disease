import * as z from "zod";
import { generaFeild } from "../../Middlewares/validation.middlware";

export const loginSchema = {
  body: z.strictObject({
    email: generaFeild.email,
    password: generaFeild.password,
  }),
};

export const signUpSchema = {
  body: loginSchema.body
    .extend({
      name: generaFeild.name,
      confirmPassword: generaFeild.confirmPassword,
      // gender: generaFeild.string().refine((value) => value === "MALE" || value === "FEMALE", {
      //   message: "Gender must be MALE or FEMALE",
      // }),
      // phone: generaFeild.phone,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }

      if (data.name.split(" ").length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Name must be 2 words",
        });
      }
    }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: generaFeild.email,
    otp: generaFeild.otp,
  }),
};

export const requestOtpSchema = {
  body: z.strictObject({
    email: generaFeild.email,
  }),
};
