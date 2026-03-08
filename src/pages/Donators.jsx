import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Landmark,
    ArrowLeft,
    Trophy,
    Coins,
    User,
    Search,
    Filter
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Donators.css';

const Donators = () => {
    const navigate = useNavigate();
    const [donators, setDonators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDonators();
    }, []);

    const fetchDonators = async () => {
        setLoading(true);
        // Fetching from students table where donation > 0
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .gt('donation', 0)
            .order('donation', { ascending: false });

        if (!error && data) {
            setDonators(data);
        }
        setLoading(false);
    };

    const filteredDonators = donators.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.class_roll_no.includes(searchQuery)
    );

    const totalDonation = donators.reduce((sum, d) => sum + (d.donation || 0), 0);

    return (
        <div className="donators-container">
            <div className="community-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="header-icon donator-glow">
                    <Landmark size={32} />
                </div>
                <h1>Donators <span className="highlight">Hall</span></h1>
                <p>Recognizing those who fuel the EEvolution project</p>

                <div className="stats-strip">
                    <div className="stat-pill">
                        <Coins size={16} />
                        <span>Total Funds: ₹{totalDonation}</span>
                    </div>
                </div>
            </div>

            <div className="search-filter-box">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search donators..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="donators-grid">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="donator-card skeleton-item skeleton-pulse" style={{ height: '80px', border: 'none' }}></div>
                    ))
                ) : filteredDonators.length > 0 ? (
                    filteredDonators.map((donator, idx) => (
                        <div key={donator.id} className="donator-card">
                            <div className="rank-badge">
                                {idx < 3 ? <Trophy size={14} /> : <span>#{idx + 1}</span>}
                            </div>
                            <div className="donator-avatar">
                                {donator.avatar_url ? (
                                    <img src={donator.avatar_url} alt={donator.name} className="avatar-img" />
                                ) : (
                                    donator.name.charAt(0)
                                )}
                            </div>
                            <div className="donator-details">
                                <h3>{donator.name}</h3>
                                <div className="donator-meta">
                                    <span className="roll">Roll: {donator.class_roll_no}</span>
                                </div>
                            </div>
                            <div className="donation-amount">
                                <span>₹{donator.donation}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No donators found. Be the first to support!</p>
                    </div>
                )}
            </div>

            <div className="support-cta">
                <div className="cta-content">
                    <h3>Want to see your name here?</h3>
                    <p>Help us maintain servers and add new features.</p>
                </div>
                <button onClick={() => navigate('/support')} className="cta-btn">
                    <Heart size={18} fill="currentColor" />
                    Support Us
                </button>
            </div>
        </div>
    );
};

export default Donators;
