"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
class BlockTokenRepository {
    async create(data) {
        const [result] = await connection_1.default.query(`
      INSERT INTO block_tokens (
        token,
        expires_at
      ) VALUES (?, ?)
      `, [data.token, data.expires_at]);
        return result.insertId;
    }
    async findByToken(token) {
        const [rows] = await connection_1.default.query(`
      SELECT *
      FROM block_tokens
      WHERE token = ?
        AND expires_at > NOW()
      LIMIT 1
      `, [token]);
        return rows[0] || null;
    }
}
exports.default = new BlockTokenRepository();
