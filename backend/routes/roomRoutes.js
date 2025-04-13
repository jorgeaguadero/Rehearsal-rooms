import express from "express";
import { roomController } from "../controllers/index.js";
import { authenticate, restrictToAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", authenticate, restrictToAdmin, roomController.createRoom);
router.put("/:id", authenticate, restrictToAdmin, roomController.updateRoom);
router.delete("/:id", authenticate, restrictToAdmin, roomController.deleteRoom);

export default router;
