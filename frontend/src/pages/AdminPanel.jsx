import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminPanel() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    capacity: "",
    price_per_hour: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/api/rooms");
        console.log("Respuesta /api/rooms:", response.data);
        setRooms(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar las salas");
        console.error("Error:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newRoom.name);
      formData.append("description", newRoom.description);
      formData.append("capacity", newRoom.capacity);
      formData.append("price_per_hour", newRoom.price_per_hour);
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (newRoom.image) {
        formData.append("image", newRoom.image);
      }
      await api.post("/api/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewRoom({
        name: "",
        description: "",
        capacity: "",
        price_per_hour: "",
        image: "",
      });
      setImageFile(null);
      setError("");
      const response = await api.get("/api/rooms");
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear la sala");
    }
  };

  const handleEditClick = (room) => {
    setEditId(room.id);
    setEditData({ ...room });
    setEditImageFile(null);
  };

  const handleEditInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
    setEditImageFile(null);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("capacity", editData.capacity);
      formData.append("price_per_hour", editData.price_per_hour);
      if (editImageFile) {
        formData.append("image", editImageFile);
      } else if (editData.image) {
        formData.append("image", editData.image);
      }
      await api.put(`/api/rooms/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditId(null);
      setEditData({});
      setEditImageFile(null);
      const response = await api.get("/api/rooms");
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al editar la sala");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta sala?")) return;
    try {
      await api.delete(`/api/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar la sala");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Panel de Administración
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {showCreateForm ? (
          <form
            onSubmit={handleCreateRoom}
            className="mb-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <h3 className="text-lg font-semibold mb-2">Crear nueva sala</h3>
            <label className="text-left font-medium">
              Nombre
              <input
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="border p-2 w-full rounded mt-1"
                required
              />
            </label>
            <label className="text-left font-medium">
              Descripción
              <input
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
                placeholder="Descripción"
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="text-left font-medium">
              Capacidad
              <input
                name="capacity"
                value={newRoom.capacity}
                onChange={handleInputChange}
                placeholder="Capacidad"
                type="number"
                className="border p-2 w-full rounded mt-1"
                required
              />
            </label>
            <label className="text-left font-medium">
              Precio/hora
              <input
                name="price_per_hour"
                value={newRoom.price_per_hour}
                onChange={handleInputChange}
                placeholder="Precio/hora"
                type="number"
                step="0.01"
                className="border p-2 w-full rounded mt-1"
                required
              />
            </label>
            <label className="text-left font-medium">
              Imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              >
                Crear
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Salas</h2>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowCreateForm(true)}
              >
                Crear nueva sala
              </button>
            </div>
            {rooms.length === 0 ? (
              <p className="text-gray-600">No hay salas registradas.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    {editId === room.id ? (
                      <form
                        onSubmit={handleEditSave}
                        encType="multipart/form-data"
                        className="flex flex-col gap-2"
                      >
                        <label className="text-left font-medium">
                          Nombre
                          <input
                            name="name"
                            value={editData.name || ""}
                            onChange={handleEditInputChange}
                            placeholder="Nombre"
                            className="border p-2 w-full rounded mt-1"
                            required
                          />
                        </label>
                        <label className="text-left font-medium">
                          Descripción
                          <input
                            name="description"
                            value={editData.description || ""}
                            onChange={handleEditInputChange}
                            placeholder="Descripción"
                            className="border p-2 w-full rounded mt-1"
                          />
                        </label>
                        <label className="text-left font-medium">
                          Capacidad
                          <input
                            name="capacity"
                            value={editData.capacity || ""}
                            onChange={handleEditInputChange}
                            placeholder="Capacidad"
                            type="number"
                            className="border p-2 w-full rounded mt-1"
                            required
                          />
                        </label>
                        <label className="text-left font-medium">
                          Precio/hora
                          <input
                            name="price_per_hour"
                            value={editData.price_per_hour || ""}
                            onChange={handleEditInputChange}
                            placeholder="Precio/hora"
                            type="number"
                            step="0.01"
                            className="border p-2 w-full rounded mt-1"
                            required
                          />
                        </label>
                        <label className="text-left font-medium">
                          Imagen
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditFileChange}
                            className="border p-2 w-full rounded mt-1"
                          />
                        </label>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={handleEditCancel}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <img
                          src={
                            room.image
                              ? `http://localhost:3000/${room.image}`
                              : "/vite.svg"
                          }
                          alt={room.name}
                          className="w-64 h-56 object-cover object-center mx-auto rounded mb-2"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {room.name}
                        </h3>
                        <p className="text-gray-600">{room.description}</p>
                        <p className="text-gray-600">
                          Capacidad: {room.capacity}
                        </p>
                        <p className="text-gray-600">
                          Precio por hora: ${room.price_per_hour}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditClick(room)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
