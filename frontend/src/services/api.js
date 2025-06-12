import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Comprobar disponibilidad de nombre de usuario
export const checkUsernameAvailability = async (username) => {
  const res = await api.get(
    `/api/users/check-username?username=${encodeURIComponent(username)}`
  );
  return res.data.available;
};

export default api;
