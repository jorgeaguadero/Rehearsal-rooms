import express from "express";
import { roomController } from "../controllers/index.js";
import { authenticate, restrictToAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.get("/:id/availability", roomController.getRoomAvailability);
router.post(
  "/",
  authenticate,
  restrictToAdmin,
  upload.single("image"),
  roomController.createRoom
);
router.put(
  "/:id",
  authenticate,
  restrictToAdmin,
  upload.single("image"),
  roomController.updateRoom
);
router.delete("/:id", authenticate, restrictToAdmin, roomController.deleteRoom);

export default router;
