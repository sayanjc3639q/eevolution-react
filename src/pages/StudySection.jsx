import React, { useState, useEffect } from 'react';
import {
    useParams,
    useNavigate,
    Link,
    useSearchParams
} from 'react-router-dom';
import {
    Book, FileText, PenTool, FlaskConical, ClipboardList,
    ChevronRight, ArrowLeft, Download, File, Star, Info,
    Layers, Loader2, FileX, Calculator, Terminal, Dna,
    Globe, Palette, Microscope, MessageSquareText, Compass,
    Eye, X, ExternalLink, Share2, Zap
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import './StudySection.css';

const StudySection = () => {
    const { categoryId, subjectId, chapterId } = useParams();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleShare = async (file, e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();

        console.log("Attempting to share file:", file.file_name);

        // Construct the website deep link
        const shareUrl = `${window.location.origin}${window.location.pathname}?preview=${file.id}`;

        const shareData = {
            title: `EEvolution Study Hub`,
            text: `Document: ${file.file_name}\nDescription: ${file.file_description || 'Check out this study material!'}\n\nRead here:`,
            url: shareUrl
        };

        try {
            // Check if navigator.canShare is available for better verification
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                console.log("Using Web Share API");
                await navigator.share(shareData);
            } else if (navigator.share) {
                // Fallback for browsers that support share but maybe not canShare
                await navigator.share(shareData);
            } else {
                console.log("Web Share API not supported, falling back to clipboard");
                await navigator.clipboard.writeText(shareUrl);
                alert('Website link copied to clipboard!');
            }
        } catch (err) {
            // Ignore AbortError (user cancelled share)
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                // Fallback to clipboard if share fails
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Share failed, but website link was copied to clipboard!');
                } catch (copyErr) {
                    console.error('Clipboard fallback also failed');
                }
            }
        }
    };

    // --- DATA STRUCTURES ---
    const categories = [
        { id: 'class-notes', name: 'Class Notes', icon: <PenTool />, highlight: true, description: 'Daily notes from every lecture.' },
        { id: 'practice-set', name: 'Practice Sets', icon: <ClipboardList />, description: 'Problem sets and exercise materials.' },
        { id: 'books', name: 'Books', icon: <Book />, description: 'Recommended textbooks and reference material.' },
        { id: 'handwritten', name: 'Handwritten & PPTs', icon: <FileText />, description: 'Student-made notes and academic slides.' },
        { id: 'lab-notes', name: 'Lab Notes', icon: <FlaskConical />, description: 'Practical records and laboratory guides.' }
    ];

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            await Promise.all([fetchMaterials(), fetchSyllabus()]);
            setLoading(false);
        };
        loadAllData();
    }, []);

    // Effect to handle deep linking via preview query param
    useEffect(() => {
        if (!loading && materials.length > 0) {
            const previewId = searchParams.get('preview');
            if (previewId) {
                const file = materials.find(m => m.id === previewId || m.id === parseInt(previewId));
                if (file) {
                    setPreviewFile(file);
                    // Clear the query param so it doesn't re-open on refresh if user closed it
                    // but we might want to keep it if we want users to be able to refresh and keep the modal open.
                    // For now, let's just set it.
                }
            }
        }
    }, [loading, materials, searchParams]);

    const fetchMaterials = async () => {
        const { data, error } = await supabase
            .from('study_materials')
            .select('*');
        if (!error) {
            setMaterials(data);
        }
    };

    const fetchSyllabus = async () => {
        const { data, error } = await supabase
            .from('syllabus')
            .select('data')
            .single();
        if (!error && data) {
            setSyllabus(data.data);
        }
    };

    // --- DERIVED DATA FROM SYLLABUS ---
    const getSubjects = () => {
        if (!syllabus) return [];
        const theory = (syllabus.theory_subjects || []).map(s => ({
            id: s.paper_code.replace(/\s+/g, '-').toLowerCase(),
            name: s.subject,
            code: s.paper_code,
            type: 'Theory'
        }));
        const practical = (syllabus.practical_subjects || []).map(s => ({
            id: s.paper_code.replace(/\s+/g, '-').toLowerCase(),
            name: s.subject,
            code: s.paper_code,
            type: 'Lab'
        }));

        if (categoryId === 'lab-notes') return practical;
        return [...theory, ...practical];
    };

    const getSubjectIcon = (code) => {
        const c = code?.toUpperCase() || '';
        if (c.includes('M')) return <Calculator size={20} />;
        if (c.includes('CH')) return <FlaskConical size={20} />;
        if (c.includes('CS')) return <Terminal size={20} />;
        if (c.includes('HU')) return <MessageSquareText size={20} />;
        if (c.includes('MC')) return <Compass size={20} />;
        if (c.includes('ME')) return <Palette size={20} />;
        return <Book size={20} />;
    };

    const getChapters = (subId) => {
        if (!syllabus) return [];
        const allSyllabusSubjects = [...syllabus.theory_subjects, ...syllabus.practical_subjects];
        const sub = allSyllabusSubjects.find(s => s.paper_code.replace(/\s+/g, '-').toLowerCase() === subId);
        if (!sub) return [];

        const chaptersList = [];
        (sub.modules || sub.experiments || []).forEach(mod => {
            mod.chapters.forEach((ch, idx) => {
                chaptersList.push({
                    id: `${mod.module_no}-${idx}`,
                    name: ch.name
                });
            });
        });
        return chaptersList;
    };

    const subjects = getSubjects();
    const dynamicChapters = subjectId ? getChapters(subjectId) : [];

    // --- DERIVED SELECTIONS ---
    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedSubject = subjects.find(s => s.id === subjectId);
    const selectedChapter = dynamicChapters.find(ch => ch.id === chapterId);

    const isNew = (date) => {
        if (!date) return false;
        const uploadDate = new Date(date);
        const now = new Date();
        const diffInDays = (now - uploadDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    };

    const renderRecentShelf = (title, filesList) => {
        if (!filesList || filesList.length === 0) return null;

        // Filter for new files and sort by date
        const recentFiles = [...filesList]
            .filter(f => isNew(f.created_at))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6);

        if (recentFiles.length === 0) return null;

        return (
            <div className="recent-shelf-container reveal">
                <h3 className="section-label" style={{ marginBottom: '1.25rem' }}>{title}</h3>
                <div className="shelf-items">
                    {recentFiles.map(file => (
                        <div key={file.id} className="shelf-card" onClick={() => setPreviewFile(file)}>
                            <div className="badge-new">NEW</div>
                            <div className="shelf-icon-box">
                                <FileText size={20} />
                            </div>
                            <div className="shelf-details">
                                <h4>{file.file_name}</h4>
                                <span>{file.subject_name}</span>
                            </div>
                            <ChevronRight size={14} style={{ opacity: 0.3 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Filter materials for the final file view - Sorted by recent first
    const filteredFiles = materials
        .filter(m =>
            m.section_id === categoryId &&
            selectedSubject?.name === m.subject_name &&
            (categoryId === 'practice-set' ? true : selectedChapter?.name === m.chapter_name)
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // --- NAVIGATION LOGIC ---
    const goBack = () => {
        navigate(-1);
    };

    // --- RENDERERS ---
    const renderCategories = () => (
        <div className="cascade-view" key="categories">
            {renderRecentShelf("Recently Uploaded Documents", materials)}
            <div className="section-intro">
                <h2>Choose <span className="highlight">Resource Type</span></h2>
                <p>Select the kind of study material you are looking for.</p>
            </div>
            <div className="category-grid">
                {categories.map((cat) => (
                    <Link key={cat.id} to={`/study/${cat.id}`} className={`category-card ${cat.highlight ? 'special' : ''} text-decoration-none`}>
                        <div className="category-icon">{cat.icon}</div>
                        <div className="category-info">
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                        </div>
                        <ChevronRight className="arrow-icon" />
                        {cat.highlight && <div className="star-tag"><Star size={10} fill="white" /> HOT</div>}
                    </Link>
                ))}
            </div>
        </div>
    );

    const renderSubjects = () => (
        <div className="cascade-view" key={`subjects-${categoryId}`}>
            <div className="section-intro">
                <div className="section-title-row">
                    <button onClick={goBack} className="back-btn-square">
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Select <span className="highlight">Subject</span></h2>
                </div>
                <p>Resources for your academic growth</p>
                <div className="breadcrumb-new">
                    <span>{selectedCategory?.name}</span>
                </div>
            </div>
            {renderRecentShelf(`Recent ${selectedCategory?.name}`, materials.filter(m => m.section_id === categoryId))}
            <div className="subject-grid-container">
                {subjects.filter(s => s.type === 'Theory').length > 0 && (
                    <div className="subject-section">
                        <h3 className="section-label">Theory Subjects</h3>
                        <div className="subject-cards-grid">
                            {subjects.filter(s => s.type === 'Theory').map(sub => (
                                <Link key={sub.id} to={`/study/${categoryId}/${sub.id}${categoryId === 'practice-set' ? '/general' : ''}`} className="subject-item-card text-decoration-none">
                                    <div className="subject-icon-box">{getSubjectIcon(sub.code)}</div>
                                    <div className="subject-details">
                                        <span className="sub-code">{sub.code}</span>
                                        <h4>{sub.name}</h4>
                                    </div>
                                    <ChevronRight className="chevron" size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="subject-section">
                    <h3 className="section-label">{categoryId === 'lab-notes' ? 'Lab Subjects' : 'Practical & Labs'}</h3>
                    <div className="subject-cards-grid">
                        {subjects.filter(s => s.type === 'Lab').map(sub => (
                            <Link key={sub.id} to={`/study/${categoryId}/${sub.id}${categoryId === 'practice-set' ? '/general' : ''}`} className="subject-item-card text-decoration-none">
                                <div className="subject-icon-box lab">{getSubjectIcon(sub.code)}</div>
                                <div className="subject-details">
                                    <span className="sub-code">{sub.code}</span>
                                    <h4>{sub.name}</h4>
                                </div>
                                <ChevronRight className="chevron" size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderChapters = () => (
        <div className="cascade-view" key={`chapters-${subjectId}`}>
            <div className="section-intro">
                <div className="section-title-row">
                    <button onClick={goBack} className="back-btn-square">
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Choose <span className="highlight">Chapter</span></h2>
                </div>
                <p>Select a chapter to see available study materials.</p>
                <div className="breadcrumb-new">
                    <span>{selectedCategory?.name} <span className="path-sep">&gt;</span> {selectedSubject?.name}</span>
                </div>
            </div>
            {renderRecentShelf("Recently Added", materials.filter(m => m.subject_name === selectedSubject?.name))}
            <div className="chapter-list">
                {dynamicChapters.length > 0 ? (
                    dynamicChapters.map(ch => (
                        <Link key={ch.id} to={`/study/${categoryId}/${subjectId}/${ch.id}`} className="list-item text-decoration-none">
                            <div className="item-info">
                                <Layers size={20} className="accent-icon" />
                                <span>{ch.name}</span>
                            </div>
                            <ChevronRight className="chevron-right" size={18} />
                        </Link>
                    ))
                ) : (
                    <div className="empty-state">
                        <Info size={30} className="text-secondary" />
                        <p>No chapters found for this subject in the syllabus.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderFiles = () => (
        <div className="cascade-view" key={`files-${chapterId}`}>
            <div className="section-intro">
                <div className="section-title-row">
                    <button onClick={goBack} className="back-btn-square">
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Available <span className="highlight">Files</span></h2>
                </div>
                <div className="breadcrumb-new">
                    <span>{selectedCategory?.name} <span className="path-sep">&gt;</span> {selectedSubject?.name} {categoryId !== 'practice-set' && <><span className="path-sep">&gt;</span> {selectedChapter?.name}</>}</span>
                </div>
            </div>

            {loading ? (
                <div className="file-grid skeleton-loading">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="file-card skeleton-item skeleton-pulse" style={{ height: '160px', border: 'none' }}></div>
                    ))}
                </div>
            ) : filteredFiles.length > 0 ? (
                <div className="file-grid">
                    {filteredFiles.map(file => (
                        <div key={file.id} className={`file-card ${isNew(file.created_at) ? 'is-new' : ''}`}>
                            {isNew(file.created_at) && (
                                <div className="new-file-tag">
                                    <Zap size={10} fill="currentColor" /> Newly Uploaded
                                </div>
                            )}
                            <div className="file-header">
                                <div className="file-icon"><File /></div>
                                <div className="file-meta">
                                    <h4>{file.file_name}</h4>
                                </div>
                            </div>
                            <p className="file-desc">{file.file_description}</p>
                            <div className="file-actions">
                                <button onClick={() => setPreviewFile(file)} className="download-btn view-btn">
                                    <Eye size={18} /> View
                                </button>
                                <button onClick={(e) => handleShare(file, e)} className="share-btn-card" title="Share Document">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-burn">
                        <FileX size={48} />
                    </div>
                    <h3>No Files Uploaded</h3>
                    <p>It seems no files have been uploaded for this section yet. Please check back later or contribute to the community!</p>
                </div>
            )}
        </div>
    );

    // Determine current view based on params
    const renderContent = () => {
        if (categoryId && subjectId && chapterId) return <div className="study-container">{renderFiles()}</div>;
        if (categoryId && subjectId) return <div className="study-container">{renderChapters()}</div>;
        if (categoryId) return <div className="study-container">{renderSubjects()}</div>;
        return <div className="study-container">{renderCategories()}</div>;
    }

    const closePreview = () => {
        setPreviewFile(null);
        searchParams.delete('preview');
        setSearchParams(searchParams);
    };

    // --- SEO LOGIC ---
    let seoTitle = 'Study Hub';
    let seoDescription = 'Access a vast collection of study materials, books, and class notes for Electrical Engineering students.';
    
    if (previewFile) {
        seoTitle = `${previewFile.file_name} | Study Hub`;
        seoDescription = `View ${previewFile.file_name} in ${selectedCategory?.name || 'Study Hub'}. ${previewFile.file_description || ''}`;
    } else if (selectedCategory) {
        seoTitle = `${selectedCategory.name} | Study Hub`;
        seoDescription = `Browse $^{selectedCategory.name} for Electrical Engineering students. ${selectedCategory.description}`;
        if (selectedSubject) {
            seoTitle = `${selectedSubject.name} | ${selectedCategory.name}`;
            seoDescription = `Find ${selectedCategory.name} for ${selectedSubject.name} (${selectedSubject.code}).`;
        }
    }

    return (
        <>
            <SEO 
                title={seoTitle}
                description={seoDescription}
                canonical={`/study${categoryId ? `/${categoryId}` : ''}${subjectId ? `/${subjectId}` : ''}`}
            />
            {renderContent()}

            {previewFile && (
                <div className="preview-modal-overlay show" onClick={closePreview}>
                    <div className="preview-modal" onClick={e => e.stopPropagation()}>
                        <div className="preview-modal-header">
                            <div className="title-container">
                                <div className="preview-btn-icon file-type">
                                    <FileText size={20} />
                                </div>
                                <h3>{previewFile.file_name}</h3>
                            </div>
                            <div className="preview-actions">
                                <a href={previewFile.drive_link} target="_blank" rel="noopener noreferrer" className="preview-btn-icon" title="Open in Google Drive">
                                    <ExternalLink size={20} />
                                </a>
                                <button className="preview-btn-icon" onClick={() => handleShare(previewFile)} title="Share Document">
                                    <Share2 size={20} />
                                </button>
                                <button className="preview-btn-icon close" onClick={closePreview} title="Close Preview">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="preview-modal-body">
                            <iframe
                                src={previewFile.drive_link.replace(/\/view(\?usp=sharing)?.*?$/, '/preview')}
                                title={previewFile.file_name}
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudySection;
