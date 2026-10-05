import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// We will create these pages next
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import VolunteerManagement from './pages/VolunteerManagement';
import TeamsDashboard from './pages/TeamsDashboard';
import AttendanceScanner from './pages/AttendanceScanner';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    // Optional: Only show splash once per session
    const hasSeen = sessionStorage.getItem('campusEventsSplashVisible');
    if (hasSeen) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('campusEventsSplashVisible', 'done');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', opacity: showSplash ? 0 : 1, transition: 'opacity 0.6s ease' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '2rem 0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/organizer/events/new" element={<CreateEvent />} />
              <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
              <Route path="/organizer/volunteers" element={<VolunteerManagement />} />
              <Route path="/organizer/attendance" element={<AttendanceScanner />} />
              <Route path="/teams" element={<TeamsDashboard />} />
            </Routes>
          </main>
        </div>
        <ToastContainer theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
