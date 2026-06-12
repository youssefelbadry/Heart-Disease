import * as z from "zod";

export const createMedicalRecordSchema = {
  body: z.strictObject({
    patient_id: z
      .number()
      .int()
      .positive("Patient ID must be a positive integer")
      .optional(),

    male: z.number().min(0).max(1, "male must be 0 or 1"),

    age: z
      .number()
      .int()
      .min(0, "Age must be positive")
      .max(120, "Invalid age"),

    currentSmoker: z.number().min(0).max(1).optional(),

    BPMeds: z.number().min(0).max(1).optional(),

    prevalentHyp: z.number().min(0).max(1).optional(),

    diabetes: z.number().min(0).max(1).optional(),

    sysBP: z.number().optional(),

    diaBP: z.number().optional(),

    pulse_pressure: z.number().optional(),
  }),
};
