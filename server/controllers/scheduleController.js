import Schedule from '../models/Schedule.js';
import Event from '../models/Event.js';

export const createScheduleSession = async (req, res) => {
    try {
        const { eventId, title, description, startTime, endTime, venue, speaker, type } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const session = await Schedule.create({
            event: eventId, title, description, startTime, endTime, venue, speaker, type
        });

        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.find({ event: req.params.eventId }).sort({ startTime: 1 });
        res.json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
