import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiUsers, FiCode, FiMusic, FiAward, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = '/api/events';
                const params = [];
                if (searchTerm) params.push(`search=${searchTerm}`);
                if (categoryFilter) params.push(`category=${categoryFilter}`);
                if (params.length > 0) url += `?${params.join('&')}`;

                const { data } = await axios.get(url);
                setEvents(data.data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [searchTerm, categoryFilter]);

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    return (
        <div className="container" style={{ overflowX: 'hidden' }}>
            {/* HERO SECTION */}
            <motion.header
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ textAlign: 'center', padding: '6rem 0', position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '150%', height: '100%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 }}></div>

                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 800 }}>
                    Discover. Participate. <br /><span className="text-gradient">Organize.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
                    The ultimate ecosystem for college events, hackathons, and global competitions.
                    Unlock your potential and never miss an opportunity again.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }}>
                        Join CampusEvents Free
                    </Link>
                </motion.div>
            </motion.header>

            {/* QUICK STATS SECTION */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '6rem' }}
            >
                {[
                    { number: '10k+', label: 'Active Students' },
                    { number: '500+', label: 'Live Events' },
                    { number: '50+', label: 'Universities' },
                    { number: '₹2M+', label: 'Prizes Won' }
                ].map((stat, i) => (
                    <motion.div key={i} variants={fadeInUp} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.number}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</p>
                    </motion.div>
                ))}
            </motion.section>

            {/* BROWSE BY CATEGORY SECTION */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                style={{ marginBottom: '6rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Browse <span className="text-gradient">Categories</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>Explore events structured perfectly for your specific technical or cultural domain.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Technical', icon: <FiCode size={30} />, color: '#6366f1' },
                        { title: 'Hackathon', icon: <FiAward size={30} />, color: '#d946ef' },
                        { title: 'Cultural', icon: <FiMusic size={30} />, color: '#fb7185' },
                        { title: 'Workshop', icon: <FiBookOpen size={30} />, color: '#10b981' }
                    ].map((cat, i) => (
                        <motion.div
                            key={i} whileHover={{ y: -10, boxShadow: `0 10px 30px -10px ${cat.color}` }}
                            className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', borderTop: `4px solid ${cat.color}`, cursor: 'pointer' }}
                            onClick={() => setCategoryFilter(cat.title)}
                        >
                            <div style={{ color: cat.color, marginBottom: '1rem' }}>{cat.icon}</div>
                            <h3 style={{ margin: 0 }}>{cat.title}</h3>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* LIVE EVENTS EXPLORER SECTION */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                style={{ marginBottom: '6rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Live Explorer
                            <span className="badge badge-info" style={{ fontSize: '1rem', padding: '0.4rem 1rem', borderRadius: '50px' }}>{events.length}</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Search across the entire platform's live listings.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                        <input
                            type="text" placeholder="Search events..." className="form-input"
                            style={{ flex: '1 1 250px', background: 'transparent', border: 'none', boxShadow: 'none' }}
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                        <select className="form-input" style={{ appearance: 'none', flex: '1 1 180px', background: 'transparent', border: 'none', boxShadow: 'none', color: 'var(--text-secondary)' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="Technical">Technical</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                        Fetching latest opportunities...
                    </motion.div>
                ) : events.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                            <FiCalendar size={60} color="var(--text-muted)" />
                        </div>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>No configurations matched your filters</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>Try adjusting your search terminology or removing category constraints.</p>
                        <button onClick={() => { setSearchTerm(''); setCategoryFilter(''); }} className="btn btn-outline" style={{ marginTop: '2rem' }}>Clear Filters</button>
                    </div>
                ) : (
                    <motion.div
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}
                    >
                        {events.map((evt, index) => {
                            // Dynamic Image Assignment Engine
                            let imageUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // fallback
                            const lowerCat = evt.category?.toLowerCase() || '';
                            if (lowerCat.includes('hackathon') || lowerCat.includes('code')) {
                                imageUrl = `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${index}`;
                            } else if (lowerCat.includes('tech') || lowerCat.includes('workshop')) {
                                imageUrl = `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${index}`;
                            } else if (lowerCat.includes('cultural') || lowerCat.includes('music')) {
                                imageUrl = `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${index}`;
                            } else if (lowerCat.includes('sports')) {
                                imageUrl = `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${index}`;
                            }

                            return (
                                <motion.div key={evt._id} variants={fadeInUp}>
                                    <Link to={`/events/${evt._id}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
                                        <div style={{ height: '220px', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,17,19,1), rgba(0,0,0,0.1))' }}></div>
                                            <span style={{ position: 'absolute', top: '15px', right: '15px', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>{evt.category}</span>
                                        </div>
                                        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <span className={`badge ${evt.registrationFee === 0 ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.4rem 0.8rem' }}>
                                                    {evt.registrationFee === 0 ? 'FREE ENTRY' : `₹${evt.registrationFee}`}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{evt.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                                                {evt.shortDescription}
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                                    <FiCalendar size={16} color="var(--accent-primary)" /> {new Date(evt.date).toDateString()} • {evt.startTime}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <FiMapPin size={16} color="var(--accent-secondary)" /> {evt.venue}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </motion.section>

            {/* CTA SECTION */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                style={{ textAlign: 'center', padding: '6rem 2rem', background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(217,70,239,0.05))', borderRadius: 'var(--radius-xl)', marginBottom: '4rem', border: '1px solid rgba(255,255,255,0.05)' }}
            >
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to host your own?</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem' }}>
                    Join hundreds of organizers utilizing CampusEvents to scale their footprints effortlessly. Generate dynamic QR tickets natively out-of-the-box.
                </p>
                <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}>Become an Organizer</Link>
            </motion.section>
        </div>
    );
};

export default Home;
