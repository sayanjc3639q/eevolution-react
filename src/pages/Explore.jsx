import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    Zap, BookOpen, MessageSquare, Image, Bell,
    Calendar, Heart, ShieldCheck, ArrowRight, LayoutGrid, FileText,
    TreePalm, Coffee, Landmark, Info, Lock
} from 'lucide-react';
import './Explore.css';

const Explore = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    // Mocking admin status
    const isAdmin = false;

    const [showGuestModal, setShowGuestModal] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

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
                { title: "Study Hub", icon: <BookOpen />, className: "f-icon", link: "/study", badge: "Core", size: "large" },
                { title: "Class Notes", icon: <Zap />, className: "f-icon gold", link: "/study/class-notes", highlight: true, size: "wide" },
                { title: "Class Routine", icon: <Calendar />, className: "f-icon", link: "/routine" },
                { title: "Syllabus", icon: <FileText />, className: "f-icon", link: "/syllabus", isPublic: true },
            ]
        },
        {
            group: "Resources & Utility",
            badge: "Utilities",
            items: [
                { title: "Holiday Calendar", icon: <TreePalm />, className: "f-icon", link: "/holidays", isPublic: true },
                { title: "WhatsApp Groups", icon: <MessageSquare />, className: "f-icon gold", link: "/whatsapp-links", highlight: true, badge: "Community", size: "wide" },
                { title: "Official Notices", icon: <Bell />, className: "f-icon", link: "/notices" },
                { title: "College Events", icon: <LayoutGrid />, className: "f-icon", link: "/events" },
            ]
        },
        {
            group: "Support & Community",
            badge: "Ecosystem",
            items: [
                { title: "Support Us", icon: <Coffee />, className: "f-icon highlight-coffee", link: "/support", badge: "Help", size: "large" },
                { title: "Donators Hall", icon: <Landmark />, className: "f-icon", link: "/donators" },
                { title: "Top Contributors", icon: <Heart />, className: "f-icon", link: "/contributors" },
                { title: "Batch Memories", icon: <Image />, className: "f-icon", link: "/memories", size: "wide" },
                { title: "About Us", icon: <Info />, className: "f-icon", link: "/about", isPublic: true },
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
                    <div key={gIdx} className="feature-group">
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
                                    className={`feature-card ${item.status ? 'locked' : ''} ${(!session && !item.isPublic) ? 'guest-locked' : ''} ${item.highlight ? 'featured' : ''} ${item.size || ''}`}
                                >
                                    <div className="card-glow" />
                                    <div className="icon-wrapper">
                                        {React.cloneElement(item.icon, { size: 28, className: item.className })}
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title">{item.title}</span>
                                        {!session && !item.isPublic && (
                                            <span className="status-badge sign-in-alert">
                                                <Lock size={12} style={{ marginRight: '4px' }} />
                                                Members Only
                                            </span>
                                        )}
                                        {session && item.status && <span className="status-badge">{item.status}</span>}
                                        {item.badge && <span className="mini-badge-inline">{item.badge}</span>}
                                    </div>
                                    {session && !item.status && <ArrowRight size={20} className="arrow-icon" />}
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
                                    <ShieldCheck size={28} className="f-icon" />
                                </div>
                                <div className="card-content">
                                    <span className="card-title text-admin">Admin Panel</span>
                                    <span className="status-badge">Restricted Access</span>
                                </div>
                                <ArrowRight size={20} className="arrow-icon" />
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
