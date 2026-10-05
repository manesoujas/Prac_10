import Team from '../models/Team.js';
import Event from '../models/Event.js';

export const createTeam = async (req, res) => {
    try {
        const { name, eventId, projectTitle, projectDescription } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const teamExists = await Team.findOne({ name, event: eventId });
        if (teamExists) return res.status(400).json({ success: false, message: 'Team name already taken for this event' });

        const team = await Team.create({
            name,
            event: eventId,
            leader: req.user._id,
            members: [req.user._id],
            projectTitle,
            projectDescription
        });

        res.status(201).json({ success: true, data: team, message: 'Team created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeamsForEvent = async (req, res) => {
    try {
        const teams = await Team.find({ event: req.params.eventId }).populate('leader members', 'name email');
        res.json({ success: true, data: teams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const joinTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

        if (team.members.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'You are already in this team' });
        }

        team.members.push(req.user._id);
        await team.save();

        res.json({ success: true, message: 'Joined team successfully', data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const submitScore = async (req, res) => {
    try {
        const { score, feedback } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

        // Ensure user is judge/admin/organizer
        team.score = score;
        team.feedback = feedback;
        await team.save();

        res.json({ success: true, message: 'Score submitted successfully', data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
