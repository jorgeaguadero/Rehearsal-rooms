import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function Users() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuarios</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#68df9f] text-white">
            <th className="p-2">ID</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center mt-4">No hay usuarios.</div>
      )}
    </div>
  );
}

export default Users;
