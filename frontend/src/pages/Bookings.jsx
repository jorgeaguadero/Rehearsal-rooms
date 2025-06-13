import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import Modal from "../components/Modal";

function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const roomId = params.get("roomId");
  const [room, setRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [editBooking, setEditBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (roomId && !user) {
      navigate("/login");
      return;
    }
    if (roomId) {
      api.get(`/api/rooms/${roomId}`).then((res) => {
        setRoom(res.data);
        setShowForm(true);
      });
    }
  }, [roomId, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/bookings");
        setBookings(res.data);
      } catch {
        setError("Error al cargar reservas");
      }
    };
    fetchBookings();
  }, [user]);

  useEffect(() => {
    api.get("/api/rooms").then((res) => setRooms(res.data));
  }, []);

  useEffect(() => {
    if (!roomId && showForm && !editBooking) setShowForm(false);
  }, [location.pathname, roomId, showForm, editBooking]);

  const now = new Date();
  const filteredBookings = bookings
    .filter((b) => b.status !== "cancelled")
    .filter((b) => {
      const end = new Date(b.end_time || b.end_date);
      return showHistory ? end < now : end >= now;
    });

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (!user)
    return (
      <div className="text-center mt-10">
        Inicia sesión para ver tus reservas.
      </div>
    );

  if (showForm && room) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f7fafc]">
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <BookingForm
            room={room}
            booking={editBooking}
            onSuccess={() => {
              setShowForm(false);
              setEditBooking(null);
              setShowSuccessModal(true);
              api.get("/api/bookings").then((res) => setBookings(res.data));
            }}
            onError={() => {}}
          />
          <button
            className="mt-4 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 font-semibold shadow-md transition max-w-xs w-full"
            style={{ maxWidth: 220 }}
            onClick={() => {
              setShowForm(false);
              setEditBooking(null);
              navigate("/bookings");
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="pt-20 pb-24 min-h-screen bg-[#f7fafc]">
      <div className="container mx-auto p-2 sm:p-6">
        <div className="max-w-5xl mx-auto mt-4 sm:mt-10 p-2 sm:p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-black mb-4 text-center">
            Reservas
          </h1>
          {isAdmin && (
            <button
              className={`mb-4 px-4 py-2 rounded font-semibold shadow-md transition text-white bg-[#68df9f] hover:bg-[#56df9e]`}
              onClick={() => setShowHistory((h) => !h)}
            >
              {showHistory
                ? "Ver reservas futuras"
                : "Ver historial de reservas"}
            </button>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#68df9f] text-white">
                  <th className="p-2 text-black min-w-[120px]">Sala</th>
                  {isAdmin ? (
                    <th className="p-2 text-black min-w-[120px]">Usuario</th>
                  ) : null}
                  <th className="p-2 text-black min-w-[110px]">Fecha</th>
                  <th className="p-2 text-black min-w-[100px]">Entrada</th>
                  <th className="p-2 text-black min-w-[100px]">Salida</th>
                  <th className="p-2 text-black min-w-[110px]">Precio total</th>
                  {!showHistory ? (
                    <th className="p-2 text-black min-w-[130px]">Acciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((b) => {
                  const start = new Date(b.start_time || b.start_date);
                  const end = new Date(b.end_time || b.end_date);
                  const sala = rooms.find((r) => r.id === b.room_id) || {
                    id: b.room_id,
                    name: b.room_id,
                    price_per_hour: 0,
                  };
                  const horas = (end - start) / (1000 * 60 * 60);
                  const precio = sala.price_per_hour
                    ? horas * sala.price_per_hour
                    : 0;
                  return (
                    <tr key={b.id} className="border-b">
                      <td className="p-2 text-black min-w-[120px]">
                        {sala.name}
                      </td>
                      {isAdmin && (
                        <td className="p-2 text-black min-w-[120px]">
                          {b.username}
                        </td>
                      )}
                      <td className="p-2 text-black min-w-[110px]">
                        {start.toLocaleDateString()}
                      </td>
                      <td className="p-2 text-black min-w-[100px]">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-2 text-black min-w-[100px]">
                        {end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-2 text-black min-w-[110px]">
                        {precio.toFixed(2)} €
                      </td>
                      {!showHistory && (
                        <td className="p-2 text-black min-w-[130px]">
                          <div className="flex gap-2">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-semibold shadow-md transition"
                              onClick={() => {
                                setRoom(sala);
                                setShowForm(true);
                                setEditBooking(b);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold shadow-md transition"
                              onClick={() => {
                                setShowCancelModal(true);
                                setCancelTarget(b.id);
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-black font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-black font-semibold">
              Página {page} de {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-black font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center mt-4 text-black">No hay reservas.</div>
          )}
        </div>
      </div>
      <Modal
        open={showSuccessModal}
        title="Reserva confirmada"
        onClose={() => setShowSuccessModal(false)}
      >
        <p className="text-black text-center">
          Tu reserva ha sido confirmada correctamente.
        </p>
      </Modal>
      <Modal
        open={showCancelModal}
        title="Cancelar reserva"
        onClose={() => setShowCancelModal(false)}
        hideCloseButton
      >
        <p className="text-black mb-4">
          ¿Seguro que quieres cancelar esta reserva?
        </p>
        <div className="flex gap-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold shadow-md transition w-full"
            onClick={async () => {
              if (cancelTarget) {
                try {
                  await api.delete(`/api/bookings/${cancelTarget}`);
                  setBookings((prev) =>
                    prev.filter((bk) => bk.id !== cancelTarget)
                  );
                } catch {
                  setError("No se pudo cancelar la reserva");
                }
              }
              setShowCancelModal(false);
              setCancelTarget(null);
            }}
          >
            Sí, cancelar
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md font-semibold shadow-md transition w-full"
            onClick={() => {
              setShowCancelModal(false);
              setCancelTarget(null);
            }}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Bookings;
