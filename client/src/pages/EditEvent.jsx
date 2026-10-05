import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [myEvents, setMyEvents] = useState([]);

    const [formData, setFormData] = useState({
        title: '', description: '', shortDescription: '', category: 'Technical',
        date: '', startTime: '', endTime: '', venue: '', maxParticipants: 100, registrationFee: 0,
        registrationDeadline: '', eligibility: '', rules: '',
        eventType: 'MAIN', parentEvent: '', registrationMode: 'INDIVIDUAL'
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch the event to prepopulate
                const eventRes = await axios.get(`/api/events/${id}`);
                const ev = eventRes.data.data;
                const dateClean = ev.date ? ev.date.substring(0, 10) : '';
                const regDeadClean = ev.registrationDeadline ? ev.registrationDeadline.substring(0, 10) : '';

                setFormData({
                    title: ev.title || '',
                    description: ev.description || '',
                    shortDescription: ev.shortDescription || '',
                    category: ev.category || 'Technical',
                    date: dateClean,
                    startTime: ev.startTime || '',
                    endTime: ev.endTime || '',
                    venue: ev.venue || '',
                    maxParticipants: ev.maxParticipants || 100,
                    registrationFee: ev.registrationFee || 0,
                    registrationDeadline: regDeadClean,
                    eligibility: ev.eligibility || '',
                    rules: ev.rules || '',
                    eventType: ev.eventType || 'MAIN',
                    parentEvent: ev.parentEvent || '',
                    registrationMode: ev.registrationMode || 'INDIVIDUAL'
                });

                // Fetch other events for parent mapping
                const { data } = await axios.get('/api/events');
                setMyEvents(data.data.filter(e => e._id !== id)); // Don't allow linking to itself
            } catch (error) {
                toast.error('Failed to load event for editing');
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/events/${id}`, formData);
            toast.success('Event successfully updated!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update event. Check conflicts.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading Editor...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Edit Event</h2>
            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Event Title</label>
                        <input type="text" name="title" required className="form-input" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Short Tagline (Shown on cards)</label>
                        <input type="text" name="shortDescription" required className="form-input" maxLength="80" value={formData.shortDescription} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Full Description</label>
                        <textarea name="description" required className="form-input" rows="4" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Event Type Structure</label>
                        <select name="eventType" required className="form-input" value={formData.eventType} onChange={handleChange} style={{ appearance: 'none' }}>
                            <option value="MAIN">Main Target Event</option>
                            <option value="SUB_EVENT">Sub-Event / Category</option>
                            <option value="ROUND">Competition Round</option>
                            <option value="ACTIVITY">Activity Workshop</option>
                        </select>
                    </div>

                    {formData.eventType !== 'MAIN' && (
                        <div className="form-group">
                            <label className="form-label">Select Parent Event</label>
                            <select name="parentEvent" className="form-input" value={formData.parentEvent} onChange={handleChange} style={{ appearance: 'none' }}>
                                <option value="" disabled>Link to parent...</option>
                                {myEvents.map(ev => <option key={ev._id} value={ev._id}>{ev.title} ({ev.eventType})</option>)}
                            </select>
                        </div>
                    )}

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Registration Mode</label>
                        <select name="registrationMode" required className="form-input" value={formData.registrationMode} onChange={handleChange} style={{ appearance: 'none' }}>
                            <option value="INDIVIDUAL">Require Individual Registration for this specific child</option>
                            <option value="MAIN_EVENT">Inherited (Registering for Parent covers this)</option>
                            <option value="NONE">No Registration Required</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select name="category" required className="form-input" value={formData.category} onChange={handleChange} style={{ appearance: 'none' }}>
                            <option value="Technical">Technical</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Venue / Location</label>
                        <input type="text" name="venue" required className="form-input" value={formData.venue} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Event Date</label>
                        <input type="date" name="date" required className="form-input" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Registration Deadline</label>
                        <input type="date" name="registrationDeadline" required className="form-input" value={formData.registrationDeadline} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Time</label>
                        <input type="time" name="startTime" required className="form-input" value={formData.startTime} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <input type="time" name="endTime" required className="form-input" value={formData.endTime} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Max Participants Capacity</label>
                        <input type="number" name="maxParticipants" required className="form-input" value={formData.maxParticipants} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Registration Fee (₹) [0 for free]</label>
                        <input type="number" name="registrationFee" required className="form-input" value={formData.registrationFee} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Eligibility Criteria (Optional)</label>
                        <input type="text" name="eligibility" className="form-input" placeholder="e.g. Open to 3rd and 4th Years only" value={formData.eligibility} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Rules (Optional)</label>
                        <textarea name="rules" className="form-input" rows="3" value={formData.rules} onChange={handleChange}></textarea>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}>
                            {isSubmitting ? 'Saving Updates...' : 'Update Event'}
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ padding: '1rem' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
