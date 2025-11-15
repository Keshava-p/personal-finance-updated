import express from 'express';
import { getDebts, createDebt, updateDebt, deleteDebt } from '../controllers/debtController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getDebts);
router.post('/', authenticate, createDebt);
router.put('/:id', authenticate, updateDebt);
router.delete('/:id', authenticate, deleteDebt);

export default router;

