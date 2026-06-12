import { ICreateMedicalRecordDTO } from "../../Modules/MedicalRecord/medicalRecord.dto";
import pool from "../connection";

export interface CreateMedicalRecordDTO {
  patient_id: number;

  male: number;
  age: number;

  currentSmoker?: number;
  BPMeds?: number;
  prevalentHyp?: number;
  diabetes?: number;

  sysBP?: number;
  diaBP?: number;
  pulse_pressure?: number;
}

class MedicalRecordRepository {
  async create(data: ICreateMedicalRecordDTO): Promise<number> {
    const [result]: any = await pool.query(
      `
  INSERT INTO medical_records (
    patient_id,
    male,
    age,
    currentSmoker,
    BPMeds,
    prevalentHyp,
    diabetes,
    sysBP,
    diaBP,
    pulse_pressure 
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        data.patient_id,

        data.male,

        data.age,

        data.currentSmoker ?? 0,

        data.BPMeds ?? 0,

        data.prevalentHyp ?? 0,

        data.diabetes ?? 0,

        data.sysBP ?? null,

        data.diaBP ?? null,

        data.pulse_pressure ??
          (data.sysBP && data.diaBP ? data.sysBP - data.diaBP : null),
      ],
    );

    return result.insertId;
  }

  async findByPatientId(patientId: number) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM medical_records
      WHERE patient_id = ?
      ORDER BY created_at DESC
      `,
      [patientId],
    );

    return rows;
  }

  async findById(recordId: number, patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM medical_records
      WHERE id = ? AND patient_id = ?
      LIMIT 1
      `,
      [recordId, patientId],
    );

    return rows[0] || null;
  }

  async findLatestByPatientId(patientId: number) {
    const [rows]: any = await pool.query(
      `
    SELECT *
    FROM medical_records
    WHERE patient_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
      [patientId],
    );

    return rows[0] || null;
  }
}

export default new MedicalRecordRepository();
