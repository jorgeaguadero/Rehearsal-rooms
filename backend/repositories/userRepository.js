import pool from "../config/database.js";
import { hash } from "bcryptjs";

export async function createUser({
  username,
  email,
  password,
  nombre,
  apellidos,
  telefono,
  role,
}) {
  const hashedPassword = await hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, nombre, apellidos, telefono, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      email,
      hashedPassword,
      nombre,
      apellidos,
      telefono,
      role || "user",
    ]
  );
  return result.insertId;
}

export async function getAllUsers() {
  const [users] = await pool.query(
    "SELECT id, username, email, nombre, apellidos, telefono, role, created_at FROM users ORDER BY id"
  );
  return users;
}

export async function findUserByEmail(email) {
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return users[0] || null;
}

export async function findUserByUsername(username) {
  const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return users[0] || null;
}

export async function findUserByTelefono(telefono) {
  const [users] = await pool.query("SELECT * FROM users WHERE telefono = ?", [
    telefono,
  ]);
  return users[0] || null;
}

export async function findUserById(id) {
  const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return users[0] || null;
}

export async function updateUserProfile(id, { username, telefono }) {
  const [result] = await pool.query(
    "UPDATE users SET username = ?, telefono = ? WHERE id = ?",
    [username, telefono, id]
  );
  return result.affectedRows > 0;
}

export async function updateUserById(
  id,
  { username, email, nombre, apellidos, telefono, role }
) {
  const [result] = await pool.query(
    `UPDATE users SET username = ?, email = ?, nombre = ?, apellidos = ?, telefono = ?, role = ? WHERE id = ?`,
    [username, email, nombre, apellidos, telefono, role, id]
  );
  return result.affectedRows > 0;
}

export async function updateUserPassword(id, hashedPassword) {
  const [result] = await pool.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id]
  );
  return result.affectedRows > 0;
}
