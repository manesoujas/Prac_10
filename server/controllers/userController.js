import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalOrganizers = await User.countDocuments({ role: 'organizer' });

        const totalEvents = await Event.countDocuments();
        const pendingEvents = await Event.countDocuments({ status: 'pending' });
        const upcomingEvents = await Event.countDocuments({ status: 'approved', date: { $gte: new Date() } });

        const totalRegistrations = await Registration.countDocuments();
        const totalVolunteers = 0; // Phase 2 setup

        res.json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalOrganizers,
                totalEvents,
                upcomingEvents,
                pendingEvents,
                totalRegistrations,
                totalVolunteers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrganizerStats = async (req, res) => {
    try {
        const organizerId = req.user._id;

        const totalEvents = await Event.countDocuments({ organizer: organizerId });
        const publishedEvents = await Event.countDocuments({ organizer: organizerId, isPublished: true });
        const pendingEvents = await Event.countDocuments({ organizer: organizerId, status: 'pending' });

        // Count registrations for these events
        const events = await Event.find({ organizer: organizerId }).select('_id');
        const eventIds = events.map(e => e._id);
        const totalRegistrations = await Registration.countDocuments({ event: { $in: eventIds } });

        const upcomingEvents = await Event.countDocuments({ organizer: organizerId, date: { $gte: new Date() } });
        const completedEvents = await Event.countDocuments({ organizer: organizerId, status: 'completed' });

        res.json({
            success: true,
            data: {
                totalEvents,
                publishedEvents,
                pendingEvents,
                totalRegistrations,
                upcomingEvents,
                completedEvents
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
