import { useState } from "react";
import api from "../services/api";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const passwordRules = [
  {
    label: "Al menos 8 caracteres",
    test: (pw) => pw.length >= 8,
  },
  {
    label: "Una mayúscula",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    label: "Una minúscula",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    label: "Un número",
    test: (pw) => /\d/.test(pw),
  },
  {
    label: "Un carácter especial",
    test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
  },
];

function ChangePassword({ onSuccess, onCancel }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setTouched({});
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrent("");
    setNext("");
    setRepeat("");
    setTouched({});
    setError("");
    setSuccess("");
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2 text-black text-center">
        Cambiar contraseña
      </h3>
      {!showSuccessModal && (
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
            <ul className="text-xs mt-2 mb-1">
              {passwordRules.map((rule, i) => (
                <li
                  key={i}
                  className={
                    rule.test(next)
                      ? "text-green-600 line-through"
                      : "text-gray-500"
                  }
                >
                  {rule.label}
                </li>
              ))}
            </ul>
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
            <p className="text-green-600 font-semibold text-center">
              {success}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
              disabled={Object.keys(errors).length > 0 || loading}
            >
              {loading ? "Cambiando..." : "Guardar contraseña"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 font-semibold shadow-md transition"
              onClick={() => {
                resetForm();
                if (onCancel) onCancel();
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-black">
              Contraseña cambiada
            </h3>
            <p className="text-black mb-4">
              Tu contraseña se ha cambiado correctamente.
            </p>
            <button
              className="bg-[#68df9f] text-white px-4 py-2 rounded-md font-semibold shadow-md transition"
              onClick={() => {
                setShowSuccessModal(false);
                resetForm();
                if (onSuccess) onSuccess();
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
