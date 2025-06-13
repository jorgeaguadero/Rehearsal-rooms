import express from "express";
import { authController } from "../controllers/index.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/updatePassword", authenticate, authController.updatePassword);

export default router;
