import pool from "../config/database.js";
import { hash } from "bcryptjs";

export async function createUser({ username, email, password, role }) {
  const hashedPassword = await hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, role || "user"]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return users[0] || null;
}
