import { config } from "dotenv";
import path from "node:path";
import mysql from "mysql2/promise";

config({ path: path.resolve("./config/.env.dev") });

const mysqlUrl = process.env.MYSQL_PUBLIC_URL;

if (!mysqlUrl) {
  throw new Error("MYSQL_PUBLIC_URL is missing in config/.env.dev");
}

let pool: mysql.Pool;

if (!(global as any)._mysqlPool) {
  (global as any)._mysqlPool = mysql.createPool({
    uri: mysqlUrl,
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
// import { config } from "dotenv";
// import path from "node:path";
// import mysql from "mysql2/promise";

// config({
//   path: path.resolve("./config/.env.dev"),
// });

// let pool: mysql.Pool;

// if (!(global as any)._mysqlPool) {
//   (global as any)._mysqlPool = mysql.createPool({
//     host: process.env.DB_HOST || "localhost",

//     user: process.env.DB_USER || "root",

//     password: process.env.DB_PASS || "",

//     database: process.env.DB_NAME || "heart_disease",

//     port: Number(process.env.DB_PORT) || 3306,

//     waitForConnections: true,

//     connectionLimit: 10,

//     queueLimit: 0,

//     connectTimeout: 10000,
//   });
// }

// pool = (global as any)._mysqlPool;

// // =========================
// // Test Connection
// // =========================

// if (!(global as any)._mysqlTested) {
//   (global as any)._mysqlTested = true;

//   (async () => {
//     try {
//       await pool.execute("SELECT 1");

//       console.log("✅ Local MySQL connected successfully");
//     } catch (error: any) {
//       console.error("❌ Local MySQL failed:", error.message);
//     }
//   })();
// }

// export default pool;
