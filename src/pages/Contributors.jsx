import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    ArrowLeft,
    Search,
    User,
    Upload,
    Award,
    Star,
    Sparkles
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Contributors.css';

const Contributors = () => {
    const navigate = useNavigate();
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        setLoading(true);
        // Fetching from students table where files_count > 0
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .gt('files_count', 0)
            .order('files_count', { ascending: false });

        if (!error && data) {
            setContributors(data);
        }
        setLoading(false);
    };

    const filteredContributors = contributors.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.class_roll_no.includes(searchQuery)
    );

    return (
        <div className="contributors-container">
            <div className="community-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="header-icon heart-glow">
                    <Heart size={32} />
                </div>
                <h1>Top <span className="highlight">Contributors</span></h1>
                <p>Recognizing students who share resources with the batch</p>
            </div>

            <div className="search-filter-box">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search contributors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="contributors-list">
                {loading ? (
                    <div className="skeleton-loading">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="contributor-row skeleton-item skeleton-pulse" style={{ height: '80px', marginBottom: '1rem', border: 'none' }}></div>
                        ))}
                    </div>
                ) : filteredContributors.length > 0 ? (
                    filteredContributors.map((user, idx) => (
                        <div key={user.id} className="contributor-row">
                            <div className="row-rank">
                                {idx === 0 && <Star size={20} className="rank-1" fill="currentColor" />}
                                {idx === 1 && <Award size={20} className="rank-2" />}
                                {idx === 2 && <Award size={20} className="rank-3" />}
                                {idx > 2 && <span>{idx + 1}</span>}
                            </div>

                            <div className="user-profile">
                                <div className="user-avatar">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.name} className="avatar-img" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                                <div className="user-info">
                                    <h3>{user.name}</h3>
                                    <span>Roll: {user.class_roll_no}</span>
                                </div>
                            </div>

                            <div className="upload-stats">
                                <div className="stat-value">
                                    <Upload size={16} />
                                    <span>{user.files_count}</span>
                                </div>
                                <span className="stat-label">Uploads</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No contributors found yet.</p>
                        <button className="upload-cta-btn" onClick={() => navigate('/study')}>
                            Start Uploading
                        </button>
                    </div>
                )}
            </div>

            <div className="contributor-footer">
                <Sparkles size={20} className="accent-icon" />
                <p>Every file you upload helps a fellow student succeed.</p>
            </div>
        </div>
    );
};

export default Contributors;
