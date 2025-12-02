import express from 'express';
import { protect } from '../middleware/auth.js';
import { predictStock } from '../controllers/stockController.js';

const router = express.Router();

// Apply authentication middleware
router.use(protect);

// Stock prediction endpoint
router.post('/predict', predictStock);

export default router;
