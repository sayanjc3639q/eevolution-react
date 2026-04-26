import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuery } from '@tanstack/react-query';
import {
    BookOpen,
    ChevronLeft,
    Award,
    GraduationCap,
    Clock,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    Info,
    Layout
} from 'lucide-react';
import './MOOCS.css';

const MOOCSSkeleton = () => (
    <div className="moocs-container skeleton-active">
        <button className="back-btn-pill" style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <ChevronLeft size={20} /> Back to Explore
        </button>
        <div className="moocs-header">
            <div className="skeleton title-skeleton"></div>
            <div className="skeleton text-skeleton"></div>
        </div>
        <div className="moocs-metadata-grid">
            {[1, 2, 3].map(i => <div key={i} className="skeleton meta-card-skeleton"></div>)}
        </div>
        <div className="skeleton section-title-skeleton"></div>
        <div className="courses-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton course-card-skeleton"></div>)}
        </div>
    </div>
);

const MOOCS = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: moocsData, isLoading: loading } = useQuery({
        queryKey: ['moocsData'],
        queryFn: async () => {
            // Fetch metadata
            const { data: metaData } = await supabase.from('moocs_metadata').select('*');
            const metaObj = {};
            if (metaData) {
                metaData.forEach(m => metaObj[m.key] = m.value);
            }

            // Fetch buckets with courses
            const { data: bucketData, error: bucketError } = await supabase
                .from('moocs_buckets')
                .select(`
                    id,
                    name,
                    moocs_courses (*)
                `);

            if (bucketError) throw bucketError;

            return { metadata: metaObj, buckets: bucketData || [] };
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });

    const metadata = moocsData?.metadata || {};
    const buckets = moocsData?.buckets || [];

    if (loading) return <MOOCSSkeleton />;

    return (
        <div className="moocs-container">
            <button className="back-btn-pill" onClick={() => navigate('/explore')}>
                <ChevronLeft size={20} /> Back to Explore
            </button>

            <header className="moocs-header">
                <h1>{metadata.section || "MOOCs for B. Tech. (Honours)"}</h1>
                <p>{metadata.description || "Additional credits required to obtain a B. Tech with Honours degree."}</p>
            </header>

            <div className="moocs-metadata-grid">
                <div className="moocs-meta-card">
                    <div className="meta-icon-box"><Award size={20} /></div>
                    <h3>Total Credits Required</h3>
                    <div className="credits-badge-group">
                        <div className="credit-badge">
                            <span>{metadata.total_credits_required?.regular_entry}</span>
                            <label>Regular</label>
                        </div>
                        <div className="credit-badge">
                            <span>{metadata.total_credits_required?.lateral_entry}</span>
                            <label>Lateral</label>
                        </div>
                    </div>
                </div>

                <div className="moocs-meta-card">
                    <div className="meta-icon-box"><Calendar size={20} /></div>
                    <h3>Yearly Distribution</h3>
                    <ul>
                        {metadata.yearly_credit_distribution && Object.entries(metadata.yearly_credit_distribution).map(([year, credits]) => (
                            <li key={year} style={{ textTransform: 'capitalize' }}>
                                <strong>{year.replace('_', ' ')}:</strong> {credits}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="moocs-meta-card">
                    <div className="meta-icon-box"><CheckCircle2 size={20} /></div>
                    <h3>Mandatory Skills</h3>
                    <ul>
                        {metadata.first_year_mandatory_skills?.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <h2 className="moocs-section-title"><BookOpen size={24} /> Recommended Courses (Annexure II)</h2>

            <div className="moocs-buckets-container">
                {buckets.map(bucket => (
                    <div key={bucket.id} className="bucket-info">
                        <h2>{bucket.name}</h2>
                        <div className="courses-grid">
                            {bucket.moocs_courses?.map(course => (
                                <div key={course.id} className="course-card">
                                    <span className="course-provider">{course.provider}</span>
                                    <h4 className="course-name">{course.name}</h4>
                                    <div className="course-details">
                                        <div className="course-duration">
                                            <Clock size={16} />
                                            <span>{course.duration}</span>
                                        </div>
                                        <span className="course-credits">{course.credits} Credits</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <section className="moocs-notes">
                <h3><Info size={20} /> Important Guidelines</h3>
                <ul>
                    {metadata.important_notes?.map((note, idx) => (
                        <li key={idx}>{note}</li>
                    ))}
                </ul>
                <p style={{ marginTop: '1rem', color: '#f39c12', fontSize: '0.9rem', opacity: 0.8 }}>
                    * Credit conversion: {metadata.credit_conversion_rules?.hourly_basis}
                </p>
            </section>
        </div>
    );
};

export default MOOCS;
