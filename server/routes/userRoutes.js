import express from 'express';
import { getAdminStats, getOrganizerStats, getAllUsers } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin-stats', protect, authorize('admin'), getAdminStats);
router.get('/organizer-stats', protect, authorize('organizer', 'admin'), getOrganizerStats);
router.get('/', protect, authorize('admin'), getAllUsers);

export default router;
