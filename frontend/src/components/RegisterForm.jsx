import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, email, password, role: "user" };
    console.log("Enviando registro:", payload);
    try {
      const response = await api.post("/api/auth/register", payload);
      console.log("Respuesta:", response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrarse</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-black mb-2 font-semibold"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-black mb-2 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-black mb-2 font-semibold"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
