import { useState, useEffect } from "react";
import api from "../services/api";

function BookingForm({ room, onError }) {
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(10);
  const [numHours, setNumHours] = useState(1);
  const [error, setError] = useState("");
  const [busySlots, setBusySlots] = useState([]);

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;
      try {
        const res = await api.get(`/api/rooms/${room.id}/availability`);
        // Filtrar solo reservas del día seleccionado
        const selectedDay = new Date(date).toISOString().split("T")[0];
        const busy = res.data.filter((b) =>
          b.start_time.startsWith(selectedDay)
        );
        setBusySlots(busy);
      } catch {
        setBusySlots([]);
      }
    }
    fetchAvailability();
  }, [date, room.id]);

  const maxHour = 22;
  const availableStartHours = Array.from(
    { length: maxHour - 10 },
    (_, i) => 10 + i
  );
  const maxNumHours = date && startHour ? maxHour - startHour : 1;
  const availableNumHours = Array.from(
    { length: maxNumHours },
    (_, i) => i + 1
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(
        `${date}T${String(startHour).padStart(2, "0")}:00:00`
      );
      const endDate = new Date(startDate.getTime() + numHours * 60 * 60 * 1000);
      const payload = {
        room_id: room.id,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      };
      await api.post("/api/bookings", payload);
      setError("");
      // Redirigir al dashboard tras reservar
      window.location.href = "/dashboard";
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error al crear la reserva";
      setError(errorMsg);
      if (errorMsg.includes("no está disponible")) {
        alert(
          "La sala no está disponible en ese horario. Por favor, elige otro tramo."
        );
      }
      onError(errorMsg);
    }
  };

  // Calcula si el tramo seleccionado está ocupado
  const isTramoOcupado = () => {
    if (!date) return false;
    const start = new Date(
      `${date}T${String(startHour).padStart(2, "0")}:00:00`
    ).getTime();
    const end = new Date(start + numHours * 60 * 60 * 1000).getTime();
    return busySlots.some((b) => {
      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();
      return start < bEnd && end > bStart;
    });
  };

  const isHourBusy = (hour) => {
    if (!date) return false;
    const start = new Date(
      `${date}T${String(hour).padStart(2, "0")}:00:00`
    ).getTime();
    const end = new Date(start + numHours * 60 * 60 * 1000).getTime();
    return busySlots.some((b) => {
      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();
      return start < bEnd && end > bStart;
    });
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
          <label htmlFor="date" className="block text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startHour" className="block text-gray-700 mb-2">
            Hora de entrada
          </label>
          <select
            id="startHour"
            value={startHour}
            onChange={(e) => {
              setStartHour(Number(e.target.value));
              setNumHours(1);
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableStartHours.map((h) => (
              <option
                key={h}
                value={h}
                style={
                  isHourBusy(h) ? { color: "red", fontWeight: "bold" } : {}
                }
                disabled={isHourBusy(h)}
              >
                {h}:00 {isHourBusy(h) ? "(Ocupado)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="numHours" className="block text-gray-700 mb-2">
            Número de horas
          </label>
          <select
            id="numHours"
            value={numHours}
            onChange={(e) => setNumHours(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableNumHours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        {isTramoOcupado() && (
          <p className="text-red-500 mb-2 font-semibold">
            Este tramo está ocupado. Elige otro horario.
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={isTramoOcupado()}
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
