import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AttendanceScanner = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [stats, setStats] = useState(null);
    const [registrationId, setRegistrationId] = useState('');
    const [isMarking, setIsMarking] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data.data);
                if (data.data.length > 0) setSelectedEventId(data.data[0]._id);
            } catch (error) {
                toast.error('Failed to load events');
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (!selectedEventId) return;
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`/api/attendance/stats/${selectedEventId}`);
                setStats(data.data);
            } catch (error) { }
        };
        fetchStats();
    }, [selectedEventId]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        setIsMarking(true);
        try {
            await axios.post('/api/attendance/mark', { registrationId });
            toast.success('Attendance marked successfully!');
            setRegistrationId('');

            // Refresh stats
            const { data } = await axios.get(`/api/attendance/stats/${selectedEventId}`);
            setStats(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setIsMarking(false);
        }
    };

    return (
        <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>Attendance & Entry Management</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Select Event</h4>
                <select
                    className="form-input"
                    value={selectedEventId}
                    onChange={e => setSelectedEventId(e.target.value)}
                    style={{ appearance: 'none' }}
                >
                    <option value="" disabled>Choose an event</option>
                    {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Scan Pass</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Use an external scanner or type the ID generated on the student pass manually.</p>

                    <form onSubmit={handleMarkAttendance}>
                        <div className="form-group">
                            <label className="form-label">Registration ID payload</label>
                            <input
                                type="text"
                                className="form-input"
                                required
                                placeholder="e.g. REG-ABC12345"
                                value={registrationId}
                                onChange={e => setRegistrationId(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" disabled={isMarking} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            {isMarking ? 'Processing...' : 'Mark Present'}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Live Flow Statistics</h3>
                    {stats ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontWeight: 500 }}>Total Distributed Passes</span>
                                <b style={{ fontSize: '1.25rem' }}>{stats.totalRegistered}</b>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontWeight: 500 }}>Attendees Entered (Present)</span>
                                <b style={{ fontSize: '1.25rem' }}>{stats.present}</b>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontWeight: 500 }}>Expected Remaining</span>
                                <b style={{ fontSize: '1.25rem' }}>{stats.absent}</b>
                            </div>
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <span className="badge badge-info" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                    Conversion Rate: {stats.attendancePercentage}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading live statistics...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceScanner;
