import { useState } from "react";
import api from "../services/api";

function BookingForm({ room, onSuccess, onError }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        room_id: room.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      };
      await api.post("/api/bookings", payload);
      setError("");
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error al crear la reserva";
      setError(errorMsg);
      onError(errorMsg);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Reservar {room.name}
      </h2>
      <p className="text-gray-600 mb-4">{room.description}</p>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-gray-700 mb-2">
            Fecha y hora de inicio
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endTime" className="block text-gray-700 mb-2">
            Fecha y hora de fin
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
