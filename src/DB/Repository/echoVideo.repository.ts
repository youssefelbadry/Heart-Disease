import pool from "../connection";

export interface CreateEchoVideoDTO {
  patient_id: number;
  view_angle?: string;
  video_format: string;
  file_url: string;
}

class EchoVideoRepository {
  async create(data: CreateEchoVideoDTO): Promise<number> {
    const [result]: any = await pool.query(
      `
      INSERT INTO echo_videos (
        patient_id,
        view_angle,
        video_format,
        file_url
      ) VALUES (?, ?, ?, ?)
      `,
      [
        data.patient_id,
        data.view_angle ?? null,
        data.video_format,
        data.file_url,
      ]
    );

    return result.insertId;
  }

  async findById(videoId: number, patientId: number) {
    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM echo_videos
      WHERE id = ? AND patient_id = ?
      LIMIT 1
      `,
      [videoId, patientId]
    );

    return rows[0] || null;
  }
}

export default new EchoVideoRepository();
