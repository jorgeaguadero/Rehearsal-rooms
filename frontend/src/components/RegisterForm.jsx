import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { checkUsernameAvailability } from "../services/api";
import countryData from "../assets/countryData";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [prefix, setPrefix] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const filteredCountries = countryData.filter(
    (c) =>
      c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
      c.dial_code.includes(countryQuery)
  );

  // Reglas de contraseña
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

  // Comprobación en tiempo real de username
  async function handleUsernameChange(e) {
    const value = e.target.value;
    setUsername(value);
    setUsernameAvailable(null);
    if (value.trim().length > 2) {
      setCheckingUsername(true);
      try {
        const available = await checkUsernameAvailability(value);
        setUsernameAvailable(available);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }
  }

  const validate = () => {
    const errors = {};
    if (!nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!apellidos.trim()) errors.apellidos = "Los apellidos son obligatorios";
    if (!phoneNumber.trim()) errors.phoneNumber = "El número es obligatorio";
    else if (!/^\d{9}$/.test(phoneNumber))
      errors.phoneNumber = "El número debe tener 9 cifras";
    if (!username.trim())
      errors.username = "El nombre de usuario es obligatorio";
    if (!email.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      errors.email = "Email inválido";
    if (!password) errors.password = "La contraseña es obligatoria";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        password
      )
    )
      errors.password =
        "Debe tener mayúscula, minúscula, número, especial y 8+ caracteres";
    if (!repeatPassword) errors.repeatPassword = "Repite la contraseña";
    else if (password !== repeatPassword)
      errors.repeatPassword = "Las contraseñas no coinciden";
    return errors;
  };
  const errors = validate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      email,
      password,
      nombre,
      apellidos,
      telefono: prefix + phoneNumber,
      role: "user",
    };
    try {
      await api.post("/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
    }
  };

  const getFlagUrl = (flag) =>
    flag.startsWith("/flags/") ? `http://localhost:3000${flag}` : flag;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7fafc] pt-24 pb-8 px-2">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrarse
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-black mb-2 font-semibold"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched({ ...touched, nombre: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            {touched.nombre && errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="apellidos"
              className="block text-black mb-2 font-semibold"
            >
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              onBlur={() => setTouched({ ...touched, apellidos: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            {touched.apellidos && errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
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
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
              onBlur={() => setTouched({ ...touched, phoneNumber: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              placeholder="Número"
              required
              maxLength={9}
              style={{ fontSize: 18, color: "#000" }}
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
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
              onChange={handleUsernameChange}
              onBlur={() => setTouched({ ...touched, username: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            {checkingUsername && (
              <span className="text-gray-500 text-xs ml-2">Comprobando...</span>
            )}
            {username && username.length > 2 && usernameAvailable === true && (
              <span className="text-green-600 text-xs ml-2">Disponible ✓</span>
            )}
            {username && username.length > 2 && usernameAvailable === false && (
              <span className="text-red-500 text-xs ml-2">No disponible ✗</span>
            )}
            {touched.username && errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
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
              onBlur={() => setTouched({ ...touched, email: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              onBlur={() => setTouched({ ...touched, password: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            <ul className="text-xs mt-2 mb-1">
              {passwordRules.map((rule, i) => (
                <li
                  key={i}
                  className={
                    rule.test(password)
                      ? "text-green-600 line-through"
                      : "text-gray-500"
                  }
                >
                  {rule.label}
                </li>
              ))}
            </ul>
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="repeatPassword"
              className="block text-black mb-2 font-semibold"
            >
              Repite la contraseña
            </label>
            <input
              type="password"
              id="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, repeatPassword: true })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            {touched.repeatPassword && errors.repeatPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.repeatPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
            disabled={Object.keys(errors).length > 0}
          >
            Registrarse
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-black">¿Ya tienes cuenta? </span>
          <a
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
