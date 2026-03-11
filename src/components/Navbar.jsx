import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Zap, BookOpen, Home, MessageSquare, User, LayoutGrid, Bell, Search, Camera, Lock, Crown } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Navbar.css';

const CHAT_LAST_SEEN_KEY = 'chat_last_seen';
const NOTICES_LAST_SEEN_KEY = 'notices_last_seen';

const Navbar = () => {
    const [session, setSession] = useState(null);
    const [userName, setUserName] = useState('');
    const [showGuestModal, setShowGuestModal] = useState(false);

    const [unreadChat, setUnreadChat] = useState(0);
    const [unreadNotices, setUnreadNotices] = useState(0);

    const location = useLocation();

    // ─── Auth ────────────────────────────────────────────────────────────
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    // If refresh token is invalid, clear global session
                    if (error.message.includes('refresh_token_not_found') || error.message.includes('Refresh Token Not Found')) {
                        await supabase.auth.signOut();
                        return;
                    }
                    throw error;
                }
                setSession(session);
                if (session?.user?.user_metadata?.full_name)
                    setUserName(session.user.user_metadata.full_name);
            } catch (err) {
                console.warn('Auth session check failed:', err.message);
                setSession(null);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUserName(session?.user?.user_metadata?.full_name || '');
        });

        return () => subscription.unsubscribe();
    }, []);

    // ─── Unread CHAT count ────────────────────────────────────────────────
    const fetchUnreadChat = useCallback(async () => {
        if (!session) { setUnreadChat(0); return; }
        const lastSeen = localStorage.getItem(CHAT_LAST_SEEN_KEY) || new Date(0).toISOString();
        const { count, error } = await supabase
            .from('chat_messages')
            .select('id', { count: 'exact', head: true })
            .eq('room_id', 'global')
            .neq('user_id', session.user.id)
            .gt('created_at', lastSeen);
        if (!error) setUnreadChat(count ?? 0);
    }, [session]);

    // ─── Unread NOTICES count ─────────────────────────────────────────────
    const fetchUnreadNotices = useCallback(async () => {
        const lastSeen = localStorage.getItem(NOTICES_LAST_SEEN_KEY) || new Date(0).toISOString();
        const { count, error } = await supabase
            .from('notices')
            .select('id', { count: 'exact', head: true })
            .gt('created_at', lastSeen);
        if (!error) setUnreadNotices(count ?? 0);
    }, []);

    // Initial fetch
    useEffect(() => { fetchUnreadChat(); }, [fetchUnreadChat]);
    useEffect(() => { fetchUnreadNotices(); }, [fetchUnreadNotices]);

    // ─── Mark as seen on route change ─────────────────────────────────────
    useEffect(() => {
        if (location.pathname === '/chat') {
            localStorage.setItem(CHAT_LAST_SEEN_KEY, new Date().toISOString());
            setUnreadChat(0);
        }
        if (location.pathname === '/notices') {
            localStorage.setItem(NOTICES_LAST_SEEN_KEY, new Date().toISOString());
            setUnreadNotices(0);
        }
    }, [location.pathname]);

    // ─── Real-time: new CHAT messages ─────────────────────────────────────
    useEffect(() => {
        if (!session) return;
        const channel = supabase
            .channel('navbar-chat-watch')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'room_id=eq.global' },
                (payload) => {
                    if (payload.new.user_id !== session.user.id && window.location.pathname !== '/chat') {
                        setUnreadChat(prev => prev + 1);
                    }
                }
            )
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, [session]);

    // ─── Real-time: new NOTICES ───────────────────────────────────────────
    useEffect(() => {
        const channel = supabase
            .channel('navbar-notices-watch')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notices' },
                () => {
                    if (window.location.pathname !== '/notices') {
                        setUnreadNotices(prev => prev + 1);
                    }
                }
            )
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    // ─── Link Interceptor ──────────────────────────────────────────────────
    const handleNavbarClick = (path) => (e) => {
        // 1. If currently on this page, disable click
        if (location.pathname === path) {
            e.preventDefault();
            return;
        }

        // 2. Restricted path logic
        const restrictedPaths = ['/chat', '/notices', '/study'];
        if (restrictedPaths.includes(path) && !session) {
            e.preventDefault();
            setShowGuestModal(true);
        }
    };

    const chatBadge = unreadChat > 99 ? '99+' : unreadChat;
    const noticesBadge = unreadNotices > 99 ? '99+' : unreadNotices;

    return (
        <>
            {/* ── Mobile Top Header ── */}
            <div className="mobile-header">
                <Link to="/" className="mobile-logo" onClick={handleNavbarClick('/')}>
                    <Zap size={24} className="logo-icon" />
                </Link>
                <div className="mobile-search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search resources..." className="search-input" />
                </div>
                <div className="mobile-header-actions">
                    {/* Bell with unread notices badge */}
                    <NavLink to="/notices" className="action-btn" onClick={handleNavbarClick('/notices')}>
                        <div className="nav-icon-wrap">
                            <Bell size={22} />
                            {unreadNotices > 0 && (
                                <span className="nav-unread-badge">{noticesBadge}</span>
                            )}
                        </div>
                    </NavLink>
                    {session ? (
                        <NavLink to="/profile" className="profile-btn-nav logged-in" onClick={handleNavbarClick('/profile')}>
                            <span className="user-firstname">{userName?.split(' ')[0] || 'Profile'}</span>
                            <User size={22} />
                        </NavLink>
                    ) : (
                        <NavLink to="/login" className="mobile-signin-btn" onClick={handleNavbarClick('/login')}>Sign In</NavLink>
                    )}
                </div>
            </div>

            {/* ── Desktop Navbar ── */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo">
                        <Zap className="logo-icon" />
                        <span>EEvolution <span className="highlight">2.0</span></span>
                    </Link>
                </div>

                <div className="desktop-search">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search resources..." className="search-input" />
                </div>

                <div className="navbar-links">
                    <NavLink to="/" end className="nav-link" onClick={handleNavbarClick('/')}>
                        <Home size={20} /><span>Home</span>
                    </NavLink>
                    <NavLink to="/study" className="nav-link" onClick={handleNavbarClick('/study')}>
                        <BookOpen size={20} /><span>Study</span>
                    </NavLink>
                    <NavLink to="/explore" className="nav-link" onClick={handleNavbarClick('/explore')}>
                        <LayoutGrid size={24} className="explore-btn-icon" /><span>Explore</span>
                    </NavLink>

                    {/* Chat with unread badge */}
                    <NavLink to="/chat" className="nav-link" onClick={handleNavbarClick('/chat')}>
                        <div className="nav-icon-wrap">
                            <MessageSquare size={20} />
                            {session && unreadChat > 0 && (
                                <span className="nav-unread-badge">{chatBadge}</span>
                            )}
                        </div>
                        <span>Chat</span>
                    </NavLink>

                    <NavLink to="/pricing" className="nav-link plan-nav-highlight" onClick={handleNavbarClick('/pricing')}>
                        <Crown size={20} /><span>Plans</span>
                    </NavLink>

                    {/* Desktop Actions */}
                    <div className="desktop-actions">
                        {/* Bell with unread notices badge */}
                        <NavLink to="/notices" className="nav-action-btn desktop-notice" onClick={handleNavbarClick('/notices')}>
                            <div className="nav-icon-wrap">
                                <Bell size={20} />
                                {unreadNotices > 0 && (
                                    <span className="nav-unread-badge">{noticesBadge}</span>
                                )}
                            </div>
                        </NavLink>
                        <NavLink 
                            to={session ? '/profile' : '/login'} 
                            className="nav-profile-link" 
                            onClick={handleNavbarClick(session ? '/profile' : '/login')}
                        >
                            <User size={20} />
                            <span>{session ? (userName?.split(' ')[0] || 'Profile') : 'Sign In'}</span>
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Global Guest Modal */}
            {showGuestModal && (
                <div className="guest-modal-overlay nav-modal-overlay" onClick={() => setShowGuestModal(false)}>
                    <div className="guest-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon"><Lock size={40} /></div>
                        <h3>Join the Community</h3>
                        <p>This section is reserved for our student batch. Sign in to access notices, chat with peers, and view memories.</p>
                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => setShowGuestModal(false)}>Maybe Later</button>
                            <Link to="/login" className="primary-btn" onClick={() => setShowGuestModal(false)}>Sign In Now</Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
