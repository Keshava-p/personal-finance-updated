import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateSalary } from '../controllers/salaryController.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Update salary
router.put('/', updateSalary);

export default router;
