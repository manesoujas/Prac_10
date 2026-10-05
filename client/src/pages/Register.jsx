import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student', college: '', course: '', year: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/auth/register', formData);
            login(data.data);
            toast.success('Registration successful! Welcome to CampusEvents.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', rowGap: '0' }}>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" required className="form-input" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" required className="form-input" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Password</label>
                        <input type="password" name="password" required className="form-input" value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">College/University</label>
                        <input type="text" name="college" required className="form-input" value={formData.college} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Course/Branch</label>
                        <input type="text" name="course" className="form-input" value={formData.course} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Year of Study</label>
                        <input type="text" name="year" className="form-input" placeholder="e.g. 2nd Year" value={formData.year} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">I am a...</label>
                        <select name="role" required className="form-input" value={formData.role} onChange={handleChange} style={{ appearance: 'none', backgroundColor: 'var(--bg-secondary)' }}>
                            <option value="student">Student/Participant</option>
                            <option value="organizer">Event Organizer</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
