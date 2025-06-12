import { Link } from "react-router-dom";
import principalCover from "../assets/principalCover.webp";

function Home() {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${principalCover})`,
        filter: "grayscale(60%)",
      }}
    >
      <section className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg text-center">
          BIENVENIDO A <span className="text-[#68df9f]">REHEARSAL ROOMS</span>
        </h1>
        <Link
          to="/rooms"
          className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Ver Salas
        </Link>
      </section>
    </main>
  );
}

export default Home;
