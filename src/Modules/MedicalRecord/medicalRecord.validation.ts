import * as z from "zod";

export const createMedicalRecordSchema = {
  body: z.strictObject({
    patient_id: z
      .number()
      .int()
      .positive("Patient ID must be a positive integer")
      .optional(),
    age: z
      .number()
      .int()
      .min(0, "Age must be positive")
      .max(120, "Invalid age"),

    gender: z
      .enum(["MALE", "FEMALE"], {
        message: "Gender must be MALE or FEMALE",
      })
      .default("MALE"),

    systolic_bp: z.number().optional(),
    diastolic_bp: z.number().optional(),

    blood_pressure: z.string().optional(),
    blood_pressure_category: z.string().optional(),

    estimated_ldl: z.number().optional(),
    total_cholesterol: z.number().optional(),
    hdl: z.number().optional(),

    weight: z.number().optional(),
    height: z.number().optional(),
    bmi: z.number().optional(),

    waist_to_height_ratio: z.number().optional(),
    abdominal_circumference: z.number().optional(),

    physical_activity_level: z.string().optional(),
    family_history_of_cvd: z.boolean().optional(),
    diabetes_status: z.string().optional(),
    smoking_status: z.string().optional(),
    fasting_blood_sugar: z.number().optional(),
  }),

  // params: z.strictObject({
  //   id: z.number().int().positive("Patient ID must be a positive integer"),
  // }),
};
