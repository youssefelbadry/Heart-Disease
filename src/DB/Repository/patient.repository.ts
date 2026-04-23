import pool from "../connection";

class PatientRepository {
  async findById(id: number) {
    const [rows]: any = await pool.query(
      "SELECT * FROM patients WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string) {
    const [rows]: any = await pool.query(
      "SELECT * FROM patients WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  }

  async findUnverified(email: string) {
    const [rows]: any = await pool.query(
      `SELECT * FROM patients
       WHERE email = ?
       AND is_email_verified = FALSE
       LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  async create(data: any) {
    const [result]: any = await pool.query(
      "INSERT INTO patients SET ?",
      data
    );
    return result.insertId;
  }

  async updateById(id: number, data: any) {
    await pool.query(
      "UPDATE patients SET ? WHERE id = ?",
      [data, id]
    );
  }
}

export default new PatientRepository();
