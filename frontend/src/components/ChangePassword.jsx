import { useState } from "react";
import api from "../services/api";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!passwordRegex.test(next)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }
    if (next !== repeat) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/api/auth/updatePassword", {
        currentPassword: current,
        newPassword: next,
      });
      setSuccess("Contraseña cambiada correctamente.");
      setCurrent("");
      setNext("");
      setRepeat("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">Cambiar contraseña</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Contraseña actual</label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f]"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f]"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Repetir nueva contraseña
          </label>
          <input
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f]"
            required
          />
        </div>
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {success && <p className="text-green-600 font-semibold">{success}</p>}
        <button
          type="submit"
          className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
          disabled={loading}
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
