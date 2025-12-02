import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  recordPayment,
  getPayoffStrategies,
} from "../controllers/debtController.js";

const router = express.Router();

router.use(protect);  // Apply protect middleware globally

router.get("/", getDebts);
router.post("/", createDebt);
router.put("/:id", updateDebt);
router.delete("/:id", deleteDebt);
router.post("/:id/payment", recordPayment);
router.get("/strategies", getPayoffStrategies);

export default router;
