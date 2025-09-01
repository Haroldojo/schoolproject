// lib/db.js
import mysql from "mysql2/promise";

export async function connectDB() {
  const connection = await mysql.createConnection({
    host: "localhost", // your MySQL host
    user: "root", // your MySQL username
    password: "Parul1234@", // your MySQL password
    database: "random", // database you created
  });
  return connection;
}
