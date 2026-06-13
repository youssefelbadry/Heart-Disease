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
      ef_percentage,
      global_prediction,
      risk_level,
      pulse_pressure
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.patient_id,

        data.medical_record_id,

        data.echo_video_id,

        data.cvd_risk_score,

        data.ef_percentage,

        data.global_prediction,

        data.risk_level,

        data.pulse_pressure,
      ],
    );

    return result.insertId;
  }
  async findByMedicalRecordId(medicalRecordId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE medical_record_id = ?
      ORDER BY created_at DESC
      `,
      [medicalRecordId],
    );

    return rows;
  }

  async findLatestByPatientId(patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [patientId],
    );

    return rows[0];
  }
  async findLatestClinicalResult(patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      AND cvd_risk_score IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
      `,

      [patientId],
    );

    return rows[0] || null;
  }
  async findLatestEFResult(patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      AND ef_percentage IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
      `,

      [patientId],
    );

    return rows[0] || null;
  }
  async findLatestGlobalResult(patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      AND global_prediction IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
      `,

      [patientId],
    );

    return rows[0] || null;
  }
  async findIncompleteResult(patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      AND (
        cvd_risk_score IS NULL
        OR ef_percentage IS NULL
      )
      ORDER BY created_at DESC
      LIMIT 1
      `,

      [patientId],
    );

    return rows[0] || null;
  }

  async update(
    where: { patient_id: number },
    data: Partial<ICreateModelResultDTO>,
  ) {
    const [result]: any = await pool.query(
      `
      UPDATE model_results
      SET ?
      WHERE patient_id = ?
      `,
      [data, where.patient_id],
    );

    return result.affectedRows > 0;
  }
  async updatePublic(where: any, data: any) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(data);

    const whereKey = Object.keys(where)[0];

    const whereValue = where[whereKey as keyof typeof where];

    await pool.query(
      `
    UPDATE model_results
    SET ${fields}
    WHERE ${whereKey} = ?
    `,

      [...values, whereValue],
    );
  }
  async findByPatientId(patientId: number) {
    const [result]: any = await pool.query(
      `
      SELECT *
      FROM model_results
      WHERE patient_id = ?
      `,
      [patientId],
    );

    return result;
  }
}

export default new ModelResultRepository();
