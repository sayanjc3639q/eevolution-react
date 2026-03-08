import React from 'react';
import { Link } from 'react-router-dom';
import {
    Zap, BookOpen, MessageSquare, Image, Bell,
    Calendar, Heart, ShieldCheck, ChevronRight, LayoutGrid, FileText,
    TreePalm, Coffee, Landmark
} from 'lucide-react';
import './Explore.css';

const Explore = () => {
    // Mocking admin status - this will later come from Supabase Auth
    const isAdmin = false;

    const featureGroups = [
        {
            group: "Learning & Academic",
            items: [
                { title: "Study Hub", icon: <BookOpen />, className: "f-icon", link: "/study", badge: "Core" },
                { title: "Class Notes", icon: <Zap />, className: "f-icon gold", link: "/study/class-notes", highlight: true },
                { title: "Class Routine", icon: <Calendar />, className: "f-icon", link: "/routine" },
                { title: "Syllabus", icon: <FileText />, className: "f-icon", link: "/syllabus" },
            ]
        },
        {
            group: "Resources & Utility",
            items: [
                { title: "Holiday Calendar", icon: <TreePalm />, className: "f-icon", link: "/holidays" },
                { title: "WhatsApp Groups", icon: <MessageSquare />, className: "f-icon gold", link: "/whatsapp-links", highlighted: true, badge: "Community" },
                { title: "Official Notices", icon: <Bell />, className: "f-icon", link: "/notices" },
                { title: "College Events", icon: <LayoutGrid />, className: "f-icon", link: "/events" },
            ]
        },
        {
            group: "Support & Community",
            items: [
                { title: "Support Us", icon: <Coffee />, className: "f-icon highlight-coffee", link: "/support", badge: "Help" },
                { title: "Donators Hall", icon: <Landmark />, className: "f-icon", link: "/donators" },
                { title: "Top Contributors", icon: <Heart />, className: "f-icon", link: "/contributors" },
                { title: "Batch Memories", icon: <Image />, className: "f-icon", link: "/memories" },
            ]
        },
        {
            group: "Student Progress",
            items: [
                { title: "MAR Points", icon: <ShieldCheck />, className: "f-icon", link: "/tracker/mar" },
                { title: "MOOCs Record", icon: <ShieldCheck />, className: "f-icon", link: "/tracker/moocs" },
            ]
        }
    ];

    return (
        <div className="explore-container compact">


            <div className="explore-content">
                {featureGroups.map((group, gIdx) => (
                    <div key={gIdx} className="feature-group">
                        <h2 className="group-label">{group.group}</h2>
                        <div className="feature-grid">
                            {group.items.map((item, iIdx) => (
                                <Link
                                    key={iIdx}
                                    to={item.status ? '#' : item.link}
                                    className={`feature-card ${item.status ? 'locked' : ''} ${item.highlight ? 'featured' : ''}`}
                                >
                                    <div className="icon-wrapper">
                                        {React.cloneElement(item.icon, { size: 22, className: item.className })}
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title">{item.title}</span>
                                        {item.status && <span className="status-badge">{item.status}</span>}
                                        {item.badge && <span className="mini-badge-inline">{item.badge}</span>}
                                    </div>
                                    {!item.status && <ChevronRight size={18} className="arrow-icon" />}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Admin Panel Only Visible to Admin */}
                {isAdmin && (
                    <div className="feature-group">
                        <h2 className="group-label">Management</h2>
                        <div className="feature-grid">
                            <Link to="/admin" className="feature-card admin-card">
                                <div className="icon-wrapper">
                                    <ShieldCheck size={24} className="f-icon" />
                                </div>
                                <span className="card-title text-admin">Admin Panel</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
