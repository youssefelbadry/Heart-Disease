import * as z from "zod";
import {
  loginSchema,
  signUpSchema,
  forgetPasswordSchema,
  logOutSchema,
  resetPasswordSchema,
} from "./auth.validation";

export type ISignUpDTO = z.infer<typeof signUpSchema.body>;

export type ILoginUpDTO = z.infer<typeof loginSchema.body>;
export type IlogoutDTO = z.infer<typeof logOutSchema.body>;
export type IForgetPasswordDTO = z.infer<typeof forgetPasswordSchema.body>;
export type IResetPasswordDTO = z.infer<typeof resetPasswordSchema.body>;
