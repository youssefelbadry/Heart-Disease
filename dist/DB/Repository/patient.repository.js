"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
class PatientRepository {
    async findByEmail(email) {
        const [rows] = await connection_1.default.query("SELECT * FROM patients WHERE email = ? LIMIT 1", [email]);
        return rows[0] || null;
    }
    async findUnverified(email) {
        const [rows] = await connection_1.default.query(`SELECT * FROM patients
       WHERE email = ?
       AND is_email_verified = FALSE
       LIMIT 1`, [email]);
        return rows[0] || null;
    }
    async create(data) {
        const [result] = await connection_1.default.query("INSERT INTO patients SET ?", data);
        return result.insertId;
    }
    async updateById(id, data) {
        await connection_1.default.query("UPDATE patients SET ? WHERE id = ?", [data, id]);
    }
}
exports.default = new PatientRepository();
