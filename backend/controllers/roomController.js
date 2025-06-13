import { roomRepository } from "../repositories/index.js";
import path from "path";

export async function getRooms(req, res) {
  try {
    const rooms = await roomRepository.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las salas" });
  }
}

export async function getRoomById(req, res) {
  try {
    const { id } = req.params;
    const room = await roomRepository.getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la sala" });
  }
}

export async function createRoom(req, res) {
  try {
    const { name, description, capacity, price_per_hour } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = path.join("rooms", req.file.filename).replace(/\\/g, "/");
    }
    if (!name || !capacity || !price_per_hour || !image) {
      return res.status(400).json({
        error: "Nombre, capacidad, precio por hora e imagen son obligatorios",
      });
    }
    const id = await roomRepository.createRoom({
      name,
      description,
      capacity,
      price_per_hour,
      image,
    });
    res.status(201).json({ message: "Sala creada con éxito", id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la sala" });
  }
}

export async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const { name, description, capacity, price_per_hour } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = path.join("rooms", req.file.filename).replace(/\\/g, "/");
    }
    if (!name || !capacity || !price_per_hour) {
      return res.status(400).json({
        error: "Nombre, capacidad y precio por hora son obligatorios",
      });
    }
    const updated = await roomRepository.updateRoom(id, {
      name,
      description,
      capacity,
      price_per_hour,
      image,
    });
    if (!updated) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }
    res.json({ message: "Sala actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la sala" });
  }
}

export async function deleteRoom(req, res) {
  try {
    const { id } = req.params;
    const deleted = await roomRepository.deleteRoom(id);

    if (!deleted) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    res.json({ message: "Sala eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la sala" });
  }
}

export async function getRoomAvailability(req, res) {
  try {
    const { id } = req.params;
    const bookings = await roomRepository.getRoomBookings(id);
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener la disponibilidad de la sala" });
  }
}
