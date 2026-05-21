import * as z from "zod";

export const createModelResultSchema = {
  params: z.strictObject({
    id: z.coerce.number().int().positive(),
  }),
  body: z.strictObject({
    patient_id: z.coerce.number().int().positive().optional(),

    medical_record_id: z.coerce.number().int().positive(),

    echo_video_id: z.coerce.number().int().positive().optional(),

    cvd_risk_score: z.number().min(0).max(1).optional(),

    ef_percentage: z.number().min(0).max(100).optional(),

    global_prediction: z.number().min(0).max(1).optional(),

    risk_level: z.string().optional(),

    model_metadata: z.record(z.string(), z.any()).optional(),
  }),
};
