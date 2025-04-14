import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido a Rehearsal Rooms
        </h1>
        <p className="mt-4 text-gray-600">
          Reserva salas de ensayo de forma fácil y rápida.
        </p>
      </div>
    </div>
  );
}

export default Home;
