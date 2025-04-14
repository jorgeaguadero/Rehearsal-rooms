import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">Aquí verás tus reservas.</p>
      </div>
    </div>
  );
}

export default Dashboard;
