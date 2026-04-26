import React, { useState, useEffect } from 'react';
import { MessageSquare, ExternalLink, MessageCircle, ArrowLeft, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './WhatsAppLinks.css';

const WhatsAppLinks = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('whatsapp_groups')
            .select('*')
            .order('name', { ascending: true });

        if (!error) {
            setGroups(data);
        }
        setLoading(false);
    };

    return (
        <div className="whatsapp-page">
            <header className="whatsapp-header hero-section">
                <div className="hero-content">
                    <button onClick={() => navigate(-1)} className="back-btn-whatsapp">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="title">Community <span className="highlight">Groups</span></h1>
                    <p className="subtitle">Connect with EE Community Students</p>
                </div>
            </header>

            <main className="whatsapp-content">
                <div className="info-banner">
                    <Info size={20} />
                    <p>These groups are for EE community students only. Please maintain decorum and follow group rules.</p>
                </div>

                {loading ? (
                    <div className="groups-grid skeleton-loading">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="group-card skeleton-item skeleton-pulse" style={{ height: '140px', border: 'none' }}></div>
                        ))}
                    </div>
                ) : groups.length > 0 ? (
                    <div className="groups-grid">
                        {groups.map((group) => (
                            <div key={group.id} className="group-card">
                                <div className="group-icon">
                                    <MessageCircle size={32} />
                                </div>
                                <div className="group-details">
                                    <h3>{group.name}</h3>
                                    <p>{group.description || "Official community group for students."}</p>
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="join-btn"
                                    >
                                        <MessageSquare size={18} /> Join Now <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-groups">
                        <MessageSquare size={64} className="ghost-icon" />
                        <h3>No Groups Found</h3>
                        <p>Contact an administrator to add WhatsApp group links here.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WhatsAppLinks;
