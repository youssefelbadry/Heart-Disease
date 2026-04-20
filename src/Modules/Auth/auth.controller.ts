import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/validation.middlware";
import {
  signUpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { authenticate } from "../../Middlewares/authentication.middelware";

const router = Router();

router.post("/signup", validation(signUpSchema), authService.signup);
router.post(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  authService.forgetPassword,
);
router.patch(
  "/resetPassword",
  authenticate,
  validation(resetPasswordSchema),
  authService.resetPassword,
);
router.post("/login", validation(loginSchema), authService.login);
router.post("/logout", authenticate, authService.logout);

export default router;
