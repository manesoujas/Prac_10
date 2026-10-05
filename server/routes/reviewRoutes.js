import express from 'express';
import { submitReview, getEventReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/event/:eventId', getEventReviews); // Public to view

export default router;
