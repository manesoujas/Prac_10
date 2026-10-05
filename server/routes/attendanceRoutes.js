import express from 'express';
import { markAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/mark', protect, authorize('admin', 'organizer'), markAttendance);
router.get('/stats/:eventId', protect, authorize('admin', 'organizer'), getAttendanceStats);

export default router;
