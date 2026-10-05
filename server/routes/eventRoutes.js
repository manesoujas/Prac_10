import express from 'express';
import {
    createEvent, getEvents, getEventById, updateEvent, deleteEvent, updateEventStatus,
    getEventChildren, getEventTree, getMyEvents, getAdminPendingEvents
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-events', protect, authorize('organizer'), getMyEvents);
router.get('/admin/pending', protect, authorize('admin'), getAdminPendingEvents);

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

router.get('/:id/children', getEventChildren);
router.get('/:id/tree', getEventTree);

router.put('/:id/status', protect, authorize('admin', 'organizer'), updateEventStatus);

export default router;
