import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VolunteerManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newRole, setNewRole] = useState({
        roleName: '', description: '', requiredVolunteers: 1, location: ''
    });

    useEffect(() => {
        // Fetch organizer events
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                // For admin/organizer, it returns all their authorized events
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
        const fetchRoles = async () => {
            try {
                const { data } = await axios.get(`/api/volunteers/event/${selectedEventId}`);
                setRoles(data.data);
            } catch (error) {
                toast.error('Failed to load roles');
            }
        };
        fetchRoles();
    }, [selectedEventId]);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/volunteers/role', {
                eventId: selectedEventId,
                ...newRole
            });
            setRoles([...roles, data.data]);
            setNewRole({ roleName: '', description: '', requiredVolunteers: 1, location: '' });
            toast.success('Role added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating role');
        }
    };

    if (loading) return <div className="container" style={{ padding: '3rem' }}>Loading Event Context...</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>Volunteer Management</h2>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Create New Role</h3>
                    <form onSubmit={handleCreateRole}>
                        <div className="form-group">
                            <label className="form-label">Role Name</label>
                            <input type="text" className="form-input" required value={newRole.roleName} onChange={e => setNewRole({ ...newRole, roleName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" required rows="3" value={newRole.description} onChange={e => setNewRole({ ...newRole, description: e.target.value })}></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Required Volunteers</label>
                            <input type="number" min="1" className="form-input" required value={newRole.requiredVolunteers} onChange={e => setNewRole({ ...newRole, requiredVolunteers: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location Base</label>
                            <input type="text" className="form-input" required value={newRole.location} onChange={e => setNewRole({ ...newRole, location: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Role</button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Current Roles & Applications</h3>
                    {roles.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No roles created yet for this event.</p> : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {roles.map(r => (
                                <div key={r._id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{r.roleName}</h4>
                                        <span className="badge badge-info">Capacity: {r.requiredVolunteers}</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{r.description}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Location: {r.location}</p>

                                    <button className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Applications</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VolunteerManagement;
