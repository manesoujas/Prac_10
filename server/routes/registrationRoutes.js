import express from 'express';
import { registerForEvent, getMyRegistrations, getEventRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/event/:eventId', protect, authorize('student'), registerForEvent);
router.get('/my-registrations', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId/registrations', protect, authorize('organizer', 'admin'), getEventRegistrations);
router.patch('/:id/status', protect, updateRegistrationStatus);

export default router;
