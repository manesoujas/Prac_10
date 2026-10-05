import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

export const markAttendance = async (req, res) => {
    try {
        const { registrationId } = req.body;

        const registration = await Registration.findOne({ registrationId }).populate('event');
        if (!registration) {
            return res.status(404).json({ success: false, message: 'Invalid Registration ID' });
        }

        if (registration.event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to mark attendance for this event' });
        }

        if (registration.attendance) {
            return res.status(400).json({ success: false, message: 'Attendance already recorded for this participant' });
        }

        registration.attendance = true;
        registration.attendanceMarkedAt = new Date();
        registration.status = 'attended';
        await registration.save();

        res.json({ success: true, message: 'Attendance marked successfully', data: registration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceStats = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const totalRegistered = await Registration.countDocuments({ event: eventId, status: { $ne: 'cancelled' } });
        const present = await Registration.countDocuments({ event: eventId, attendance: true });
        const absent = totalRegistered - present;
        const percentage = totalRegistered > 0 ? ((present / totalRegistered) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            data: {
                totalRegistered,
                present,
                absent,
                attendancePercentage: `${percentage}%`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
