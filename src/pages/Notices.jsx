import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Download, ExternalLink, Calendar as CalendarIcon, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import './Notices.css';

const Notices = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            const { data, error } = await supabase
                .from('notices')
                .select('*')
                .order('notice_date', { ascending: false });

            if (!error) setNotices(data);
            setLoading(false);
        };
        fetchNotices();
    }, []);

    return (
        <div className="notices-page">
            <SEO 
                title="Official Notices"
                description="Stay updated with the latest college notices, announcements, and important updates for EE Electrical Engineering students."
                keywords="college notices, exam updates, results announcements, college news"
            />
            <div className="page-header">
                <h1>Official <span className="highlight">Notices</span></h1>
                <p>Stay updated with the latest college announcements</p>
            </div>

            <div className="notices-container">
                {loading ? (
                    <div className="skeleton-loading">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="notice-card skeleton-item skeleton-pulse" style={{ height: '180px', border: 'none', marginBottom: '1.5rem' }}></div>
                        ))}
                    </div>
                ) : notices.length > 0 ? (
                    notices.map((notice) => (
                        <div key={notice.id} className="notice-card">
                            <div className="notice-header">
                                <div className="notice-type-icon">
                                    <Bell size={20} />
                                </div>
                                <div className="notice-meta">
                                    <h3>{notice.title}</h3>
                                    <div className="date-pill">
                                        <CalendarIcon size={14} />
                                        <span>{new Date(notice.notice_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="notice-body">
                                <p>{notice.content}</p>
                            </div>
                            {notice.attachment_link && (
                                <div className="notice-footer">
                                    <a
                                        href={notice.attachment_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-btn"
                                    >
                                        {notice.attachment_type === 'pdf' ? <FileText size={18} /> : <ImageIcon size={18} />}
                                        <span>View {notice.attachment_type === 'pdf' ? 'Document' : 'Image'}</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-notices">
                        <Bell size={48} className="muted-icon" />
                        <p>No notices posted yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notices;
