import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();

  const handleReserve = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/bookings?roomId=${room.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
      <p className="text-gray-600">{room.description}</p>
      <p className="text-gray-600">Capacidad: {room.capacity}</p>
      <p className="text-gray-600">Precio por hora: ${room.price_per_hour}</p>
      <button
        onClick={handleReserve}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Reservar
      </button>
    </div>
  );
}

export default RoomCard;
