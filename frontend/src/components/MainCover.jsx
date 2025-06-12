import { Link } from "react-router-dom";
import principalCover from "../assets/principalCover.webp";

function MainCover() {
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center pt-20 pb-20"
      style={{
        backgroundImage: `url(${principalCover})`,
        minHeight: "100vh",
      }}
    >
      <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-10 text-center">
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
    </main>
  );
}

export default MainCover;
