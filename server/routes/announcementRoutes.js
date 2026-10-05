import express from 'express';
import { createAnnouncement, getEventAnnouncements } from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('organizer', 'admin'), createAnnouncement);
router.get('/event/:eventId', getEventAnnouncements);

export default router;
