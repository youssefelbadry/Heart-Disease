import pool from "../connection";
import { ICreateModelResultDTO } from "../../Modules/ModelResult/modelResult.dto";

class ModelResultRepository {
  async create(data: ICreateModelResultDTO): Promise<number> {
    const [result]: any = await pool.query(
      `
      INSERT INTO model_results (
        patient_id,
        medical_record_id,
        echo_video_id,
        cvd_risk_score,
        heart_failure_chance,
        model_metadata
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.patient_id,
        data.medical_record_id,
        data.echo_video_id,
        data.cvd_risk_score,
        data.heart_failure_chance,
        data.model_metadata
          ? JSON.stringify(data.model_metadata)
          : null,
      ]
    );

    return result.insertId;
  }

  async findByMedicalRecordId(medicalRecordId: number) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE medical_record_id = ?
      ORDER BY created_at DESC
      `,
      [medicalRecordId]
    );

    return rows;
  }
}

export default new ModelResultRepository();
