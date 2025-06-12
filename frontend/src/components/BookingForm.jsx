import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function BookingForm({ room, booking, onSuccess, onError }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(
    booking ? booking.start_time?.slice(0, 10) : ""
  );
  const [startHour, setStartHour] = useState(
    booking ? new Date(booking.start_time).getHours() : 10
  );
  const [numHours, setNumHours] = useState(
    booking
      ? new Date(booking.end_time).getHours() -
          new Date(booking.start_time).getHours()
      : 1
  );
  const [error, setError] = useState("");
  const [busySlots, setBusySlots] = useState([]);

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;
      try {
        const res = await api.get(`/api/rooms/${room.id}/availability`);
        // Filtrar solo reservas del día seleccionado
        const selectedDay = new Date(date).toISOString().split("T")[0];
        let busy = res.data.filter((b) => b.start_time.startsWith(selectedDay));
        // Si estamos editando, excluir la propia reserva
        if (booking && booking.id) {
          busy = busy.filter((b) => b.id !== booking.id);
        }
        setBusySlots(busy);
      } catch {
        setBusySlots([]);
      }
    }
    fetchAvailability();
  }, [date, room.id, booking]);

  useEffect(() => {
    if (booking) {
      setDate(booking.start_time?.slice(0, 10));
      setStartHour(new Date(booking.start_time).getHours());
      setNumHours(
        new Date(booking.end_time).getHours() -
          new Date(booking.start_time).getHours()
      );
    }
  }, [booking]);

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
    if (!user) {
      navigate("/login");
      return;
    }
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
      if (booking && booking.id) {
        await api.put(`/api/bookings/${booking.id}`, payload);
      } else {
        await api.post("/api/bookings", payload);
      }
      setError("");
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        (booking ? "Error al editar la reserva" : "Error al crear la reserva");
      setError(errorMsg);
      if (errorMsg.includes("no está disponible")) {
        alert(
          "La sala no está disponible en ese horario. Por favor, elige otro tramo."
        );
      }
      if (onError) onError(errorMsg);
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
      <h2 className="text-2xl font-semibold text-black mb-4 text-center">
        {booking ? "Editar reserva" : `Reservar ${room.name}`}
      </h2>
      <p className="text-gray-600 mb-4 text-center">{room.description}</p>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="date" className="block text-black mb-2 font-semibold">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="startHour"
            className="block text-black mb-2 font-semibold"
          >
            Hora de entrada
          </label>
          <select
            id="startHour"
            value={startHour}
            onChange={(e) => {
              setStartHour(Number(e.target.value));
              setNumHours(1);
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black"
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
          <label
            htmlFor="numHours"
            className="block text-black mb-2 font-semibold"
          >
            Número de horas
          </label>
          <select
            id="numHours"
            value={numHours}
            onChange={(e) => setNumHours(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black"
          >
            {availableNumHours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        {isTramoOcupado() && (
          <p className="text-red-500 mb-2 font-semibold text-center">
            Este tramo está ocupado. Elige otro horario.
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
          disabled={isTramoOcupado()}
        >
          {booking ? "Guardar cambios" : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
