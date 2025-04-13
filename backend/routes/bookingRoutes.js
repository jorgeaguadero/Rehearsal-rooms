import express from "express";
import { bookingController } from "../controllers/index.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, bookingController.getBookings);
router.get("/:id", authenticate, bookingController.getBookingById);
router.post("/", authenticate, bookingController.createBooking);
router.put("/:id", authenticate, bookingController.updateBooking);
router.delete("/:id", authenticate, bookingController.cancelBooking);

export default router;
