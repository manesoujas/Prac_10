import express from 'express';
import { createVolunteerRole, getRolesForEvent, applyForRole, updateApplicationStatus } from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/role', protect, authorize('organizer', 'admin'), createVolunteerRole);
router.get('/event/:eventId', getRolesForEvent); // Publicly viewable roles
router.post('/role/:roleId/apply', protect, authorize('student'), applyForRole);
router.patch('/application/:id/status', protect, authorize('organizer', 'admin'), updateApplicationStatus);

export default router;
