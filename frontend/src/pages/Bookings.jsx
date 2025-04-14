import Navbar from "../components/Navbar";

function Bookings() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
        <p className="mt-4 text-gray-600">Gestiona tus reservas de salas.</p>
      </div>
    </div>
  );
}

export default Bookings;
