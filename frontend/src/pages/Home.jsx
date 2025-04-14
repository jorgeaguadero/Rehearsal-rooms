import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido a Rehearsal Rooms
        </h1>
        <p className="mt-4 text-gray-600">
          Reserva salas de ensayo de forma fácil y rápida.
        </p>
        <Link
          to="/rooms"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Ver Salas
        </Link>
      </div>
    </div>
  );
}

export default Home;
