"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
class EchoVideoRepository {
    async create(data) {
        const [result] = await connection_1.default.query(`
      INSERT INTO echo_videos (
        patient_id,
        view_angle,
        video_format,
        file_url
      ) VALUES (?, ?, ?, ?)
      `, [
            data.patient_id,
            data.view_angle ?? null,
            data.video_format,
            data.file_url,
        ]);
        return result.insertId;
    }
    async findById(videoId, patientId) {
        const [rows] = await connection_1.default.query(`
      SELECT *
      FROM echo_videos
      WHERE id = ? AND patient_id = ?
      LIMIT 1
      `, [videoId, patientId]);
        return rows[0] || null;
    }
}
exports.default = new EchoVideoRepository();
