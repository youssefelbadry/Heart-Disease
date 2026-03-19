import * as z from "zod";
import {
  createMedicalRecordSchema,
} from "./medicalRecord.validation";

export type ICreateMedicalRecordDTO = z.infer<typeof createMedicalRecordSchema.body>;

