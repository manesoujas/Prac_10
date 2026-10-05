import VolunteerRole from '../models/VolunteerRole.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import Event from '../models/Event.js';

export const createVolunteerRole = async (req, res) => {
    try {
        const { eventId, roleName, description, requiredVolunteers, skillsRequired, shiftStart, shiftEnd, location } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        // Authorization: Organizer or Admin
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to manage volunteers for this event' });
        }

        const role = await VolunteerRole.create({
            event: eventId,
            roleName, description, requiredVolunteers, skillsRequired, shiftStart, shiftEnd, location
        });

        res.status(201).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRolesForEvent = async (req, res) => {
    try {
        const roles = await VolunteerRole.find({ event: req.params.eventId });
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const applyForRole = async (req, res) => {
    try {
        const role = await VolunteerRole.findById(req.params.roleId).populate('event');
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        const existingApp = await VolunteerApplication.findOne({ student: req.user._id, volunteerRole: req.params.roleId });
        if (existingApp) {
            return res.status(400).json({ success: false, message: 'You have already applied for this role' });
        }

        const application = await VolunteerApplication.create({
            event: role.event._id,
            student: req.user._id,
            volunteerRole: role._id,
            message: req.body.message
        });

        res.status(201).json({ success: true, data: application, message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await VolunteerApplication.findById(req.params.id).populate('event');
        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

        if (app.event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        app.status = status;
        await app.save();

        res.json({ success: true, data: app, message: `Application ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
