"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
class ModelResultRepository {
    async create(data) {
        const [result] = await connection_1.default.query(`
      INSERT INTO model_results (
        patient_id,
        medical_record_id,
        echo_video_id,
        cvd_risk_score,
        heart_failure_chance,
        model_metadata
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `, [
            data.patient_id,
            data.medical_record_id,
            data.echo_video_id,
            data.cvd_risk_score,
            data.heart_failure_chance,
            data.model_metadata
                ? JSON.stringify(data.model_metadata)
                : null,
        ]);
        return result.insertId;
    }
    async findByMedicalRecordId(medicalRecordId) {
        const [rows] = await connection_1.default.query(`
      SELECT *
      FROM model_results
      WHERE medical_record_id = ?
      ORDER BY created_at DESC
      `, [medicalRecordId]);
        return rows;
    }
}
exports.default = new ModelResultRepository();
