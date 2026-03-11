import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    Zap, BookOpen, MessageSquare, Image, Bell,
    Calendar, Heart, ShieldCheck, ArrowRight, LayoutGrid, FileText,
    TreePalm, Coffee, Landmark, Info, Lock, Star, ChevronRight
} from 'lucide-react';
import './Explore.css';

const Explore = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    // Mocking admin status
    const isAdmin = false;

    const [showGuestModal, setShowGuestModal] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    if (error.message.includes('refresh_token_not_found') || error.message.includes('Refresh Token Not Found')) {
                        await supabase.auth.signOut();
                    }
                    return;
                }
                setSession(session);
                setLoading(false);
            } catch (err) {
                console.warn('Explore session check failed:', err);
                setLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [loading]);

    const handleCardClick = (e, item) => {
        if (!session && !item.isPublic) {
            e.preventDefault();
            setShowGuestModal(true);
        }
    };
    const featureGroups = [
        {
            group: "Learning & Academic",
            badge: "Academics",
            items: [
                { title: "Study Hub", icon: <BookOpen />, description: "Central repository for all subject notes and syllabus.", link: "/study", badge: "Core" },
                { title: "Class Notes", icon: <Zap />, description: "Subject-wise class notes updated by the batch.", link: "/study/class-notes", highlight: true },
                { title: "Class Routine", icon: <Calendar />, description: "Weekly schedule for classes and lab sessions.", link: "/routine" },
                { title: "Syllabus", icon: <FileText />, description: "Detailed module structure for current semester.", link: "/syllabus", isPublic: true },
            ]
        },
        {
            group: "Resources & Utility",
            badge: "Utilities",
            items: [
                { title: "Holiday Calendar", icon: <TreePalm />, description: "List of official and unofficial holidays.", link: "/holidays", isPublic: true },
                { title: "WhatsApp Groups", icon: <MessageSquare />, description: "Connect with subject-specific discussion groups.", link: "/whatsapp-links", highlight: true, badge: "Community" },
                { title: "Official Notices", icon: <Bell />, description: "Latest updates and announcements from college.", link: "/notices" },
                { title: "College Events", icon: <LayoutGrid />, description: "Explore fests, workshops, and extracurriculars.", link: "/events" },
            ]
        },
        {
            group: "Support & Community",
            badge: "Ecosystem",
            items: [
                { title: "Support Us", icon: <Coffee />, description: "Help maintain and grow the EEvolution platform.", link: "/support", badge: "Help" },
                { title: "Donators Hall", icon: <Landmark />, description: "List of visionaries who powered the platform.", link: "/donators" },
                { title: "Top Contributors", icon: <Heart />, description: "Recognition of students sharing study materials.", link: "/contributors" },
                { title: "Batch Memories", icon: <Image />, description: "A digital album of our collective journey.", link: "/memories", badge: "New" },
                { title: "About Us", icon: <Info />, description: "Know the team and mission behind EEvolution.", link: "/about", isPublic: true },
            ]
        }
    ];

    const handleMouseMove = (e) => {
        const cards = document.getElementsByClassName('feature-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    return (
        <div className="explore-container compact">
            <div className="explore-content">
                {featureGroups.map((group, gIdx) => (
                    <div key={gIdx} className="feature-group reveal">
                        <div className="group-header">
                            <span className="mini-badge">{group.badge}</span>
                            <h2 className="group-label-modern">{group.group}</h2>
                        </div>
                        <div className="feature-grid-bento" onMouseMove={handleMouseMove}>
                            {group.items.map((item, iIdx) => (
                                <Link
                                    key={iIdx}
                                    to={(!session && !item.isPublic) ? '#' : (item.status ? '#' : item.link)}
                                    onClick={(e) => handleCardClick(e, item)}
                                    className={`feature-card ${item.status ? 'locked' : ''} ${(!session && !item.isPublic) ? 'guest-locked' : ''} ${item.highlight ? 'featured' : ''}`}
                                >
                                    <div className="icon-wrapper">
                                        {React.cloneElement(item.icon, { size: 24 })}
                                    </div>
                                    <div className="card-content">
                                        <div className="card-main-info">
                                            <span className="card-title">{item.title}</span>
                                            <p className="card-desc">{item.description}</p>
                                        </div>
                                        {item.badge && <span className="mini-badge-inline">{item.badge}</span>}
                                        {!session && !item.isPublic && (
                                            <span className="status-badge sign-in-alert">
                                                <Lock size={12} style={{ marginRight: '4px' }} />
                                                Members Only
                                            </span>
                                        )}
                                        {session && item.status && <span className="status-badge">{item.status}</span>}
                                    </div>
                                    <ChevronRight size={20} className="arrow-icon" />
                                    {item.highlight && <div className="star-tag"><Star size={10} fill="white" /> HOT</div>}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Admin Panel Only Visible to Admin */}
                {isAdmin && (
                    <div className="feature-group">
                        <h2 className="group-label">Management</h2>
                        <div className="feature-grid" onMouseMove={handleMouseMove}>
                            <Link to="/admin" className="feature-card admin-card">
                                <div className="icon-wrapper">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="card-content">
                                    <div className="card-main-info">
                                        <span className="card-title text-admin">Admin Panel</span>
                                        <p className="card-desc">Restricted access for platform management.</p>
                                    </div>
                                    <span className="status-badge">Restricted Access</span>
                                </div>
                                <ChevronRight size={20} className="arrow-icon" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Guest Access Modal */}
            {showGuestModal && (
                <div className="guest-modal-overlay" onClick={() => setShowGuestModal(false)}>
                    <div className="guest-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">
                            <Lock size={40} />
                        </div>
                        <h3>Access Restricted</h3>
                        <p>
                            Join the EEvolution community to access premium study resources,
                            class notes, and batch-exclusive features.
                        </p>
                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => setShowGuestModal(false)}>Maybe Later</button>
                            <Link to="/login" className="primary-btn">Sign In Now</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explore;
