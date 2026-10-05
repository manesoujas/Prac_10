import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projectTitle: { type: String },
    projectDescription: { type: String },
    status: { type: String, enum: ['forming', 'registered', 'disqualified', 'completed'], default: 'forming' },
    score: { type: Number, default: 0 }, // For judging
    feedback: { type: String }         // From judges
}, { timestamps: true });

// Unique team name per event
teamSchema.index({ name: 1, event: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
