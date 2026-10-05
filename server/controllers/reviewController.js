import Review from '../models/Review.js';
import Registration from '../models/Registration.js';

export const submitReview = async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;

        // Ensure user actually attended or completed the event
        const registration = await Registration.findOne({ event: eventId, student: req.user._id });
        if (!registration || (registration.status !== 'completed' && !registration.attendance)) {
            return res.status(403).json({ success: false, message: 'You must have attended the event to review it' });
        }

        const existingReview = await Review.findOne({ event: eventId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this event' });
        }

        const review = await Review.create({
            event: eventId,
            user: req.user._id,
            rating,
            comment
        });

        res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'name');

        // Calculate average rating
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.json({ success: true, averageRating, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
