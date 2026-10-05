import express from 'express';
import { createScheduleSession, getEventSchedule } from '../controllers/scheduleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('organizer', 'admin'), createScheduleSession);
router.get('/event/:eventId', getEventSchedule);

export default router;
