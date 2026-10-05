import Event from '../models/Event.js';
import slugify from 'slugify';

export const createEvent = async (req, res) => {
    try {
        const { title, date, startTime, parentEvent } = req.body;

        let rootEvent = null;
        if (parentEvent) {
            const parent = await Event.findById(parentEvent);
            if (!parent) return res.status(404).json({ success: false, message: 'Parent event missing' });

            // Inherit root if parent is a child, otherwise parent is the root
            rootEvent = parent.rootEvent ? parent.rootEvent : parent._id;

            const childStart = new Date(`${date}T${startTime}`);
            const parentStart = new Date(`${parent.date}T${parent.startTime}`);
            // Basic naive bounds check
            if (childStart < parentStart) {
                return res.status(400).json({ success: false, message: 'Child event cannot start before Parent event bounds' });
            }
        }

        const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

        const eventData = { ...req.body, slug, organizer: req.user._id, rootEvent, status: req.user.role === 'admin' ? 'published' : 'pending' };
        if (!eventData.parentEvent) delete eventData.parentEvent; // Prevent Mongoose ObjectId CastError

        const event = await Event.create(eventData);

        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;
        if (status) query.status = status;

        // Default: only show published/approved if not auth'd as organizer/admin
        if (!req.user || req.user.role === 'student') {
            query.status = { $in: ['approved', 'published', 'ongoing', 'completed'] };
        }

        const skip = (page - 1) * limit;

        const events = await Event.find(query).populate('organizer', 'name').sort({ date: 1 }).skip(skip).limit(Number(limit));
        const total = await Event.countDocuments(query);

        res.json({
            success: true,
            data: events,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id }).sort({ date: -1 });
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdminPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).populate('organizer', 'name email').sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
        }

        const updateData = { ...req.body };
        if (updateData.parentEvent === '') delete updateData.parentEvent;

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, message: 'Event updated successfully', data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Only admin or the actual organizer can change status (with logic to prevent pure organizer from approving their own event, but for simplicity we allow organizer to update status and handle auth logic in roles)
        if (req.user.role !== 'admin' && status === 'approved') {
            return res.status(403).json({ success: false, message: 'Only admin can approve events' });
        }

        event.status = status;
        if (status === 'published') {
            event.isPublished = true;
        }
        await event.save();

        res.json({ success: true, message: `Event status updated to ${status}`, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/events/:id/children
export const getEventChildren = async (req, res) => {
    try {
        const children = await Event.find({ parentEvent: req.params.id }).sort('date startTime');
        res.status(200).json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/events/:id/tree
export const getEventTree = async (req, res) => {
    try {
        const root = await Event.findById(req.params.id);
        if (!root) return res.status(404).json({ success: false, message: 'Event not found' });

        // Since we stored rootEvent, we can quickly fetch all descendants and assemble locally
        const searchRootId = root.rootEvent || root._id;
        const allNodes = await Event.find({
            $or: [{ _id: searchRootId }, { rootEvent: searchRootId }]
        }).lean();

        // Assemble tree in memory
        const idMapping = allNodes.reduce((acc, el, i) => {
            acc[el._id.toString()] = i;
            el.children = [];
            return acc;
        }, {});

        let localTreeRoot;
        allNodes.forEach(el => {
            if (el.parentEvent) {
                const parentIndex = idMapping[el.parentEvent.toString()];
                if (parentIndex !== undefined) {
                    allNodes[parentIndex].children.push(el);
                }
            }
            if (el._id.toString() === req.params.id) {
                localTreeRoot = el; // Return the tree starting from requested node
            }
        });

        res.status(200).json({ success: true, data: localTreeRoot || allNodes[idMapping[req.params.id]] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
