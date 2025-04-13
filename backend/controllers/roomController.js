import { roomRepository } from "../repositories/index.js";

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

    if (!name || !capacity || !price_per_hour) {
      return res
        .status(400)
        .json({
          error: "Nombre, capacidad y precio por hora son obligatorios",
        });
    }

    const id = await roomRepository.createRoom({
      name,
      description,
      capacity,
      price_per_hour,
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

    if (!name || !capacity || !price_per_hour) {
      return res
        .status(400)
        .json({
          error: "Nombre, capacidad y precio por hora son obligatorios",
        });
    }

    const updated = await roomRepository.updateRoom(id, {
      name,
      description,
      capacity,
      price_per_hour,
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
