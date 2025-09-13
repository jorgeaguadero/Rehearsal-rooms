import pool from "../config/database.js";

export async function getBookingsByUser(userId, isAdmin) {
  let query = isAdmin
    ? `SELECT b.*, u.nombre, u.apellidos, u.username FROM bookings b JOIN users u ON b.user_id = u.id`
    : `SELECT b.*, u.nombre, u.apellidos, u.username FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.user_id = ?`;
  const params = isAdmin ? [] : [userId];
  const [bookings] = await pool.query(query, params);
  return bookings;
}

export async function getBookingById(id, userId, isAdmin) {
  let query = `SELECT b.*, u.nombre, u.apellidos, u.username FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.id = ?`;
  let params = [id];
  if (!isAdmin) {
    query += " AND b.user_id = ?";
    params.push(userId);
  }
  const [bookings] = await pool.query(query, params);
  return bookings[0] || null;
}

export async function checkAvailability(
  roomId,
  startTime,
  endTime,
  excludeBookingId = null
) {
  // Solo hay conflicto si el nuevo tramo se solapa parcialmente con una reserva existente
  // Es decir: start < bEnd && end > bStart
  let query =
    'SELECT * FROM bookings WHERE room_id = ? AND status != "cancelled" AND (start_time < ? AND end_time > ?)';
  let params = [roomId, endTime, startTime];

  if (excludeBookingId) {
    query += " AND id != ?";
    params.push(excludeBookingId);
  }

  const [conflicts] = await pool.query(query, params);
  return conflicts.length === 0;
}

export async function createBooking({ userId, roomId, startTime, endTime }) {
  const [result] = await pool.query(
    "INSERT INTO bookings (user_id, room_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)",
    [userId, roomId, startTime, endTime, "confirmed"]
  );
  return result.insertId;
}

export async function updateBooking(
  id,
  { roomId, startTime, endTime, status },
  userId,
  isAdmin
) {
  let query =
    "UPDATE bookings SET room_id = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?";
  let params = [roomId, startTime, endTime, status || "confirmed", id];

  if (!isAdmin) {
    query += " AND user_id = ?";
    params.push(userId);
  }

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
}

export async function cancelBooking(id, userId, isAdmin) {
  let query = 'UPDATE bookings SET status = "cancelled" WHERE id = ?';
  let params = [id];

  if (!isAdmin) {
    query += " AND user_id = ?";
    params.push(userId);
  }

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
}

export async function roomExists(roomId) {
  const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [
    roomId,
  ]);
  return rooms.length > 0;
}
