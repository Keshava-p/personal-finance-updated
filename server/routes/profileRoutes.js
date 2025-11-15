import express from 'express';
import { getProfile, updateProfile, updateSalary, updatePreferences } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getProfile);
router.post('/update', authenticate, updateProfile);
router.post('/salary', authenticate, updateSalary);
router.post('/preferences', authenticate, updatePreferences);

export default router;

