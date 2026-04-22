"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
let pool;
if (!global._mysqlPool) {
    global._mysqlPool = promise_1.default.createPool({
        host: process.env.DB_HOST || "db48896.public.databaseasp.net",
        user: process.env.DB_USER || "db48896",
        password: process.env.DB_PASS || process.env.DB_PASSWORD || "123456shahd",
        database: process.env.DB_NAME || "db48896",
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000,
    });
}
pool = global._mysqlPool;
if (!global._mysqlTested) {
    global._mysqlTested = true;
    (async () => {
        try {
            await pool.execute("SELECT 1");
            console.log("✅ MySQL connected successfully");
        }
        catch (error) {
            console.error("❌ MySQL connection failed:", error.message);
        }
    })();
}
exports.default = pool;
