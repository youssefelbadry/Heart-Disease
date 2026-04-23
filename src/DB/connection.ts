import mysql from "mysql2/promise";

let pool: mysql.Pool;

if (!(global as any)._mysqlPool) {
  (global as any)._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || "db48896.public.databaseasp.net",
    user: process.env.DB_USER || "db48896",
    password: process.env.DB_PASS || process.env.DB_PASSWORD || "123456shahd",
    database: process.env.DB_NAME || "db48896",
    port: Number(process.env.DB_PORT) || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,

    ssl: {
      rejectUnauthorized: false,
    },
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
