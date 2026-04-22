"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalRecordSchema = void 0;
const z = __importStar(require("zod"));
exports.createMedicalRecordSchema = {
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
};
