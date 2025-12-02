import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getBills,
    createBill,
    updateBill,
    deleteBill,
} from '../controllers/billController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router.get('/', getBills);
router.post('/', createBill);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

export default router;
