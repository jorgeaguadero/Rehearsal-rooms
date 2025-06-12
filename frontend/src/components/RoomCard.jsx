import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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
  const imageUrl = room.image ? `${backendUrl}/${room.image}` : logo;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-full">
      <img
        src={imageUrl}
        alt={room.name}
        className="w-full h-40 rounded mb-2"
        style={{ objectFit: "cover", background: "#fff" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = logo;
          e.target.style.objectFit = "contain";
          e.target.style.background = "#fff";
        }}
      />
      <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
      <p className="text-gray-600">{room.description}</p>
      <p className="text-gray-600">Capacidad: {room.capacity}</p>
      <p className="text-gray-600">Precio por hora: {room.price_per_hour} €</p>
      <button
        onClick={handleReserve}
        className="mt-4 w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
      >
        Reservar
      </button>
    </div>
  );
}

export default RoomCard;
