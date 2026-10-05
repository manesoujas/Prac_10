import Certificate from '../models/Certificate.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import crypto from 'crypto';

export const generateCertificate = async (req, res) => {
    try {
        const { registrationId, type } = req.body;

        const registration = await Registration.findById(registrationId).populate('event');
        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

        // Authorization
        if (registration.event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Verification conditions for basic participation cert
        if (registration.status !== 'completed' && registration.attendance === false) {
            return res.status(400).json({ success: false, message: 'User must have attended to receive a certificate' });
        }

        const certificateId = 'CERT-' + crypto.randomBytes(6).toString('hex').toUpperCase();

        const cert = await Certificate.create({
            certificateId,
            event: registration.event._id,
            user: registration.student,
            type: type || 'Participation'
        });

        registration.certificateIssued = true;
        await registration.save();

        res.status(201).json({ success: true, data: cert, message: 'Certificate generated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
            .populate('user', 'name college')
            .populate('event', 'title date venue organizer');

        if (!cert) {
            return res.status(404).json({ success: false, valid: false, message: 'Invalid certificate ID' });
        }

        res.json({ success: true, valid: true, data: cert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
