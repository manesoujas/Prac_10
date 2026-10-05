import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiTag } from 'react-icons/fi';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [childrenNodes, setChildrenNodes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [reviews, setReviews] = useState({ data: [], averageRating: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data } = await axios.get(`/api/events/${id}`);
                setEvent(data.data);
                const roleRes = await axios.get(`/api/volunteers/event/${id}`);
                setRoles(roleRes.data.data);
                const revRes = await axios.get(`/api/reviews/event/${id}`);
                setReviews(revRes.data);
                const childRes = await axios.get(`/api/events/${id}/children`);
                setChildrenNodes(childRes.data.data);
            } catch (error) {
                toast.error('Event not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id, navigate]);

    const handleRegister = async () => {
        if (!user) {
            toast.info('Please sign in to register');
            return navigate('/login');
        }

        setIsRegistering(true);
        try {
            await axios.post(`/api/registrations/event/${id}`);
            toast.success('Successfully registered for ' + event.title);
            // Optionally redirect to generic ticket / registration QR page
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleApplyVolunteer = async (roleId) => {
        if (!user) {
            toast.info('Please sign in to apply');
            return navigate('/login');
        }
        try {
            await axios.post(`/api/volunteers/role/${roleId}/apply`, { message: 'I want to help!' });
            toast.success('Successfully applied for volunteer role!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const comment = e.target.comment.value;
        try {
            await axios.post('/api/reviews', { eventId: id, rating, comment });
            toast.success('Review submitted successfully!');
            e.target.reset();
            const revRes = await axios.get(`/api/reviews/event/${id}`);
            setReviews(revRes.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
    if (!event) return null;

    return (
        <div className="container">
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ height: '300px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: 'var(--text-muted)' }}>Event Banner</h2>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <span className="badge badge-success" style={{ marginBottom: '1rem' }}>{event.category}</span>
                        <h1 style={{ marginBottom: '1rem' }}>{event.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{event.shortDescription}</p>
                    </div>

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>About this Event</h3>
                        <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                            {event.description}
                        </div>
                    </div>

                    {(event.rules || event.eligibility) && (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Rules & Eligibility</h3>
                            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Eligibility</h4>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{event.eligibility || 'Open to all'}</p>
                            <h4 style={{ marginBottom: '0.5rem' }}>Rules</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>{event.rules || 'No specific rules mentioned.'}</p>
                        </div>
                    )}

                    {roles.length > 0 && (
                        <div className="card" style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Volunteer Opportunities</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {roles.map(r => (
                                    <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '0.25rem' }}>{r.roleName}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.description}</p>
                                        </div>
                                        <button className="btn btn-outline" onClick={() => handleApplyVolunteer(r._id)}>Apply</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {childrenNodes.length > 0 && (
                        <div className="card" style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Sub-Events & Rounds</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {childrenNodes.map(child => (
                                    <Link to={`/events/${child._id}`} key={child._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'inherit' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span className="badge badge-info">{child.eventType}</span>
                                                <h4 style={{ margin: 0 }}>{child.title}</h4>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{child.shortDescription}</p>
                                        </div>
                                        <span className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>View Node</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Participant Reviews</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '3rem', color: 'var(--accent-primary)' }}>{reviews.averageRating}</h2>
                            <div>
                                <span style={{ color: 'var(--warning)', fontSize: '1.25rem' }}>★</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Based on {reviews.count} reviews</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitReview} style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <h5 style={{ marginBottom: '0.5rem' }}>Rate Event</h5>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select name="rating" required className="form-input" style={{ width: 'auto' }}>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                                <input type="text" name="comment" required className="form-input" placeholder="Leave a review..." style={{ flex: 1 }} />
                                <button type="submit" className="btn btn-outline">Submit</button>
                            </div>
                        </form>

                        {reviews.data.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {reviews.data.map(rev => (
                                    <div key={rev._id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 500 }}>{rev.user?.name || 'Anonymous User'}</span>
                                            <span style={{ color: 'var(--warning)' }}>{'★'.repeat(rev.rating)}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review after attending!</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Registration details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}><FiCalendar size={20} color="var(--accent-primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date</div>
                                    <div style={{ fontWeight: 500 }}>{new Date(event.date).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}><FiClock size={20} color="var(--accent-primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time</div>
                                    <div style={{ fontWeight: 500 }}>{event.startTime} - {event.endTime}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}><FiMapPin size={20} color="var(--accent-primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Venue</div>
                                    <div style={{ fontWeight: 500 }}>{event.venue}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}><FiTag size={20} color="var(--accent-primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registration Fee</div>
                                    <div style={{ fontWeight: 500 }}>{event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            onClick={handleRegister}
                            disabled={isRegistering}
                        >
                            {isRegistering ? 'Processing...' : 'Register Now'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
