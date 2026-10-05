import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="text-gradient">
                    <h2 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        CE
                        <span style={{ fontSize: '1.25rem', background: 'transparent', WebkitTextFillColor: 'initial', color: 'white' }}>CampusEvents</span>
                    </h2>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Discover</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Welcome, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', background: 'transparent' }} title="Logout">
                                    <FiLogOut size={20} color="var(--error)" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Sign In</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
