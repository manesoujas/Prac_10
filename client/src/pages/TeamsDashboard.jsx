import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const TeamsDashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newTeam, setNewTeam] = useState({
        name: '', projectTitle: '', projectDescription: ''
    });

    useEffect(() => {
        // Fetch published events
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data.data);
                if (data.data.length > 0) setSelectedEventId(data.data[0]._id);
            } catch (error) {
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (!selectedEventId) return;
        const fetchTeams = async () => {
            try {
                const { data } = await axios.get(`/api/teams/event/${selectedEventId}`);
                setTeams(data.data);
            } catch (error) {
                toast.error('Failed to load teams');
            }
        };
        fetchTeams();
    }, [selectedEventId]);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/teams', {
                eventId: selectedEventId,
                ...newTeam
            });
            // Re-fetch teams
            const teamRes = await axios.get(`/api/teams/event/${selectedEventId}`);
            setTeams(teamRes.data.data);
            setNewTeam({ name: '', projectTitle: '', projectDescription: '' });
            toast.success('Team created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating team');
        }
    };

    const handleJoinTeam = async (teamId) => {
        try {
            await axios.post(`/api/teams/${teamId}/join`);
            toast.success('Successfully joined the team!');
            const teamRes = await axios.get(`/api/teams/event/${selectedEventId}`);
            setTeams(teamRes.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error joining team');
        }
    };

    if (loading) return <div className="container" style={{ padding: '3rem' }}>Loading...</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>Team Formation & Dashboard</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Select Hackathon or Event for Teams</h4>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem' }}>
                <div className="card" style={{ alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Form New Team</h3>
                    <form onSubmit={handleCreateTeam}>
                        <div className="form-group">
                            <label className="form-label">Team Name</label>
                            <input type="text" className="form-input" required value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Project Title</label>
                            <input type="text" className="form-input" required value={newTeam.projectTitle} onChange={e => setNewTeam({ ...newTeam, projectTitle: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Idea Description</label>
                            <textarea className="form-input" required rows="3" value={newTeam.projectDescription} onChange={e => setNewTeam({ ...newTeam, projectDescription: e.target.value })}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Team</button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Teams Looking for Members</h3>
                    {teams.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No teams are registered for this event yet.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {teams.map(t => (
                                <div key={t._id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{t.name}</h4>
                                        <span className="badge badge-info">{t.members.length} Members</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>Project: {t.projectTitle}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t.projectDescription}</p>

                                    {t.members.some(member => member._id === user?._id) ? (
                                        <button className="btn btn-primary" disabled style={{ marginTop: '1rem', width: '100%', opacity: 0.7 }}>Already Joined</button>
                                    ) : (
                                        <button className="btn btn-outline" onClick={() => handleJoinTeam(t._id)} style={{ marginTop: '1rem', width: '100%' }}>Join Team</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsDashboard;
