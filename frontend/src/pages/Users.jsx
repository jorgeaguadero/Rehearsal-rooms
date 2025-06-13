import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import Modal from "../components/Modal";
import countryData from "../assets/countryData";

function Users() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [editTouched, setEditTouched] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const inputRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [, setPasswordSuccess] = useState("");
  // Reglas de validación de contraseña
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
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users");
        setUsers(res.data);
      } catch {
        setError("Error al cargar usuarios");
      }
    };
    fetchUsers();
  }, [user]);

  if (!user || user.role !== "admin")
    return (
      <div className="text-center mt-10">
        Solo el administrador puede ver los usuarios.
      </div>
    );

  // Filtros y paginación
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.apellidos || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Edición de usuario
  const handleEditClick = (u) => {
    // Buscar el prefijo en la lista de países (por ejemplo, +34, +43, etc.)
    const found = countryData.find((c) => u.telefono?.startsWith(c.dial_code));
    const prefix = found ? found.dial_code : "+34";
    // Extraer el número quitando el prefijo detectado
    const phoneNumber = u.telefono?.replace(prefix, "") || "";
    setEditUser(u);
    setEditData({
      ...u,
      prefix,
      phoneNumber,
    });
    setEditTouched({});
    setEditError("");
    setSuccess("");
    setCountryQuery("");
    setShowDropdown(false);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const filteredCountries = countryData.filter(
    (c) =>
      c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
      c.dial_code.includes(countryQuery)
  );
  const getFlagUrl = (flag) =>
    flag?.startsWith("/flags/") ? `http://localhost:3000${flag}` : flag;

  const validate = () => {
    const errors = {};
    if (!editData.nombre?.trim()) errors.nombre = "El nombre es obligatorio";
    if (!editData.apellidos?.trim())
      errors.apellidos = "Los apellidos son obligatorios";
    if (!editData.phoneNumber?.trim())
      errors.phoneNumber = "El número es obligatorio";
    else if (!/^\d{9}$/.test(editData.phoneNumber))
      errors.phoneNumber = "El número debe tener 9 cifras";
    if (!editData.username?.trim())
      errors.username = "El nombre de usuario es obligatorio";
    if (!editData.email?.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editData.email))
      errors.email = "Email inválido";
    if (!editData.role) errors.role = "El rol es obligatorio";
    return errors;
  };
  const errors = editUser ? validate() : {};

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setSuccess("");
    try {
      // Concatenar solo el prefijo seleccionado (sin duplicar parte del número)
      await api.put(`/api/users/${editUser.id}`, {
        ...editData,
        telefono: editData.prefix + editData.phoneNumber,
      });
      setSuccess("Usuario actualizado correctamente");
      setEditUser(null);
      // Refrescar usuarios
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      setEditError(err.response?.data?.error || "Error al actualizar usuario");
    } finally {
      setEditLoading(false);
    }
  };

  // Botón para abrir modal de cambio de contraseña
  const openPasswordModal = (u) => {
    setPasswordUser(u);
    setShowPasswordModal(true);
    setNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  // Lógica para cambiar la contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordTouched(true);
    const errors = passwordRules.filter((rule) => !rule.test(newPassword));
    if (errors.length > 0) {
      setPasswordError("La contraseña no cumple los requisitos");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.patch(`/api/users/${passwordUser.id}/password`, {
        newPassword,
      });
      setPasswordSuccess("Contraseña actualizada correctamente");
      setNewPassword("");
      setShowPasswordSuccessModal(true);
    } catch (err) {
      setPasswordError(
        err.response?.data?.error || "Error al cambiar la contraseña"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#f7fafc]">
      <div className="max-w-4xl w-full mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">
          Usuarios
        </h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar usuario, email, nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-72 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
          />
          {success && (
            <span className="text-green-600 font-semibold">{success}</span>
          )}
          {error && <span className="text-red-500 font-semibold">{error}</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#68df9f] text-white">
                <th className="p-2 text-black">ID</th>
                <th className="p-2 text-black">Usuario</th>
                <th className="p-2 text-black">Nombre</th>
                <th className="p-2 text-black">Apellidos</th>
                <th className="p-2 text-black">Email</th>
                <th className="p-2 text-black">Teléfono</th>
                <th className="p-2 text-black">Rol</th>
                <th className="p-2 text-black">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2 text-black">{u.id}</td>
                  <td className="p-2 text-black">{u.username}</td>
                  <td className="p-2 text-black">{u.nombre}</td>
                  <td className="p-2 text-black">{u.apellidos}</td>
                  <td className="p-2 text-black">{u.email}</td>
                  {/* Visualización del teléfono en la tabla */}
                  <td className="p-2 text-black">{u.telefono}</td>
                  <td className="p-2 text-black capitalize">{u.role}</td>
                  <td className="p-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-semibold shadow-md transition"
                      onClick={() => handleEditClick(u)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-black font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-black font-semibold">
            Página {page} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-black font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* Modal de edición */}
      <Modal
        open={!!editUser}
        title="Editar usuario"
        onClose={() => setEditUser(null)}
      >
        {editUser && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-black mb-1 font-semibold">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={editData.nombre || ""}
                onChange={handleEditChange}
                onBlur={() => setEditTouched({ ...editTouched, nombre: true })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
                required
              />
              {editTouched.nombre && errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 font-semibold">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={editData.apellidos || ""}
                onChange={handleEditChange}
                onBlur={() =>
                  setEditTouched({ ...editTouched, apellidos: true })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
                required
              />
              {editTouched.apellidos && errors.apellidos && (
                <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email || ""}
                onChange={handleEditChange}
                onBlur={() => setEditTouched({ ...editTouched, email: true })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
                required
              />
              {editTouched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 font-semibold">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={editData.username || ""}
                onChange={handleEditChange}
                onBlur={() =>
                  setEditTouched({ ...editTouched, username: true })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
                required
              />
              {editTouched.username && errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 font-semibold">
                Teléfono
              </label>
              <div className="flex items-center gap-2 relative">
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
                        filteredCountries.find(
                          (c) => c.dial_code === editData.prefix
                        )?.flag || "/flags/ES.png"
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
                      value={countryQuery || editData.prefix}
                      onChange={(e) => {
                        setCountryQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 150)
                      }
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
                            setEditData({ ...editData, prefix: c.dial_code });
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
                  name="phoneNumber"
                  value={editData.phoneNumber || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      phoneNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  onBlur={() =>
                    setEditTouched({ ...editTouched, phoneNumber: true })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
                  placeholder="Número"
                  required
                  maxLength={9}
                  style={{ fontSize: 18, color: "#000" }}
                />
              </div>
              {editTouched.phoneNumber && errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-black mb-1 font-semibold">Rol</label>
              <select
                name="role"
                value={editData.role || "user"}
                onChange={handleEditChange}
                onBlur={() => setEditTouched({ ...editTouched, role: true })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black"
                required
              >
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
              {editTouched.role && errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
            {editError && (
              <p className="text-red-500 font-semibold mb-2">{editError}</p>
            )}
            <div className="flex gap-2 mb-2">
              <button
                type="submit"
                className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
                disabled={editLoading || Object.keys(errors).length > 0}
              >
                {editLoading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 font-semibold shadow-md transition"
                onClick={() => setEditUser(null)}
                disabled={editLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 font-semibold shadow-md transition"
                onClick={() => openPasswordModal(editUser)}
                disabled={editLoading}
              >
                Cambiar contraseña
              </button>
            </div>
          </form>
        )}
      </Modal>
      {/* Modal para cambiar contraseña */}
      <Modal
        open={showPasswordModal}
        title={`Cambiar contraseña de ${passwordUser?.username || "usuario"}`}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordTouched(false);
          setPasswordError("");
          setPasswordSuccess("");
        }}
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-black mb-1 font-semibold">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#68df9f] border-[#68df9f] bg-white text-black placeholder-gray-400"
              required
            />
            <ul className="text-xs mt-2 mb-1">
              {passwordRules.map((rule, i) => (
                <li
                  key={i}
                  className={
                    rule.test(newPassword)
                      ? "text-green-600 line-through"
                      : "text-gray-500"
                  }
                >
                  {rule.label}
                </li>
              ))}
            </ul>
            {passwordTouched && passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Cambiando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 font-semibold shadow-md transition"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordTouched(false);
                setPasswordError("");
                setPasswordSuccess("");
              }}
              disabled={passwordLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
        {/* Modal de éxito */}
        {showPasswordSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-black">
                Contraseña cambiada
              </h3>
              <p className="text-black mb-4">
                La contraseña se ha cambiado correctamente.
              </p>
              <button
                className="bg-[#68df9f] text-white px-4 py-2 rounded-md font-semibold shadow-md transition"
                onClick={() => {
                  setShowPasswordSuccessModal(false);
                  setShowPasswordModal(false);
                  setPasswordTouched(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Users;
