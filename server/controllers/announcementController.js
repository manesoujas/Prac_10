import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';

export const createAnnouncement = async (req, res) => {
    try {
        const { eventId, title, message, priority } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const announcement = await Announcement.create({
            event: eventId, title, message, priority
        });

        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ event: req.params.eventId }).sort({ createdAt: -1 });
        res.json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
