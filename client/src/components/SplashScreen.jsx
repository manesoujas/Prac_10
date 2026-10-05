import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3200); // Wait 3.2 seconds total before exiting
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Background ambient glowing orb */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        width: '300px', height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 70%)',
                        filter: 'blur(30px)'
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 10 }}>
                    {/* The "CE" Icon */}
                    <motion.div
                        initial={{ x: -100, opacity: 0, rotate: -90 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '4.5rem',
                            fontWeight: 900,
                            letterSpacing: '-2px'
                        }}
                    >
                        CE
                    </motion.div>

                    {/* The "CampusEvents" Text */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        transition={{ ease: "circOut", duration: 0.8, delay: 0.8 }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                        <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                            Campus<span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Events</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Subtitle mapping below */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    style={{ marginTop: '1.5rem', color: 'var(--accent-primary)', fontSize: '1.1rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600 }}
                >
                    Initializing Architecture
                </motion.div>

                {/* Loader Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '200px' }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                    style={{ height: '2px', background: 'var(--accent-gradient)', marginTop: '2rem', borderRadius: '2px' }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default SplashScreen;
