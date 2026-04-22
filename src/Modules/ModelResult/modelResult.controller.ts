import { Router } from "express";
import { validation } from "../../Middlewares/validation.middlware";
import modelResultService from "./modelResult.service";
import { createModelResultSchema } from "./modelResult.validation";
import { authenticate } from "../../Middlewares/authentication.middelware";

const router = Router();

// AI ONLY
router.post(
  "/createModelResult",
  authenticate,
  validation(createModelResultSchema),
  modelResultService.createModelResult,
);

// User / Doctor
router.get(
  "/getByMedicalRecord/:id",
  authenticate,
  modelResultService.getByMedicalRecord,
);

export default router;
