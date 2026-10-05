import express from 'express';
import { createTeam, getTeamsForEvent, joinTeam, submitScore } from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('student'), createTeam);
router.get('/event/:eventId', getTeamsForEvent);
router.post('/:id/join', protect, authorize('student'), joinTeam);
router.patch('/:id/score', protect, authorize('judge', 'admin', 'organizer'), submitScore);

export default router;
