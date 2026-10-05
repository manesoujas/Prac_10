import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    certificateId: { type: String, required: true, unique: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Participation', 'Winner', 'Runner Up', 'Volunteer', 'Judge', 'Organizer'], default: 'Participation' },
    issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
