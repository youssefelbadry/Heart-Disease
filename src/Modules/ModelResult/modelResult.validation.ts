import * as z from "zod";

export const createModelResultSchema = {
  body: z.strictObject({
    patient_id: z.coerce.number().int().positive().optional(),
    medical_record_id: z.coerce.number().int().positive(),
    echo_video_id: z.coerce.number().int().positive(),

    cvd_risk_score: z.number().min(0).max(1),
    heart_failure_chance: z.number().min(0).max(1),

    model_metadata: z.record(z.string(), z.any()).optional(),
  }),
};
