import { Router } from "express";
import modelResultService from "./modelResult.service";
import { authenticate } from "../../Middlewares/authentication.middelware";

const router = Router();

router.get(
  "/getByPatient",
  authenticate,
  modelResultService.getByResultByPatient,
);

export default router;
