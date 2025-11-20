import express from "express";
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected route
router.get("/me", protect, getMe);

export default router;
