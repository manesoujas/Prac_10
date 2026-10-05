import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    volunteerRole: { type: mongoose.Schema.Types.ObjectId, ref: 'VolunteerRole', required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'completed'], default: 'pending' },
    attendance: { type: Boolean, default: false } // Simplification for volunteer marking checkIn/out for now
}, { timestamps: true });

// Prevent student from applying for the exact same role twice
volunteerApplicationSchema.index({ student: 1, volunteerRole: 1 }, { unique: true });

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
export default VolunteerApplication;
