import React, { useState } from 'react';
import {
    Book, FileText, ChevronDown, ChevronUp, Info, Layers, GraduationCap, School, Calendar, ArrowLeft, FlaskConical, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuery } from '@tanstack/react-query';
import './Syllabus.css';

const Syllabus = () => {
    const navigate = useNavigate();
    const [activeType, setActiveType] = useState('theory'); // 'theory' or 'practical'
    const [expandedSubject, setExpandedSubject] = useState(null);

    // --- CACHED SYLLABUS FETCHING ---
    const { data: syllabusData = null, isLoading: loading } = useQuery({
        queryKey: ['syllabus'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('syllabus')
                .select('data')
                .single();
            if (error) throw error;
            return data.data;
        }
    });

    const toggleSubject = (index) => {
        setExpandedSubject(expandedSubject === index ? null : index);
    };

    if (loading) {
        return (
            <div className="syllabus-container skeleton-loading">
                <header className="syllabus-header">
                    <div className="skeleton-line title skeleton-pulse" style={{ width: '40%', marginBottom: '2rem' }}></div>
                    <div className="syllabus-meta-cards">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="meta-card skeleton-item skeleton-pulse"></div>
                        ))}
                    </div>
                </header>

                <div className="syllabus-type-tabs">
                    <div className="skeleton-item skeleton-pulse" style={{ width: '150px', height: '40px', borderRadius: '100px' }}></div>
                    <div className="skeleton-item skeleton-pulse" style={{ width: '150px', height: '40px', borderRadius: '100px' }}></div>
                </div>

                <div className="syllabus-content">
                    {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="subject-accordion skeleton-item skeleton-pulse" style={{ height: '80px', marginBottom: '1rem', borderRadius: '14px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!syllabusData) {
        return <div className="syllabus-error">Failed to load syllabus data.</div>;
    }

    const currentSubjects = activeType === 'theory'
        ? syllabusData.theory_subjects
        : syllabusData.practical_subjects;

    return (
        <div className="syllabus-container">
            <header className="syllabus-header">
                <button onClick={() => navigate(-1)} className="back-btn-header">
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="header-badge">
                    <GraduationCap size={16} /> Academic Resources
                </div>
                <h1>Official <span className="highlight">Syllabus</span></h1>

                <div className="syllabus-meta-cards">
                    <div className="meta-card">
                        <School size={20} className="icon gold" />
                        <div className="meta-info">
                            <span>Institute</span>
                            <strong>{syllabusData.institute}</strong>
                        </div>
                    </div>
                    <div className="meta-card">
                        <Calendar size={20} className="icon blue" />
                        <div className="meta-info">
                            <span>Semester</span>
                            <strong>{syllabusData.semester}</strong>
                        </div>
                    </div>
                    <div className="meta-card">
                        <Target size={20} className="icon green" />
                        <div className="meta-info">
                            <span>Branch</span>
                            <strong>{syllabusData.branch}</strong>
                        </div>
                    </div>
                </div>
            </header>

            <div className="syllabus-type-tabs">
                <button
                    className={activeType === 'theory' ? 'active' : ''}
                    onClick={() => { setActiveType('theory'); setExpandedSubject(null); }}
                >
                    <Book size={18} /> Theory Subjects
                </button>
                <button
                    className={activeType === 'practical' ? 'active' : ''}
                    onClick={() => { setActiveType('practical'); setExpandedSubject(null); }}
                >
                    <FlaskConical size={18} /> Practical/Labs
                </button>
            </div>

            <div className="syllabus-content">
                {currentSubjects.map((sub, sIdx) => (
                    <div key={sIdx} className={`subject-accordion ${expandedSubject === sIdx ? 'expanded' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSubject(sIdx)}>
                            <div className="header-left">
                                <div className="subject-icon">
                                    {activeType === 'theory' ? <Book size={20} /> : <FlaskConical size={20} />}
                                </div>
                                <div className="subject-titles">
                                    <h3>{sub.subject}</h3>
                                    <span>{sub.paper_code} • {sub.credits} Credits</span>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="lecture-count">
                                    {sub.total_lectures || sub.periods} {activeType === 'theory' ? 'Lectures' : 'Periods'}
                                </div>
                                {expandedSubject === sIdx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {expandedSubject === sIdx && (
                            <div className="accordion-body">
                                {(sub.modules || sub.experiments || []).map((mod, mIdx) => (
                                    <div key={mIdx} className="module-item">
                                        <div className="module-header">
                                            <div className="mod-number">Module {mod.module_no}</div>
                                            <h4>{mod.title}</h4>
                                            {mod.lectures && <span className="mod-lectures">{mod.lectures} L</span>}
                                        </div>
                                        <div className="chapters-list">
                                            {mod.chapters.map((ch, cIdx) => (
                                                <div key={cIdx} className="chapter-item">
                                                    <div className="chapter-name-row">
                                                        <Layers size={14} className="accent" />
                                                        <h5>{ch.name}</h5>
                                                    </div>
                                                    <ul className="subtopics-list">
                                                        {ch.subtopics.map((topic, tIdx) => (
                                                            <li key={tIdx}>{topic}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="syllabus-footer-info">
                <Info size={16} />
                <p>This syllabus is according to the latest university guidelines for {syllabusData.semester}.</p>
            </div>
        </div>
    );
};

export default Syllabus;
