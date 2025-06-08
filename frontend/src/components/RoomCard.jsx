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

  // Construir la URL absoluta para la imagen
  const backendUrl = "http://localhost:3000";
  const imageUrl = room.image ? `${backendUrl}/${room.image}` : "/vite.svg";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={imageUrl}
        alt={room.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
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
