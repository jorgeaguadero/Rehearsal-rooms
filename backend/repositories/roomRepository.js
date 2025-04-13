import pool from "../config/database.js";

export async function getAllRooms() {
  const [rooms] = await pool.query("SELECT * FROM rooms");
  return rooms;
}

export async function getRoomById(id) {
  const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);
  return rooms[0] || null;
}

export async function createRoom({
  name,
  description,
  capacity,
  price_per_hour,
}) {
  const [result] = await pool.query(
    "INSERT INTO rooms (name, description, capacity, price_per_hour) VALUES (?, ?, ?, ?)",
    [name, description || null, capacity, price_per_hour]
  );
  return result.insertId;
}

export async function updateRoom(
  id,
  { name, description, capacity, price_per_hour }
) {
  const [result] = await pool.query(
    "UPDATE rooms SET name = ?, description = ?, capacity = ?, price_per_hour = ? WHERE id = ?",
    [name, description || null, capacity, price_per_hour, id]
  );
  return result.affectedRows > 0;
}

export async function deleteRoom(id) {
  const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
