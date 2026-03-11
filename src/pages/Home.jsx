import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    Zap, BookOpen, MessageSquare, Bell, ShieldCheck,
    TrendingUp, Award, Globe, Heart, Star, Quote, ArrowRight,
    Users, Clock, Calendar, Upload, Coins,
    Coffee, Sun, Moon, Sunrise, PartyPopper, ChevronRight,
    FileText, Landmark, CheckCircle2
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const [status, setStatus] = useState('loading');
    const [session, setSession] = useState(null);


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
                setStatus('ready');
            } catch (err) {
                console.warn('Home session check failed:', err);
                setStatus('ready'); // Still allow guest view
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (status !== 'ready') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [status, session]);

    if (status === 'loading') return null;

    // Guest Landing Page View
    const GuestView = () => (
        <div className="guest-home">
            {/* Hero Section */}
            <section className="guest-hero reveal">
                <h1>EEvolution <span style={{ color: 'var(--accent-color)' }}>2.0</span></h1>
                <p>The pioneering digital ecosystem for Electrical Engineering Batch 2. Built for excellence, designed for evolution.</p>
                <div className="hero-btns">
                    <Link to="/login" className="primary-btn">Get Started</Link>
                    <Link to="/explore" className="secondary-btn">Explore Hub</Link>
                </div>
                <div className="hero-scroll-indicator" style={{ marginTop: '2rem', opacity: 0.5 }}>
                    <ArrowRight size={24} style={{ transform: 'rotate(90deg)' }} />
                </div>
            </section>

            {/* Redesigned Features Section */}
            <section className="features-section reveal">
                <div className="features-header">
                    <span className="badge">Platform Features</span>
                    <h2>Evolving the way you study</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card study-hub">
                        <div className="card-visual">
                            <div className="book-stack">
                                <div className="book book-1"></div>
                                <div className="book book-2"></div>
                                <div className="book book-3"></div>
                            </div>
                        </div>
                        <div className="card-info">
                            <div className="icon-badge"><BookOpen size={24} /></div>
                            <h3>Study Hub</h3>
                            <p>Handwritten notes, PYQs, and daily class materials organized by semester.</p>
                            <Link to="/explore" className="card-link">Enter Hub <ArrowRight size={16} /></Link>
                        </div>
                    </div>

                    <div className="showcase-side">
                        <div className="showcase-card live-alerts">
                            <div className="card-info">
                                <div className="icon-badge"><Bell size={24} /></div>
                                <h3>Live Alerts</h3>
                                <p>Real-time updates on schedule changes and exam news.</p>
                            </div>
                            <div className="alerts-visual">
                                <div className="alert-item">
                                    <div className="ping"></div>
                                    <span>Class Canceled</span>
                                </div>
                                <div className="alert-item delay">
                                    <div className="ping"></div>
                                    <span>Exam Dates Out</span>
                                </div>
                            </div>
                        </div>

                        <div className="showcase-card batch-feed">
                            <div className="card-info">
                                <div className="icon-badge"><MessageSquare size={24} /></div>
                                <h3>Batch Feed</h3>
                                <p>Collaborate and share memories with your batchmates.</p>
                            </div>
                            <div className="feed-visual">
                                <div className="avatar">JD</div>
                                <div className="avatar">AS</div>
                                <div className="avatar">RK</div>
                                <div className="avatar-plus">+48</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legacy Section */}
            <section className="legacy-section">
                <div className="legacy-container">
                    <div className="legacy-visual">
                        <div className="visual-glow"></div>
                        <div className="visual-card main-card">
                            <div className="visual-badge">EST. 2026</div>
                            <h3>Batch 2</h3>
                            <p>Electrical Engineering</p>
                        </div>
                        <div className="visual-card sub-card delay-1">
                            <TrendingUp color="var(--accent-color)" size={28} />
                            <span>Pioneering</span>
                        </div>
                        <div className="visual-card sub-card delay-2">
                            <Award color="var(--accent-color)" size={28} />
                            <span>Excellence</span>
                        </div>
                    </div>

                    <div className="legacy-content">
                        <span className="badge">Our Manifesto</span>
                        <h2>The EEvolution Legacy</h2>
                        <div className="legacy-text">
                            <p>
                                EEvolution 2.0 stands as a pioneering digital ecosystem, serving as a dedicated hub for department study.
                                It was built to solve the chaos of lost files and fragmented communications, providing a professional hub for students to excel.
                            </p>
                            <p>
                                Our mission is to bridge the gap between traditional academics and modern digital accessibility.
                                By centralizing resources, providing real-time schedule alerts, and fostering a collaborative batch feed,
                                we've created a workspace where knowledge flows freely.
                            </p>
                            <p>
                                Together, we are not just studying; we are evolving the way we learn.
                                This project is a testament to the collective spirit of Batch 2, setting a new benchmark for departmental digitalization.
                            </p>
                        </div>
                        <div className="legacy-actions">
                            <div className="stat-pill">
                                <Users size={18} />
                                <span>Student-led Initiative</span>
                            </div>
                            <div className="stat-pill">
                                <Zap size={18} />
                                <span>Digital Ecosystem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Redesigned Donator Section - Hall of Fame */}
            <section className="pioneer-section">
                <div className="pioneer-header">
                    <span className="pioneer-badge">Legacy Support</span>
                    <h2>Pioneer Hall of Fame</h2>
                    <p>The visionaries whose contributions powered the EEvolution.</p>
                </div>

                <div className="pioneer-grid">
                    <div className="pioneer-card top-contributor">
                        <div className="tier-tag"><Heart size={14} fill="currentColor" /> Top Contributor</div>

                        <div className="pioneer-image-container">
                            <img
                                src="https://res.cloudinary.com/dytmgybqm/image/upload/v1772395818/Untitled_design_1_edptux.jpg"
                                alt="Sambuddha Samanta"
                                className="pioneer-img"
                            />
                            <div className="verified-crown">
                                <TrendingUp size={20} />
                            </div>
                        </div>

                        <div className="pioneer-info">
                            <h3 className="premium-name">Sambuddha Samanta</h3>
                            <p className="pioneer-tagline">"A valued supporter whose contribution fuels the growth of our departmental ecosystem."</p>

                            <div className="pioneer-stats">
                                <div className="p-stat">
                                    <span>Batch Supporter</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pioneer-mission-note">
                    <div className="mission-icon"><ShieldCheck size={28} /></div>
                    <p>
                        EEvolution 2.0 is a <strong>100% Student-funded</strong> and <strong>Developer-supported</strong> project.
                        While we feature our top supporters, the development and maintenance are sustained by the dev team to keep these resources free for everyone.
                    </p>
                </div>
            </section>

            {/* Redesigned Student Reviews - Voices of EEvolution */}
            <section className="voices-section">
                <div className="section-header center">
                    <span className="section-badge">Student Feedback</span>
                    <h2>Voices from the Batch</h2>
                    <p>Real experiences from students who are evolving their study workflow.</p>
                </div>

                <div className="voices-container">
                    <div className="voice-card">
                        <div className="quote-icon"><Quote size={32} /></div>

                        <div className="voice-rating">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                            ))}
                        </div>

                        <p className="voice-text">
                            "I really loved EEVOLUTION 2.0. It is very helpful, clean, and easy to use.
                            The Upload Section allows everyone to share notes and resources, which makes learning
                            collaborative and supportive."
                        </p>

                        <div className="voice-footer">
                            <div className="voice-avatar">SM</div>
                            <div className="voice-info">
                                <h4>Sathi Mondal</h4>
                                <div className="student-verify">
                                    <ShieldCheck size={12} />
                                    <span>25/EE/088 • Verified Student</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="voice-card">
                        <div className="quote-icon"><Quote size={32} /></div>

                        <div className="voice-rating">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                            ))}
                        </div>

                        <p className="voice-text">
                            "Electrical Engineering is a gauntlet. EEvolution replaces the frantic WhatsApp hunt with
                            a clean, no-nonsense hub that respects your sanity. It's a digital lifeline built for the batch."
                        </p>

                        <div className="voice-footer">
                            <div className="voice-avatar secondary">SK</div>
                            <div className="voice-info">
                                <h4>Sohan Kundu</h4>
                                <div className="student-verify">
                                    <ShieldCheck size={12} />
                                    <span>25/EE/106 • Verified Student</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.6 }}>
                <p>© 2026 EEvolution 2.0 - Built by Students for Students</p>
            </footer>
        </div>
    );

    // Logged In User View - with schedule, leaderboards, community
    const UserView = () => {
        const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
        const carouselRef = useRef(null);
        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 60000);
            return () => clearInterval(timer);
        }, []);

        const hour = currentTime.getHours();
        const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
        const GreetIcon = hour < 6 ? Moon : hour < 12 ? Sunrise : hour < 18 ? Sun : Moon;

        // Schedule state
        const [todaySchedule, setTodaySchedule] = useState([]);
        const [scheduleLoading, setScheduleLoading] = useState(true);
        const [isHoliday, setIsHoliday] = useState(null); // null=loading, false=workday, string=holiday name
        const [contributors, setContributors] = useState([]);
        const [donators, setDonators] = useState([]);
        const [recentNotices, setRecentNotices] = useState([]);
        const [recentEvents, setRecentEvents] = useState([]);
        const [recentMaterials, setRecentMaterials] = useState([]);
        const [recentMemory, setRecentMemory] = useState(null);
        const [communityLoading, setCommunityLoading] = useState(true);

        const today = currentTime;
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
        const now = today.getHours() * 60 + today.getMinutes();

        useEffect(() => {
            const loadAll = async () => {
                // Load schedule + holidays + community in parallel
                const [routineRes, holidayRes, contribRes, donatorRes, noticeRes, eventRes, materialRes, memoryRes] = await Promise.all([
                    supabase.from('routines').select('*').eq('day', dayName).order('start_time', { ascending: true }),
                    supabase.from('holidays').select('*').eq('date', dateStr),
                    supabase.from('students').select('id, name, class_roll_no, files_count, avatar_url').gt('files_count', 0).order('files_count', { ascending: false }).limit(3),
                    supabase.from('students').select('id, name, class_roll_no, donation, avatar_url').gt('donation', 0).order('donation', { ascending: false }).limit(3),
                    supabase.from('notices').select('*').order('notice_date', { ascending: false }).limit(3),
                    supabase.from('events').select('*').order('event_date', { ascending: false }).limit(3),
                    supabase.from('study_materials').select('*').order('created_at', { ascending: false }).limit(3),
                    supabase.from('memories').select('*').order('created_at', { ascending: false }).limit(1),
                ]);

                if (!routineRes.error) setTodaySchedule(routineRes.data || []);
                setIsHoliday(holidayRes.data?.length > 0 ? holidayRes.data[0] : false);
                setScheduleLoading(false);

                if (!contribRes.error) setContributors(contribRes.data || []);
                if (!donatorRes.error) setDonators(donatorRes.data || []);
                if (!noticeRes.error) setRecentNotices(noticeRes.data || []);
                if (!eventRes.error) setRecentEvents(eventRes.data || []);
                if (!materialRes.error) setRecentMaterials(materialRes.data || []);
                if (!memoryRes.error && memoryRes.data?.length > 0) setRecentMemory(memoryRes.data[0]);
                setCommunityLoading(false);
            };
            loadAll();
        }, [dayName, dateStr]);

        // Parse "HH:MM" time string to minutes from midnight
        const toMin = (t) => {
            if (!t) return 0;
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const formatTime = (t) => {
            if (!t) return '';
            const [h, m] = t.split(':').map(Number);
            const ampm = h < 12 ? 'AM' : 'PM';
            const hr = h % 12 || 12;
            return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
        };

        const getRowStatus = (item, type) => {
            const start = toMin(type === 'class' ? item.start_time : item.from);
            const end = toMin(type === 'class' ? item.end_time : item.to);
            if (now >= start && now < end) return 'live';
            if (now < start) return 'upcoming';
            return 'done';
        };

        // Build schedule rows with breaks inserted between classes
        const buildRows = () => {
            const rows = [];
            for (let i = 0; i < todaySchedule.length; i++) {
                rows.push({ type: 'class', data: todaySchedule[i] });
                if (i < todaySchedule.length - 1) {
                    const gapStart = toMin(todaySchedule[i].end_time);
                    const gapEnd = toMin(todaySchedule[i + 1].start_time);
                    const gapMin = gapEnd - gapStart;
                    if (gapMin >= 5) {
                        rows.push({ type: 'break', minutes: gapMin, from: todaySchedule[i].end_time, to: todaySchedule[i + 1].start_time });
                    }
                }
            }
            return rows;
        };

        const rows = buildRows();
        const activeIdx = rows.findIndex(r => getRowStatus(r.type === 'class' ? r.data : r, r.type) === 'live');

        // Calculate fallbacks for activeIdx
        let finalActiveIdx = activeIdx;
        if (finalActiveIdx === -1 && rows.length > 0) {
            const firstStart = rows[0].type === 'class' ? toMin(rows[0].data.start_time) : toMin(rows[0].from);
            if (now < firstStart) {
                finalActiveIdx = 0; // Highlight first class if none started
            } else {
                finalActiveIdx = rows.length - 1; // Highlight last if all done
            }
        }

        useEffect(() => {
            if (carouselRef.current && finalActiveIdx !== -1) {
                const container = carouselRef.current;
                const items = container.querySelectorAll('.timeline-item');
                if (items[finalActiveIdx]) {
                    const item = items[finalActiveIdx];
                    const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
                    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }
        }, [finalActiveIdx, scheduleLoading]);

        const rankLabels = ['🥇', '🥈', '🥉'];

        return (
            <div className="user-dashboard">
                {/* --- Welcome Hero --- */}
                <div className="dashboard-hero reveal">
                    <div className="dashboard-hero-content">
                        <div className="greeting-badge">
                            <GreetIcon size={16} /> {greeting}
                        </div>
                        <h1 className="dashboard-title">Welcome back, <span className="highlight">{userName}</span></h1>
                        <p className="dashboard-subtitle">Your central command center for Electrical Engineering.</p>
                    </div>
                </div>

                {/* --- Bento Grid Layout --- */}
                <div className="dashboard-content-wrapper">
                    <div className="dashboard-bento-grid">
                        {/* 1. Today's Schedule (Large) */}
                        <section className="ds-section bento-item schedule-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Calendar size={18} />
                                    <span>Today's Schedule</span>
                                </div>
                                <div className="ds-section-date">
                                    {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </div>
                            </div>

                            {scheduleLoading ? (
                                <div className="schedule-skeleton-list">
                                    {[1, 2, 3].map(n => <div key={n} className="sched-skeleton skeleton-pulse" />)}
                                </div>
                            ) : isWeekend ? (
                                <div className="schedule-off-card weekend">
                                    <div className="schedule-off-icon">🎉</div>
                                    <h3>Weekend — Day Off!</h3>
                                    <p>Kick back, relax. No classes today.</p>
                                </div>
                            ) : isHoliday ? (
                                <div className={`schedule-off-card holiday-type-${isHoliday.type || 'official'}`}>
                                    <div className="schedule-off-icon">
                                        {isHoliday.type === 'unofficial' ? <BookOpen size={48} /> :
                                            isHoliday.type === 'event' ? <Award size={48} /> :
                                                <Sunrise size={48} />}
                                    </div>
                                    <div className="holiday-card-content">
                                        <h3>
                                            {isHoliday.type === 'unofficial' ? 'Prep Day (Stay Home)' :
                                                isHoliday.type === 'event' ? 'Event Day (No Classes)' : 'Official Holiday'}
                                        </h3>
                                        <p className="holiday-name">{isHoliday.name}</p>
                                        <p className="holiday-description">
                                            {isHoliday.type === 'unofficial' ? 'Self-study is advised. Classes are officially off-record.' :
                                                isHoliday.type === 'event' ? 'Engage in extracurriculars! No academic sessions scheduled.' : 'Enjoy your well-deserved break.'}
                                        </p>
                                    </div>
                                </div>
                            ) : todaySchedule.length === 0 ? (
                                <div className="schedule-off-card">
                                    <div className="schedule-off-icon">📭</div>
                                    <h3>No Classes Today</h3>
                                    <p>Nothing scheduled — enjoy the free day!</p>
                                </div>
                            ) : (
                                <div className="schedule-timeline carousel" ref={carouselRef}>
                                    {rows.map((row, idx) => {
                                        const status = getRowStatus(row.type === 'class' ? row.data : row, row.type);
                                        if (row.type === 'break') {
                                            return (
                                                <div key={`break-${idx}`} className={`timeline-item timeline-break status-${status} ${idx === finalActiveIdx ? 'is-active' : ''}`}>
                                                    <div className="break-label">
                                                        <Coffee size={14} />
                                                        <span>Break Time</span>
                                                    </div>
                                                    <div className="break-meta">
                                                        <span>{row.minutes} min · {formatTime(row.from)} – {formatTime(row.to)}</span>
                                                    </div>
                                                    {idx === finalActiveIdx && <div className="active-glow" />}
                                                </div>
                                            );
                                        }
                                        const item = row.data;
                                        return (
                                            <div key={`class-${idx}`} className={`timeline-item timeline-class-card status-${status} ${idx === finalActiveIdx ? 'is-active' : ''}`}>
                                                <div className="card-top">
                                                    {status === 'live' && (
                                                        <div className="live-pill">
                                                            <span className="live-dot" />
                                                            LIVE NOW
                                                        </div>
                                                    )}
                                                    {status === 'done' && (
                                                        <div className="done-mark">
                                                            <CheckCircle2 size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="timeline-time">
                                                    <Clock size={14} />
                                                    <span>{formatTime(item.start_time)} – {formatTime(item.end_time)}</span>
                                                </div>
                                                <div className="timeline-details">
                                                    <h4 className="timeline-subject">{item.subject}</h4>
                                                    <div className="timeline-meta">
                                                        <span className="timeline-prof">👨‍🏫 {item.prof}</span>
                                                        <span className="timeline-room">📍 {item.room}</span>
                                                    </div>
                                                </div>
                                                {idx === finalActiveIdx && <div className="active-glow" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <Link to="/routine" className="ds-view-more-btn">
                                Full Weekly Routine <ChevronRight size={16} />
                            </Link>
                        </section>

                        {/* 2. Quick Links (Medium) */}
                        <section className="ds-section bento-item links-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Zap size={18} />
                                    <span>Quick Links</span>
                                </div>
                            </div>
                            <div className="quick-links-grid">
                                {[
                                    { to: '/study', icon: <BookOpen size={22} />, label: 'Study Hub', color: '#0ea5e9' },
                                    { to: '/routine', icon: <Calendar size={22} />, label: 'Routine', color: '#8b5cf6' },
                                    { to: '/notices', icon: <Bell size={22} />, label: 'Notices', color: '#f59e0b' },
                                    { to: '/chat', icon: <MessageSquare size={22} />, label: 'Batch Chat', color: '#10b981' },
                                    { to: '/syllabus', icon: <FileText size={22} />, label: 'Syllabus', color: '#ec4899' },
                                    { to: '/memories', icon: <Heart size={22} />, label: 'Memories', color: '#ef4444' },
                                    { to: '/explore', icon: <Globe size={22} />, label: 'Explore', color: '#6366f1' },
                                    { to: '/support', icon: <Landmark size={22} />, label: 'Support Us', color: '#d946ef' },
                                ].map((link) => (
                                    <Link key={link.to} to={link.to} className="quick-link-item" style={{ '--ql-color': link.color }}>
                                        <div className="ql-icon">{link.icon}</div>
                                        <span className="ql-label">{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* 3. Top Contributors */}
                        <section className="ds-section bento-item contributor-bento leaderboard-card reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Upload size={18} />
                                    <span>Top Contributors</span>
                                </div>
                            </div>
                            {communityLoading ? (
                                <div className="schedule-skeleton-list">
                                    {[1, 2, 3].map(n => <div key={n} className="sched-skeleton skeleton-pulse" style={{ height: '64px' }} />)}
                                </div>
                            ) : contributors.length === 0 ? (
                                <p className="lb-empty">No contributors yet. Upload files to rank!</p>
                            ) : (
                                <div className="lb-list">
                                    {contributors.map((user, idx) => (
                                        <div key={user.id} className="lb-row">
                                            <span className="lb-rank">{rankLabels[idx] || `#${idx + 1}`}</span>
                                            <div className="lb-avatar" style={{ background: `hsl(${idx * 80}, 60%, 40%)` }}>
                                                {user.avatar_url ? <img src={user.avatar_url} alt={user.name} /> : user.name.charAt(0)}
                                            </div>
                                            <div className="lb-info">
                                                <span className="lb-name">{user.name}</span>
                                                <span className="lb-sub">{user.class_roll_no}</span>
                                            </div>
                                            <div className="lb-score">
                                                <Upload size={13} />
                                                <span>{user.files_count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link to="/contributors" className="lb-see-all-btn">
                                See All <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 4. Top Donators */}
                        <section className="ds-section bento-item donator-bento leaderboard-card reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Coins size={18} />
                                    <span>Top Donators</span>
                                </div>
                            </div>
                            {communityLoading ? (
                                <div className="schedule-skeleton-list">
                                    {[1, 2, 3].map(n => <div key={n} className="sched-skeleton skeleton-pulse" style={{ height: '64px' }} />)}
                                </div>
                            ) : donators.length === 0 ? (
                                <p className="lb-empty">No donators yet. Be the first!</p>
                            ) : (
                                <div className="lb-list">
                                    {donators.map((d, idx) => (
                                        <div key={d.id} className="lb-row">
                                            <span className="lb-rank">{rankLabels[idx] || `#${idx + 1}`}</span>
                                            <div className="lb-avatar" style={{ background: `hsl(${30 + idx * 60}, 70%, 40%)` }}>
                                                {d.avatar_url ? <img src={d.avatar_url} alt={d.name} /> : d.name.charAt(0)}
                                            </div>
                                            <div className="lb-info">
                                                <span className="lb-name">{d.name}</span>
                                                <span className="lb-sub">{d.class_roll_no}</span>
                                            </div>
                                            <div className="lb-score donation">
                                                <span>₹{d.donation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link to="/donators" className="lb-see-all-btn">
                                See All <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 5. Recent Notices */}
                        <section className="ds-section bento-item notices-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Bell size={18} />
                                    <span>Recent Notices</span>
                                </div>
                            </div>
                            <div className="recent-list">
                                {recentNotices.length > 0 ? (
                                    recentNotices.map((notice) => (
                                        <Link key={notice.id} to="/notices" className="recent-item">
                                            <div className="recent-icon notice"><Bell size={14} /></div>
                                            <div className="recent-info">
                                                <span className="recent-title">{notice.title}</span>
                                                <span className="recent-date">{new Date(notice.notice_date).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : <p className="lb-empty">No recent notices.</p>}
                            </div>
                            <Link to="/notices" className="lb-see-all-btn">
                                View Notices <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 6. Recent Events */}
                        <section className="ds-section bento-item events-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Calendar size={18} />
                                    <span>Recent Events</span>
                                </div>
                            </div>
                            <div className="recent-list">
                                {recentEvents.length > 0 ? (
                                    recentEvents.map((event) => (
                                        <Link key={event.id} to="/events" className="recent-item">
                                            <div className="recent-icon event"><Calendar size={14} /></div>
                                            <div className="recent-info">
                                                <span className="recent-title">{event.title}</span>
                                                <span className="recent-date">{new Date(event.event_date).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : <p className="lb-empty">No recent events.</p>}
                            </div>
                            <Link to="/events" className="lb-see-all-btn">
                                View Events <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 7. Recently Uploaded Documents */}
                        <section className="ds-section bento-item documents-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <FileText size={18} />
                                    <span>Recent Documents</span>
                                </div>
                            </div>
                            <div className="recent-list">
                                {recentMaterials.length > 0 ? (
                                    recentMaterials.map((doc) => (
                                        <Link key={doc.id} to="/study" className="recent-item">
                                            <div className="recent-icon doc"><FileText size={14} /></div>
                                            <div className="recent-info">
                                                <span className="recent-title">{doc.file_name}</span>
                                                <span className="recent-date">{doc.subject_name}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : <p className="lb-empty">No recent uploads.</p>}
                            </div>
                            <Link to="/study" className="lb-see-all-btn">
                                Go to Study Hub <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 8. Recent Memory Post */}
                        <section className="ds-section bento-item memory-bento reveal">
                            <div className="ds-section-header">
                                <div className="ds-section-label">
                                    <Heart size={18} />
                                    <span>Batch Memory</span>
                                </div>
                            </div>
                            {recentMemory ? (
                                <Link to="/memories" className="recent-memory-card">
                                    {recentMemory.image_url && <img src={recentMemory.image_url} alt="Recent Memory" className="rem-img" />}
                                    <div className="rem-overlay">
                                        <span className="rem-caption">{recentMemory.caption || 'Shared a memory'}</span>
                                        <span className="rem-author">Shared by {recentMemory.student_name || 'Anonymous'}</span>
                                    </div>
                                </Link>
                            ) : (
                                <p className="lb-empty">No memories shared yet.</p>
                            )}
                            <Link to="/memories" className="lb-see-all-btn" style={{marginTop: '1rem'}}>
                                See All Memories <ChevronRight size={15} />
                            </Link>
                        </section>

                        {/* 5. Pioneer Hall of Fame (Featured) */}
                        <section className="pioneer-section bento-item pioneer-bento reveal">
                            <div className="pioneer-header-bento">
                                <span className="pioneer-badge">Legacy Support</span>
                                <h3>Hall of Fame</h3>
                            </div>

                            <div className="pioneer-grid-bento">
                                <div className="pioneer-card-bento top-contributor">
                                    <div className="tier-tag-bento"><Heart size={12} fill="currentColor" /> Pioneer</div>
                                    <div className="pioneer-image-container-bento">
                                        <img
                                            src="https://res.cloudinary.com/dytmgybqm/image/upload/v1772395818/Untitled_design_1_edptux.jpg"
                                            alt="Sambuddha Samanta"
                                            className="pioneer-img-bento"
                                        />
                                    </div>
                                    <div className="pioneer-info-bento">
                                        <h4 className="premium-name-bento">Sambuddha Samanta</h4>
                                        <p className="pioneer-tagline-bento">"A valued supporter whose contribution fuels our growth."</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* --- Student Reviews (Full Width Below Bento) --- */}
                <section className="voices-section reveal-stagger">
                    <div className="section-header center">
                        <span className="section-badge">Student Feedback</span>
                        <h2>Voices from the Batch</h2>
                    </div>

                    <div className="voices-container">
                        <div className="voice-card">
                            <div className="quote-icon"><Quote size={32} /></div>
                            <div className="voice-rating">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                                ))}
                            </div>
                            <p className="voice-text">
                                "I really loved EEVOLUTION 2.0. It is very helpful, clean, and easy to use."
                            </p>
                            <div className="voice-footer">
                                <div className="voice-avatar">SM</div>
                                <div className="voice-info">
                                    <h4>Sathi Mondal</h4>
                                    <div className="student-verify">
                                        <ShieldCheck size={12} />
                                        <span>Verified Student</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="voice-card">
                            <div className="quote-icon"><Quote size={32} /></div>
                            <div className="voice-rating">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                                ))}
                            </div>
                            <p className="voice-text">
                                "Electrical Engineering is a gauntlet. EEvolution respects your sanity. It's a digital lifeline."
                            </p>
                            <div className="voice-footer">
                                <div className="voice-avatar secondary">SK</div>
                                <div className="voice-info">
                                    <h4>Sohan Kundu</h4>
                                    <div className="student-verify">
                                        <ShieldCheck size={12} />
                                        <span>Verified Student</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="dashboard-footer-section">
                    <p>© 2026 EEvolution 2.0 - Built by Students for Students</p>
                </div>
            </div>
        );
    };

    return session ? <UserView /> : <GuestView />;
};

export default Home;
