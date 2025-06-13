import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRoutes, roomRoutes, bookingRoutes } from "./routes/index.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { upload } from "./middleware/upload.js";

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Exponer carpeta de imágenes de salas
app.use("/rooms", express.static(path.join(__dirname, "public/rooms")));

// Exponer carpeta de banderas
app.use("/flags", express.static(path.join(__dirname, "public/flags")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT);
