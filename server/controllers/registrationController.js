import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

const generateRegistrationId = () => {
    return 'CE-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
}

export const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if registration deadline passed
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
        }

        // Check if event is full
        const currentRegistrations = await Registration.countDocuments({ event: eventId, status: { $ne: 'cancelled' } });
        if (currentRegistrations >= event.maxParticipants) {
            return res.status(400).json({ success: false, message: 'Event is already full' });
        }

        // Check for duplicate registration
        const existingReg = await Registration.findOne({ event: eventId, student: req.user._id });
        if (existingReg) {
            return res.status(400).json({ success: false, message: 'You are already registered for this event' });
        }

        const registration = await Registration.create({
            event: eventId,
            student: req.user._id,
            registrationId: generateRegistrationId()
        });

        res.status(201).json({ success: true, message: 'Registration successful', data: registration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ student: req.user._id })
            .populate('event')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const registrations = await Registration.find({ event: eventId })
            .populate('student', 'name email college course year')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        // Students can only cancel their own registration
        if (req.user.role === 'student') {
            if (registration.student.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
            if (status !== 'cancelled') {
                return res.status(403).json({ success: false, message: 'Students can only cancel registrations' });
            }
        }

        registration.status = status;
        await registration.save();

        res.json({ success: true, message: `Registration status updated to ${status}`, data: registration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
