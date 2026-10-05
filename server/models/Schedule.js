import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    venue: { type: String },
    speaker: { type: String },
    type: { type: String } // e.g Workshop, Meal, Registration
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
