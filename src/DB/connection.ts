// import mysql from "mysql2/promise";

// const connection = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "root",
//   database: process.env.DB_NAME || "heart_disease_db",
//   connectionLimit: 10,
// });

// // ✅ Test connection immediately
// (async () => {
//   try {
//     await connection.execute('SELECT 1');
//     console.log("✅ MySQL connected successfully");
//   } catch (error) {
//     console.error("❌ MySQL connection failed:", error);
//     process.exit(1);
//   }
// })();

// export default connection;
import mysql from "mysql2/promise";

// ✅ نعمل Pool واحد بس (مهم لـ Vercel)
let pool: mysql.Pool;

if (!(global as any)._mysqlPool) {
  (global as any)._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "heart_disease_db",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
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
