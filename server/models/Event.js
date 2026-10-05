import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    eventType: { type: String, enum: ['MAIN', 'SUB_EVENT', 'ROUND', 'ACTIVITY'], default: 'MAIN' },
    parentEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    rootEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    registrationMode: { type: String, enum: ['NONE', 'MAIN_EVENT', 'INDIVIDUAL'], default: 'INDIVIDUAL' },
    bannerImage: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationDeadline: { type: Date, required: true },
    maxParticipants: { type: Number, required: true },
    registrationFee: { type: Number, default: 0 },
    eligibility: { type: String },
    rules: { type: String },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
    },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
