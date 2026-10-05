import mongoose from 'mongoose';

const volunteerRoleSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    roleName: { type: String, required: true },
    description: { type: String, required: true },
    requiredVolunteers: { type: Number, required: true, default: 1 },
    skillsRequired: [{ type: String }],
    shiftStart: { type: Date },
    shiftEnd: { type: Date },
    location: { type: String }
}, { timestamps: true });

const VolunteerRole = mongoose.model('VolunteerRole', volunteerRoleSchema);
export default VolunteerRole;
