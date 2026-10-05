import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['registered', 'cancelled', 'attended', 'completed'], default: 'registered' },
    attendance: { type: Boolean, default: false },
    attendanceMarkedAt: { type: Date },
    certificateIssued: { type: Boolean, default: false }
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
