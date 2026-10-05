# CampusEvents - MERN Stack Event Management Platform

An enterprise-grade College Event Management Platform built with the MERN stack (MongoDB, Express, React, Node.js). Engineered featuring robust role-based authentication, interactive dashboards, complete volunteer & team mechanics, digital QR code generation for passes, automated certificate distribution, and complex analytics.

## Tech Stack
- Frontend: `React`, `Vite`, `Vanilla CSS` (A fully custom premium dark-mode Design System)
- Backend: `Express ES6`, `Node 22`, `Mongoose`
- Modules: `bcryptjs`, `jsonwebtoken`, `qrcode.react`, `concurrently`

## Project Structure
- **/client**: Contains the Vite-React application providing seamless UX, interactive dashboards, and optimized API bridging.
- **/server**: Includes Mongoose Datamodels (`User`, `Event`, `Registration`, `Review`, `Team`, `VolunteerRole`, `Schedule`, `Certificate`, `Notification`) with secure JWT APIs, and extensive state checks.
- `package.json` (Root): Central execution hub using concurrently.

## Execution via Root
The platform has a root package configurations bridging both processes dynamically!
You can launch everything efficiently via:
```bash
# 1. Start MongoDB (ensure your local 127.0.0.1:27017 is running mongod)

# 2. Run the platform!
npm run dev
```

Both the Vite frontend (`localhost:5173`) and the Express Node API (`localhost:5000`) will boot perfectly.

### Accounts Seeded
The database was automatically filled using the `seedDatabase.js` executing 4 unique roles to test everything out:
- **Admin**: `admin@campusevents.local` / `admin123`
- **Organizer**: `organizer@campusevents.local` / `password123`
- **Student**: `student@campusevents.local` / `password123`
- **Judge**: `judge@campusevents.local` / `password123`

Enjoy using CampusEvents!
