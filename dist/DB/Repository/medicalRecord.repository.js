"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
class MedicalRecordRepository {
    async create(data) {
        const [result] = await connection_1.default.query(`
      INSERT INTO medical_records (
        patient_id,
        age,
        gender,
        systolic_bp,
        diastolic_bp,
        blood_pressure,
        blood_pressure_category,
        estimated_ldl,
        total_cholesterol,
        hdl,
        weight,
        height,
        bmi,
        waist_to_height_ratio,
        abdominal_circumference,
        physical_activity_level,
        family_history_of_cvd,
        diabetes_status,
        smoking_status,
        fasting_blood_sugar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            data.patient_id,
            data.age,
            data.gender,
            data.systolic_bp ?? null,
            data.diastolic_bp ?? null,
            data.blood_pressure ?? null,
            data.blood_pressure_category ?? null,
            data.estimated_ldl ?? null,
            data.total_cholesterol ?? null,
            data.hdl ?? null,
            data.weight ?? null,
            data.height ?? null,
            data.bmi ?? null,
            data.waist_to_height_ratio ?? null,
            data.abdominal_circumference ?? null,
            data.physical_activity_level ?? null,
            data.family_history_of_cvd ?? null,
            data.diabetes_status ?? null,
            data.smoking_status ?? null,
            data.fasting_blood_sugar ?? null,
        ]);
        return result.insertId;
    }
    async findByPatientId(patientId) {
        const [rows] = await connection_1.default.query(`
      SELECT *
      FROM medical_records
      WHERE patient_id = ?
      ORDER BY created_at DESC
      `, [patientId]);
        return rows;
    }
    async findById(recordId, patientId) {
        const [rows] = await connection_1.default.query(`
      SELECT *
      FROM medical_records
      WHERE id = ? AND patient_id = ?
      LIMIT 1
      `, [recordId, patientId]);
        return rows[0] || null;
    }
}
exports.default = new MedicalRecordRepository();
