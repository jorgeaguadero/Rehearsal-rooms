import { useState } from "react";
import api from "../services/api";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!current) errors.current = "La contraseña actual es obligatoria";
    if (!next) errors.next = "La nueva contraseña es obligatoria";
    else if (!passwordRegex.test(next))
      errors.next =
        "Debe tener mayúscula, minúscula, número, especial y 8+ caracteres";
    if (!repeat) errors.repeat = "Repite la nueva contraseña";
    else if (next !== repeat) errors.repeat = "Las contraseñas no coinciden";
    return errors;
  };
  const errors = validate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (Object.keys(errors).length > 0) {
      setError("Por favor, corrige los errores en el formulario.");
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
      <h3 className="text-xl font-semibold mb-2 text-black text-center">
        Cambiar contraseña
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-black mb-1 font-semibold">
            Contraseña actual
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-black mb-1 font-semibold">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            onBlur={() => setTouched({ ...touched, next: true })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
            required
          />
          <p className="text-gray-600 text-xs mt-1">
            Debe tener al menos 8 caracteres, mayúscula, minúscula, número y
            carácter especial.
          </p>
          {touched.next && errors.next && (
            <p className="text-red-500 text-sm mt-1">{errors.next}</p>
          )}
        </div>
        <div>
          <label className="block text-black mb-1 font-semibold">
            Repetir nueva contraseña
          </label>
          <input
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            onBlur={() => setTouched({ ...touched, repeat: true })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
            required
          />
          {touched.repeat && errors.repeat && (
            <p className="text-red-500 text-sm mt-1">{errors.repeat}</p>
          )}
        </div>
        {error && (
          <p className="text-red-500 font-semibold text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 font-semibold text-center">{success}</p>
        )}
        <button
          type="submit"
          className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
          disabled={Object.keys(errors).length > 0 || loading}
        >
          {loading ? "Cambiando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
