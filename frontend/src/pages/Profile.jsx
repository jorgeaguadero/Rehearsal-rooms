import { useContext, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import ChangePassword from "../components/ChangePassword";
import api from "../services/api";
import countryData from "../assets/countryData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const { user, login } = useContext(UserContext);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [countryQuery, setCountryQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();

  // Al cargar el perfil, separar el prefijo y el número igual que en Users.jsx
  const found = countryData.find((c) => user.telefono?.startsWith(c.dial_code));
  const initialPrefix = found ? found.dial_code : "+34";
  const initialPhoneNumber = user.telefono?.replace(initialPrefix, "") || "";
  const [prefix, setPrefix] = useState(initialPrefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const filteredCountries = countryData.filter(
    (c) =>
      c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
      c.dial_code.includes(countryQuery)
  );

  const getCountryByPrefix = (prefix) =>
    countryData.find((c) => c.dial_code === prefix) || countryData[0];

  const getFlagUrl = (flag) =>
    flag.startsWith("/flags/") ? `http://localhost:3000${flag}` : flag;

  if (!user)
    return <div className="text-center mt-10">No has iniciado sesión.</div>;

  const handleEdit = () => {
    setEditMode(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setUsername(user.username || "");
    setPrefix(initialPrefix);
    setPhoneNumber(initialPhoneNumber);
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const errors = {};
    if (!username.trim())
      errors.username = "El nombre de usuario es obligatorio";
    if (!phoneNumber.trim()) errors.phoneNumber = "El número es obligatorio";
    else if (!/^\d{9}$/.test(phoneNumber))
      errors.phoneNumber = "El número debe tener 9 cifras";
    return errors;
  };
  const errors = validate();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/api/users/profile", {
        username,
        telefono: prefix + phoneNumber,
      });
      // Actualizar contexto global
      login({ ...user, username, telefono: prefix + phoneNumber });
      setSuccess("Perfil actualizado correctamente");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7fafc]">
      <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-4 text-center flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faUser} /> Mi Perfil
        </h2>
        <div className="mb-6">
          <p>
            <span className="font-semibold text-black">Nombre:</span>{" "}
            <span className="text-black">
              {user.nombre} {user.apellidos}
            </span>
          </p>
          <p>
            <span className="font-semibold text-black">Usuario:</span>{" "}
            <span className="text-black">{user.username}</span>
          </p>
          <p>
            <span className="font-semibold text-black">Email:</span>{" "}
            <span className="text-black">{user.email}</span>
          </p>
          {!editMode && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black">Teléfono:</span>
              <img
                src={getFlagUrl(getCountryByPrefix(prefix).flag)}
                alt="flag"
                style={{ width: 24, height: 16, objectFit: "cover" }}
              />
              <span className="text-black">
                {prefix} {phoneNumber}
              </span>
            </div>
          )}
        </div>
        {editMode && (
          <form onSubmit={handleSave} className="mt-4">
            <div className="mb-4">
              <label className="block text-black mb-2 font-semibold">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black"
                required
              />
            </div>
            <div className="mb-4 flex items-center gap-2 relative">
              <label
                htmlFor="prefix"
                className="block text-black mb-2 font-semibold"
              >
                Teléfono
              </label>
              <div style={{ position: "relative", minWidth: 120 }}>
                <div
                  className="flex items-center border rounded-md bg-white text-black cursor-text p-2"
                  style={{ minWidth: 120 }}
                  onClick={() => {
                    setShowDropdown(true);
                    inputRef.current && inputRef.current.focus();
                  }}
                >
                  <img
                    src={getFlagUrl(
                      filteredCountries.find((c) => c.dial_code === prefix)
                        ?.flag || "/flags/ES.png"
                    )}
                    alt="flag"
                    style={{
                      width: 24,
                      height: 16,
                      marginRight: 6,
                      objectFit: "cover",
                    }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={countryQuery || prefix}
                    onChange={(e) => {
                      setCountryQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="bg-white text-black border-none outline-none w-24"
                    style={{ fontSize: 18 }}
                    placeholder="Prefijo"
                  />
                </div>
                {showDropdown && (
                  <ul
                    className="absolute z-10 bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto w-full"
                    style={{ minWidth: 120 }}
                  >
                    {filteredCountries.map((c) => (
                      <li
                        key={c.code}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-[#e6f7ef] cursor-pointer"
                        onMouseDown={() => {
                          setPrefix(c.dial_code);
                          setCountryQuery("");
                          setShowDropdown(false);
                        }}
                      >
                        <img
                          src={getFlagUrl(c.flag)}
                          alt={c.code}
                          style={{
                            width: 24,
                            height: 16,
                            objectFit: "cover",
                          }}
                        />
                        <span className="text-black">
                          {c.name} ({c.dial_code})
                        </span>
                      </li>
                    ))}
                    {filteredCountries.length === 0 && (
                      <li className="px-2 py-1 text-gray-500">
                        No hay resultados
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                onBlur={() => setTouched({ ...touched, phoneNumber: true })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black"
                placeholder="Número"
                required
                maxLength={9}
                style={{ fontSize: 18, color: "#000" }}
              />
            </div>
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
            {success && (
              <p className="text-green-600 font-semibold mb-2">{success}</p>
            )}
            {error && (
              <p className="text-red-500 font-semibold mb-2">{error}</p>
            )}
            <div className="flex gap-2 mb-4">
              <button
                type="submit"
                className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 font-semibold shadow-md transition"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {!editMode && (
          <button
            type="button"
            className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 font-semibold shadow-md transition mb-4 flex items-center justify-center gap-2"
            onClick={handleEdit}
          >
            <FontAwesomeIcon icon={faEdit} /> Editar perfil
          </button>
        )}
        {!showChangePassword ? (
          <button
            className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition mb-2"
            onClick={() => setShowChangePassword(true)}
          >
            Cambiar contraseña
          </button>
        ) : (
          <div>
            <ChangePassword
              onSuccess={() => setShowChangePassword(false)}
              onCancel={() => setShowChangePassword(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
