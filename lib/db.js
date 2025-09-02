// lib/db.js
import mysql from "mysql2/promise";
import fs from "fs";

export async function connectDB() {
  const caCert = Buffer.from(process.env.DB_SSL_CA, "base64").toString("utf8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST, // from Aiven
    user: process.env.DB_USER, // from Aiven
    password: process.env.DB_PASS, // from Aiven
    database: process.env.DB_NAME, // from Aiven
    port: process.env.DB_PORT || 3306,
    ssl: {
      ca: caCert, // directly from environment variable
    },
  });

  return connection;
}
