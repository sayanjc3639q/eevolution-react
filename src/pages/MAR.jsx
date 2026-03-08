import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award,
    CheckCircle2,
    Info,
    ArrowLeft,
    Target,
    BarChart3,
    HelpCircle,
    Star
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './MAR.css';

const MAR = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMARData();
    }, []);

    const fetchMARData = async () => {
        setLoading(true);
        try {
            // Fetch metadata
            const { data: metaData, error: metaError } = await supabase
                .from('mar_metadata')
                .select('key, value');

            if (!metaError && metaData) {
                const metaObj = {};
                metaData.forEach(item => {
                    metaObj[item.key] = item.value;
                });
                setMetadata(metaObj);
            }

            // Fetch activities
            const { data: actData, error: actError } = await supabase
                .from('mar_activities')
                .select('*')
                .order('sl_no', { ascending: true });

            if (!actError && actData) {
                setActivities(actData);
            }
        } catch (err) {
            console.error('Error fetching MAR data:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderPoints = (points) => {
        if (points && typeof points === 'object') {
            return Object.entries(points).map(([key, val]) => (
                <div key={key} className="point-item">
                    <span className="point-label">{key.replace('_', ' ')}</span>
                    <span className="point-value">{val} pts</span>
                </div>
            ));
        }
        return null;
    };

    const renderRoles = (roles) => {
        if (roles && typeof roles === 'object') {
            return Object.entries(roles).map(([key, val]) => (
                <div key={key} className="point-item">
                    <span className="point-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="point-value">{val} pts</span>
                </div>
            ));
        }
        return null;
    };

    const renderLevels = (levels) => {
        if (levels && typeof levels === 'object') {
            return Object.entries(levels).map(([key, val]) => (
                <div key={key} className="point-item">
                    <span className="point-label">{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</span>
                    <span className="point-value">{val} pts</span>
                </div>
            ));
        }
        return null;
    };

    if (loading) {
        return (
            <div className="mar-container">
                <div className="skeleton-loading">
                    <div className="skeleton-line skeleton-pulse" style={{ height: '200px', marginBottom: '2rem', borderRadius: '24px' }}></div>
                    <div className="rules-grid">
                        {[1, 2].map(n => <div key={n} className="rule-card skeleton-item skeleton-pulse" style={{ height: '120px' }}></div>)}
                    </div>
                    <div className="activities-grid">
                        {[1, 2, 3, 4].map(n => <div key={n} className="activity-card skeleton-item skeleton-pulse" style={{ height: '300px' }}></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mar-container">
            <header className="mar-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <h1>{metadata.section || 'MAR Points'}</h1>
                <p>{metadata.description || 'Mandatory Additional Requirement guidelines.'}</p>
            </header>

            <div className="rules-grid">
                <div className="rule-card">
                    <div className="rule-icon">
                        <Target size={28} />
                    </div>
                    <div className="rule-info">
                        <h3>Total Required</h3>
                        <div className="value">{metadata.total_points_required?.regular_entry || 100} pts</div>
                        <div className="sub-value">{metadata.total_points_required?.lateral_entry || 75} pts for Lateral</div>
                    </div>
                </div>

                <div className="rule-card">
                    <div className="rule-icon">
                        <BarChart3 size={28} />
                    </div>
                    <div className="rule-info">
                        <h3>Annual Rule</h3>
                        <div className="value">25 pts</div>
                        <div className="sub-value">{metadata.distribution_rule || 'Minimum per academic year'}</div>
                    </div>
                </div>
            </div>

            <div className="activities-section">
                <h2>
                    <Award className="accent" />
                    Activity Guidelines
                </h2>

                <div className="activities-grid">
                    {activities.map((item, index) => (
                        <div key={index} className="activity-card">
                            <div className="activity-header">
                                <span className="sl-no">SL NO: {item.sl_no}</span>
                                <Star size={16} className="accent" />
                            </div>
                            <h3>{item.activity}</h3>

                            <div className="activity-points">
                                {item.points && renderPoints(item.points)}
                                {item.roles && renderRoles(item.roles)}
                                {item.levels && renderLevels(item.levels)}
                                {item.points_per_unit && (
                                    <div className="point-item">
                                        <span className="point-label">Points per unit/entry</span>
                                        <span className="point-value">{item.points_per_unit} pts</span>
                                    </div>
                                )}
                            </div>

                            <div className="activity-footer">
                                <div className="max-cap">
                                    <Info size={14} />
                                    <span>Max Cap: <strong>{item.max_allowed} pts</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="transparency-note" style={{ marginTop: '4rem' }}>
                <HelpCircle size={16} />
                <span>Need help with certificates? Contact your department MAR coordinator.</span>
            </div>
        </div>
    );
};

export default MAR;
