import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
