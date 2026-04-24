import mysql from "mysql2/promise";

let pool: mysql.Pool;

if (!(global as any)._mysqlPool) {
  (global as any)._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS || process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  });
}

pool = (global as any)._mysqlPool;

if (!(global as any)._mysqlTested) {
  (global as any)._mysqlTested = true;

  (async () => {
    try {
      await pool.execute("SELECT 1");
      console.log("✅ MySQL connected successfully");
    } catch (error: any) {
      console.error("❌ MySQL connection failed:", error.message);
    }
  })();
}

export default pool;
