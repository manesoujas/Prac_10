import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiActivity, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [myAuthoredEvents, setMyAuthoredEvents] = useState([]);
    const [pendingAdminEvents, setPendingAdminEvents] = useState([]);

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!user) return;
        const fetchDashboardData = async () => {
            try {
                if (user.role === 'admin') {
                    const { data } = await axios.get('/api/users/admin-stats');
                    setStats(data.data);

                    try {
                        const adminEvts = await axios.get('/api/events/admin/pending');
                        setPendingAdminEvents(adminEvts.data.data);
                    } catch (e) {
                        console.error('Cannot load admin pending events', e);
                    }

                } else if (user.role === 'organizer') {
                    const { data } = await axios.get('/api/users/organizer-stats');
                    setStats(data.data);

                    try {
                        const myEvts = await axios.get('/api/events/my-events');
                        setMyAuthoredEvents(myEvts.data.data);
                    } catch (e) {
                        console.error('Cannot load authored evts', e);
                    }

                } else {
                    const { data } = await axios.get('/api/registrations/my-registrations');
                    setRegistrations(data.data);
                    setStats({
                        totalRegistrations: data.data.length,
                        upcomingEvents: data.data.filter(r => r.event && new Date(r.event.date) >= new Date()).length
                    });
                }
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const handleGenerateCertificate = async (regId) => {
        try {
            const { data } = await axios.post('/api/certificates/generate', { registrationId: regId });
            toast.success('Certificate generated successfully! CERT ID: ' + data.data.certificateId);
            // Refresh registrations
            const regRefresh = await axios.get('/api/registrations/my-registrations');
            setRegistrations(regRefresh.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cannot generate certificate yet');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you incredibly sure you want to completely DESTROY this event and its registrations?")) return;

        try {
            await axios.delete(`/api/events/${eventId}`);
            toast.success('Event purged from existence.');
            setMyAuthoredEvents(prev => prev.filter(e => e._id !== eventId));
        } catch (error) {
            toast.error('Failed to delete event. Make sure you are authorized.');
        }
    };

    const handleApproveEvent = async (eventId) => {
        try {
            await axios.put(`/api/events/${eventId}/status`, { status: 'published' });
            toast.success('Event successfully published!');
            setPendingAdminEvents(prev => prev.filter(e => e._id !== eventId));
            setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1, totalEvents: prev.totalEvents + 1 }));
        } catch (error) {
            toast.error('Failed to approve event.');
        }
    };

    if (authLoading || loading) return (
        <div className="container" style={{ padding: '6rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(145deg, var(--bg-card), rgba(20,20,22,0.8))' }}>
            <div style={{ padding: '1rem', borderRadius: '1rem', background: `rgba(${color}, 0.1)`, display: 'flex', boxShadow: `0 4px 20px rgba(${color}, 0.15)` }}>
                {icon}
            </div>
            <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{title}</h4>
                <h2 style={{ fontSize: '2.5rem', marginBottom: 0, fontWeight: 700 }} className="text-gradient">{value}</h2>
            </div>
        </motion.div>
    );

    // Animation Variants
    const staggerRules = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingBottom: '4rem' }}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 style={{ marginBottom: '0.25rem', fontSize: '2.2rem' }}>Welcome back, {user?.name.split(' ')[0]}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{user?.role === 'admin' ? 'System Administrator' : user?.role === 'organizer' ? 'Event Organizer' : 'Student Participant'}</p>
                </div>
            </motion.div>

            <motion.div variants={staggerRules} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {user?.role === 'student' && (
                    <>
                        <motion.div variants={fadeUp}><StatCard title="Registered Events" value={stats?.totalRegistrations || 0} icon={<FiCheckCircle size={32} color="var(--success)" />} color="16, 185, 129" /></motion.div>
                        <motion.div variants={fadeUp}><StatCard title="Upcoming Events" value={stats?.upcomingEvents || 0} icon={<FiCalendar size={32} color="var(--warning)" />} color="245, 158, 11" /></motion.div>
                    </>
                )}
                {user?.role === 'organizer' && (
                    <>
                        <motion.div variants={fadeUp}><StatCard title="Total Events" value={stats?.totalEvents || 0} icon={<FiCalendar size={32} color="var(--accent-primary)" />} color="99, 102, 241" /></motion.div>
                        <motion.div variants={fadeUp}><StatCard title="Total Registrations" value={stats?.totalRegistrations || 0} icon={<FiUsers size={32} color="var(--success)" />} color="16, 185, 129" /></motion.div>
                        <motion.div variants={fadeUp}><StatCard title="Pending Review" value={stats?.pendingEvents || 0} icon={<FiClock size={32} color="var(--warning)" />} color="245, 158, 11" /></motion.div>
                    </>
                )}
                {user?.role === 'admin' && (
                    <>
                        <motion.div variants={fadeUp}><StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<FiUsers size={32} color="var(--accent-primary)" />} color="99, 102, 241" /></motion.div>
                        <motion.div variants={fadeUp}><StatCard title="Total Events" value={stats?.totalEvents || 0} icon={<FiCalendar size={32} color="var(--success)" />} color="16, 185, 129" /></motion.div>
                        <motion.div variants={fadeUp}><StatCard title="Pending Approval" value={stats?.pendingEvents || 0} icon={<FiActivity size={32} color="var(--warning)" />} color="245, 158, 11" /></motion.div>
                    </>
                )}
            </motion.div>

            {user?.role === 'student' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>My Registrations</h3>
                    {registrations.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>You haven't registered for any events yet.</p>
                            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Discover Events</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {registrations.map(reg => (
                                <div key={reg._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '0.25rem' }}>{reg.event?.title || 'Event removed'}</h4>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <span className={`badge ${reg.status === 'attended' || reg.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{reg.status}</span>
                                    </div>

                                    <div style={{ padding: '1rem', background: '#fff', borderRadius: 'var(--radius-md)', alignSelf: 'center', marginBottom: '0.5rem' }}>
                                        <QRCodeSVG value={reg.registrationId} size={120} />
                                        <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '0.5rem', color: '#666', fontFamily: 'monospace' }}>{reg.registrationId}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <Link to={`/events/${reg.event?._id}`} className="btn btn-outline" style={{ textAlign: 'center', padding: '0.5rem' }}>Details</Link>

                                        {reg.status === 'attended' || reg.attendance ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem' }}
                                                disabled={reg.certificateIssued}
                                                onClick={() => handleGenerateCertificate(reg._id)}
                                            >
                                                {reg.certificateIssued ? 'Claimed' : 'Claim Cert'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary" style={{ padding: '0.5rem', opacity: 0.5 }} disabled>Pending</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(user?.role === 'organizer' || user?.role === 'admin') && (
                <>
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Organizer Tools</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/organizer/events/new" className="btn btn-primary">Create New Event</Link>
                            <Link to="/organizer/volunteers" className="btn btn-outline">Manage Volunteers</Link>
                            <Link to="/organizer/attendance" className="btn btn-outline" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>Scanner & Flow</Link>
                        </div>
                    </div>

                    {user?.role === 'organizer' && (
                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Management & Authorship</h3>
                            {myAuthoredEvents.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No authored configurations discovered in this space.</div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {myAuthoredEvents.map(evt => (
                                        <div key={evt._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                                            <div>
                                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {evt.title}
                                                    <span className={`badge ${evt.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>{evt.status}</span>
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{new Date(evt.date).toDateString()} | {evt.eventType}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link to={`/events/${evt._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>View</Link>
                                                <Link to={`/organizer/events/${evt._id}/edit`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: 'var(--success)', color: 'var(--success)' }}>Edit Component</Link>
                                                <button onClick={() => handleDeleteEvent(evt._id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: 'var(--error)', color: 'var(--error)' }}>Destruct</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {user?.role === 'admin' && (
                <div style={{ marginTop: '4rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Pending Event Approvals</h3>

                    {pendingAdminEvents.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No events are currently awaiting approval.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {pendingAdminEvents.map(evt => (
                                <motion.div key={evt._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{evt.title} <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>PENDING</span></h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                            Requested by: <span style={{ color: 'var(--text-primary)' }}>{evt.organizer?.name || 'Unknown'}</span> • {new Date(evt.date).toDateString()} | {evt.eventType}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Link to={`/events/${evt._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Preview</Link>
                                        <button onClick={() => handleApproveEvent(evt._id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--success)' }}>
                                            Approve & Publish
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// Quick stub for missing FiUsers
const FiUsers = (props) => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={props.size} width={props.size} xmlns="http://www.w3.org/2000/svg" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default Dashboard;
