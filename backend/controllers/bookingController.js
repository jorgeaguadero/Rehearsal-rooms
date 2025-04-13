import { bookingRepository, roomRepository } from "../repositories/index.js";

export async function getBookings(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";
    const bookings = await bookingRepository.getBookingsByUser(userId, isAdmin);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";
    const booking = await bookingRepository.getBookingById(id, userId, isAdmin);

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
}

export async function createBooking(req, res) {
  try {
    const { room_id, start_time, end_time } = req.body;
    const userId = req.user.id;

    console.log("Creando reserva:", { room_id, start_time, end_time, userId });

    if (!room_id || !start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "ID de sala, hora de inicio y fin son obligatorios" });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (isNaN(startDate) || isNaN(endDate)) {
      console.log("Fechas inválidas:", { start_time, end_time });
      return res.status(400).json({ error: "Formato de fechas inválido" });
    }

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({
          error: "La hora de fin debe ser posterior a la hora de inicio",
        });
    }

    const room = await roomRepository.getRoomById(room_id);
    if (!room) {
      console.log("Sala no encontrada:", { room_id });
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    const isAvailable = await bookingRepository.checkAvailability(
      room_id,
      startDate,
      endDate
    );
    if (!isAvailable) {
      console.log("Conflicto de horario:", { room_id, start_time, end_time });
      return res
        .status(409)
        .json({ error: "La sala no está disponible en ese horario" });
    }

    const id = await bookingRepository.createBooking({
      userId,
      roomId: room_id,
      startTime: startDate,
      endTime: endDate,
    });

    res.status(201).json({ message: "Reserva creada con éxito", id });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res
      .status(500)
      .json({ error: "Error al crear la reserva", details: error.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { room_id, start_time, end_time, status } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    console.log("Actualizando reserva:", {
      id,
      room_id,
      start_time,
      end_time,
      status,
      userId,
      isAdmin,
    });

    if (!room_id || !start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "ID de sala, hora de inicio y fin son obligatorios" });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (isNaN(startDate) || isNaN(endDate)) {
      console.log("Fechas inválidas:", { start_time, end_time });
      return res.status(400).json({ error: "Formato de fechas inválido" });
    }

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({
          error: "La hora de fin debe ser posterior a la hora de inicio",
        });
    }

    const room = await roomRepository.getRoomById(room_id);
    if (!room) {
      console.log("Sala no encontrada:", { room_id });
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    const isAvailable = await bookingRepository.checkAvailability(
      room_id,
      startDate,
      endDate,
      id
    );
    if (!isAvailable) {
      console.log("Conflicto de horario:", { room_id, start_time, end_time });
      return res
        .status(409)
        .json({ error: "La sala no está disponible en ese horario" });
    }

    const updated = await bookingRepository.updateBooking(
      id,
      { roomId: room_id, startTime: startDate, endTime: endDate, status },
      userId,
      isAdmin
    );

    console.log("Resultado de la actualización:", { updated });

    if (!updated) {
      console.log("No se pudo actualizar:", { id, userId, isAdmin });
      return res
        .status(404)
        .json({ error: "Reserva no encontrada o no autorizada" });
    }

    res.json({ message: "Reserva actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    res
      .status(500)
      .json({
        error: "Error al actualizar la reserva",
        details: error.message,
      });
  }
}

export async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    console.log("Cancelando reserva:", { id, userId, isAdmin });

    const cancelled = await bookingRepository.cancelBooking(
      id,
      userId,
      isAdmin
    );
    if (!cancelled) {
      console.log("No se pudo cancelar:", { id, userId, isAdmin });
      return res
        .status(404)
        .json({ error: "Reserva no encontrada o no autorizada" });
    }

    res.json({ message: "Reserva cancelada con éxito" });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    res.status(500).json({ error: "Error al cancelar la reserva" });
  }
}
