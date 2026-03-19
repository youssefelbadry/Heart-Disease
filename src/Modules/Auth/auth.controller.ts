import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/validation.middlware";
import {
  signUpSchema,
  loginSchema,
  confirmEmailSchema,
  requestOtpSchema,
} from "./auth.validation";
import { authenticate } from "../../Middlewares/authentication.middelware";

const router = Router();

router.post("/signup", validation(signUpSchema), authService.signup);
router.post("/confirmEmail", validation(confirmEmailSchema), authService.confirmEmail);
router.post(
  "/requestOtp",
  validation(requestOtpSchema),
  authService.requestConfirmEmail
);
router.post("/login", validation(loginSchema), authService.login);
router.post(
  "/logout",
  authenticate,
  authService.logout
);

export default router;
 