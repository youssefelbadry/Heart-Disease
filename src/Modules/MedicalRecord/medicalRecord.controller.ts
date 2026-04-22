import { Router } from "express";
import medicalRecordService from "./medicalRecord.service";
import { validation } from "../../Middlewares/validation.middlware";

import { authenticate } from "../../Middlewares/authentication.middelware";
import { createMedicalRecordSchema } from "./medicalRecord.validation";
const router: Router = Router();

router.post(
  "/createMedicalRecord",
  authenticate,
  validation(createMedicalRecordSchema),
  medicalRecordService.createMedicalRecord,
);

router.get(
  "/getMedicalRecord/:id",
  // authenticate,
  medicalRecordService.getMedicalRecord,
);

export default router;
