import express from 'express';
import { getInsights } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/insights', authenticate, getInsights);

export default router;

