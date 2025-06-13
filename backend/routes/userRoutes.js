import express from "express";
import { userController } from "../controllers/index.js";
import { authenticate, restrictToAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get("/", authenticate, userController.getAllUsers);

// Actualizar perfil (username y teléfono)
router.put("/profile", authenticate, userController.updateProfile);

// Actualizar cualquier usuario (solo admin)
router.put(
  "/:id",
  authenticate,
  restrictToAdmin,
  userController.updateUserById
);

// Cambiar contraseña de cualquier usuario (solo admin)
router.patch(
  "/:id/password",
  authenticate,
  restrictToAdmin,
  userController.adminUpdateUserPassword
);

// Comprobar disponibilidad de nombre de usuario (validación en tiempo real)
router.get("/check-username", userController.checkUsernameAvailability);

export default router;
