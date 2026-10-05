import express from 'express';
import { generateCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, authorize('admin', 'organizer'), generateCertificate);
// Public verification route, no auth required
router.get('/verify/:certificateId', verifyCertificate);

export default router;
