import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';
import Category from './models/Category.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Category.deleteMany();

        // 1. Create Categories
        const createdCategories = await Category.insertMany([
            { name: 'Technical', description: 'Tech related events' },
            { name: 'Hackathon', description: 'Coding competitions' },
            { name: 'Cultural', description: 'Dance, music, and art' },
            { name: 'Sports', description: 'Outdoor and indoor sports' },
        ]);

        // 2. Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const demoPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@campusevents.local', password: adminPassword, role: 'admin', college: 'Demo Hub' },
            { name: 'Demo Organizer', email: 'organizer@campusevents.local', password: demoPassword, role: 'organizer', college: 'Demo College' },
            { name: 'Demo Student', email: 'student@campusevents.local', password: demoPassword, role: 'student', college: 'Demo College' },
            { name: 'Demo Judge', email: 'judge@campusevents.local', password: demoPassword, role: 'judge', college: 'Demo College' },
        ]);

        // 3. Create Events
        const organizer = users[1]._id; // Demo Organizer

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + 15);

        await Event.insertMany([
            {
                title: 'Campus Hackathon 2026',
                slug: 'campus-hackathon-2026',
                description: 'A 24 hour coding marathon. Build solutions that matter.',
                shortDescription: '24hr coding marathon.',
                category: 'Hackathon',
                date: futureDate,
                startTime: '09:00',
                endTime: '09:00',
                venue: 'Main Auditorium',
                organizer,
                registrationDeadline: deadlineDate,
                maxParticipants: 200,
                status: 'published',
                isPublished: true,
                registrationFee: 0,
            },
            {
                title: 'Annual Tech Symposium',
                slug: 'annual-tech-symposium',
                description: 'Presenting research and technological advances in AI.',
                shortDescription: 'AI and tech research symposium.',
                category: 'Technical',
                date: futureDate,
                startTime: '10:00',
                endTime: '17:00',
                venue: 'Seminar Hall A',
                organizer,
                registrationDeadline: deadlineDate,
                maxParticipants: 100,
                status: 'published',
                isPublished: true,
                registrationFee: 100,
            }
        ]);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

connectDB().then(importData);
