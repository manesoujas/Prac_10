import express from 'express';
import { getMyNotifications, markAsRead, createSystemNotification } from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markAsRead);
router.post('/system', protect, authorize('admin', 'organizer'), createSystemNotification);

export default router;
