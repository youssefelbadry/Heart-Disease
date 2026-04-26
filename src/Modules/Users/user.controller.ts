import { Router } from "express";
import userService from "./user.service";
import { authenticate } from "../../Middlewares/authentication.middelware";

const router: Router = Router();

router.get("/profile", authenticate, userService.getUserData);

export default router;
