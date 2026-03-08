import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Zap, BookOpen, Home, MessageSquare, User, LayoutGrid, Bell, Search, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Navbar.css';

const Navbar = () => {
    const [session, setSession] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.user_metadata?.full_name) {
                setUserName(session.user.user_metadata.full_name);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.user_metadata?.full_name) {
                setUserName(session.user.user_metadata.full_name);
            } else {
                setUserName('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            {/* Mobile Top Header - Only visible on small screens */}
            <div className="mobile-header">
                <Link to="/" className="mobile-logo">
                    <Zap size={24} className="logo-icon" />
                </Link>
                <div className="mobile-search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search resources..." className="search-input" />
                </div>
                <div className="mobile-header-actions">
                    <NavLink to="/notices" className="action-btn">
                        <Bell size={22} />
                        <span className="notification-dot"></span>
                    </NavLink>
                    {session ? (
                        <NavLink to="/profile" className="profile-btn-nav logged-in">
                            <span className="user-firstname">{userName?.split(' ')[0] || 'Profile'}</span>
                            <User size={22} />
                        </NavLink>
                    ) : (
                        <NavLink to="/login" className="mobile-signin-btn">
                            Sign In
                        </NavLink>
                    )}
                </div>
            </div>

            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo">
                        <Zap className="logo-icon" />
                        <span>EEvolution <span className="highlight">2.0</span></span>
                    </Link>
                </div>

                {/* Desktop Search Bar (Hidden on Mobile) */}
                <div className="desktop-search">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search resources..." className="search-input" />
                </div>

                <div className="navbar-links">
                    <NavLink to="/" end className="nav-link">
                        <Home size={20} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/study" className="nav-link">
                        <BookOpen size={20} />
                        <span>Study</span>
                    </NavLink>
                    <NavLink to="/explore" className="nav-link">
                        <LayoutGrid size={24} className="explore-btn-icon" />
                        <span>Explore</span>
                    </NavLink>
                    <NavLink to="/chat" className="nav-link">
                        <MessageSquare size={20} />
                        <span>Chat</span>
                    </NavLink>
                    <NavLink to="/memories" className="nav-link">
                        <Camera size={20} />
                        <span>Memories</span>
                    </NavLink>

                    {/* Desktop Actions Only */}
                    <div className="desktop-actions">
                        <NavLink to="/notices" className="nav-action-btn desktop-notice">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </NavLink>
                        <NavLink to={session ? "/profile" : "/login"} className="nav-profile-link">
                            <User size={20} />
                            <span>{session ? (userName?.split(' ')[0] || 'Profile') : 'Sign In'}</span>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
