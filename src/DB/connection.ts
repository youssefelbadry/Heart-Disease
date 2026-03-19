import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "heart_disease_db",
  connectionLimit: 10,
});

// ✅ Test connection immediately
(async () => {
  try {
    await connection.execute('SELECT 1');
    console.log("✅ MySQL connected successfully");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    process.exit(1);
  }
})();

export default connection;
