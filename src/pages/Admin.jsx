import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Bell, Calendar, Users, Plus, Save, Trash2,
    Search, Loader2, CheckCircle, AlertCircle, ArrowLeft, Clock, FileText,
    MessageCircle, X, Monitor, Coins, GraduationCap, ChevronRight,
    Link as LinkIcon, Image as ImageIcon, Edit2, FolderOpen, Hash,
    Zap, BookMarked
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('modules');
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [materials, setMaterials] = useState([]);
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [whatsappGroups, setWhatsappGroups] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [exams, setExams] = useState([]);

    const [studentSearch, setStudentSearch] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);

    const [holidayForm, setHolidayForm] = useState({ date: '', name: '', type: 'official', batch: 'All' });
    const [moduleForm, setModuleForm] = useState({ section_id: 'class-notes', subject_name: '', chapter_name: '', file_name: '', file_description: '', drive_link: '' });
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', attachment_link: '', attachment_type: 'pdf', notice_date: new Date().toISOString().split('T')[0] });
    const [whatsappForm, setWhatsappForm] = useState({ name: '', description: '', link: '' });
    const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', registration_link: '', photo_url: '' });
    const [expenseForm, setExpenseForm] = useState({ name: '', amount: '' });
    const [examForm, setExamForm] = useState({ title: '', type: 'Class Assessment', date: '', start_time: '', end_time: '', subject: '', room: '', description: '', batch: 'All' });

    useEffect(() => { checkAdmin(); }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }
        const { data } = await supabase.from('students').select('is_admin, class_roll_no, email').eq('user_id', user.id).single();
        const superAdminEmail = 'jcsayan7@gmail.com';
        const superAdminRoll = '25/EE/092';
        const isUserSuperAdmin = user.email === superAdminEmail || data?.class_roll_no === superAdminRoll;
        if (isUserSuperAdmin) { setIsSuperAdmin(true); setIsAdmin(true); fetchAllData(); }
        else if (data?.is_admin) { setIsAdmin(true); fetchAllData(); }
        else { navigate('/profile'); }
    };

    const fetchAllData = () => {
        fetchStudents(); fetchMaterials(); fetchNotices(); fetchEvents();
        fetchHolidays(); fetchWhatsappGroups(); fetchSyllabus(); fetchExpenses();
        fetchExams();
    };

    const fetchSyllabus = async () => {
        const { data, error } = await supabase.from('syllabus').select('data').single();
        if (!error && data) setSyllabus(data.data);
    };
    const fetchStudents = async () => {
        const { data, error } = await supabase.from('students').select('*').order('class_roll_no', { ascending: true });
        if (!error) setStudents(data);
    };
    const fetchMaterials = async () => {
        const { data, error } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false });
        if (!error) setMaterials(data);
    };
    const fetchNotices = async () => {
        const { data, error } = await supabase.from('notices').select('*').order('notice_date', { ascending: false });
        if (!error) setNotices(data);
    };
    const fetchEvents = async () => {
        const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        if (!error) setEvents(data);
    };
    const fetchHolidays = async () => {
        const { data, error } = await supabase.from('holidays').select('*').order('date', { ascending: true });
        if (!error) setHolidays(data);
    };
    const fetchWhatsappGroups = async () => {
        const { data, error } = await supabase.from('whatsapp_groups').select('*').order('created_at', { ascending: false });
        if (!error) setWhatsappGroups(data);
    };
    const fetchExpenses = async () => {
        const { data, error } = await supabase.from('site_expenses').select('*').order('amount', { ascending: false });
        if (!error) setExpenses(data);
    };
    const fetchExams = async () => {
        const { data, error } = await supabase.from('exams').select('*').order('date', { ascending: true });
        if (!error) setExams(data);
    };

    const showAlert = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 3500);
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const submitData = { ...moduleForm };
        if (submitData.section_id === 'practice-set') submitData.chapter_name = 'General';
        const { error } = await supabase.from('study_materials').insert([submitData]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Study material added successfully!'); setModuleForm({ section_id: 'class-notes', subject_name: '', chapter_name: '', file_name: '', file_description: '', drive_link: '' }); fetchMaterials(); }
        setLoading(false);
    };
    const handleNoticeSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('notices').insert([noticeForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Notice posted!'); setNoticeForm({ title: '', content: '', attachment_link: '', attachment_type: 'pdf', notice_date: new Date().toISOString().split('T')[0] }); fetchNotices(); }
        setLoading(false);
    };
    const handleEventSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('events').insert([eventForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Event created!'); setEventForm({ title: '', description: '', event_date: '', registration_link: '', photo_url: '' }); fetchEvents(); }
        setLoading(false);
    };
    const handleHolidaySubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('holidays').insert([holidayForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Holiday added!'); setHolidayForm({ date: '', name: '', type: 'official', batch: 'All' }); fetchHolidays(); }
        setLoading(false);
    };
    const handleWhatsappSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('whatsapp_groups').insert([whatsappForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'WhatsApp group added!'); setWhatsappForm({ name: '', description: '', link: '' }); fetchWhatsappGroups(); }
        setLoading(false);
    };
    const handleExpenseSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('site_expenses').insert([expenseForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Expense recorded!'); setExpenseForm({ name: '', amount: '' }); fetchExpenses(); }
        setLoading(false);
    };
    const handleExamSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('exams').insert([examForm]);
        if (error) showAlert('error', error.message);
        else { 
            showAlert('success', 'Exam scheduled successfully!'); 
            setExamForm({ title: '', type: 'Class Assessment', date: '', start_time: '', end_time: '', subject: '', room: '', description: '', batch: 'All' }); 
            fetchExams(); 
        }
        setLoading(false);
    };
    const handleDelete = async (table, id) => {
        if (table === 'holidays') {
            const h = holidays.find(i => i.id === id);
            if (h && h.type === 'official' && !isSuperAdmin) { showAlert('error', 'Official holidays are fixed and cannot be deleted.'); return; }
        }
        if (!window.confirm('Delete this item? This action cannot be undone.')) return;
        setLoading(true);
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) showAlert('error', error.message);
        else {
            showAlert('success', 'Deleted successfully!');
            if (table === 'study_materials') fetchMaterials();
            else if (table === 'notices') fetchNotices();
            else if (table === 'events') fetchEvents();
            else if (table === 'holidays') fetchHolidays();
            else if (table === 'whatsapp_groups') fetchWhatsappGroups();
            else if (table === 'site_expenses') fetchExpenses();
            else if (table === 'exams') fetchExams();
        }
        setLoading(false);
    };
    const handleUpdateStudent = async (studentId) => {
        setLoading(true);
        const { error } = await supabase.from('students')
            .update({ 
                donation: editingStudent.donation, 
                files_count: editingStudent.files_count,
                subscription_plan: editingStudent.subscription_plan 
            })
            .eq('id', studentId);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Student updated!'); setEditingStudent(null); fetchStudents(); }
        setLoading(false);
    };

    const getSubjectsList = (sectionId) => {
        if (!syllabus) return [];
        if (sectionId === 'lab-notes') return (syllabus.practical_subjects || []).map(s => s.subject);
        return [...(syllabus.theory_subjects || []), ...(syllabus.practical_subjects || [])].map(s => s.subject);
    };
    const getChaptersList = (subjectName) => {
        if (!syllabus || !subjectName) return [];
        const all = [...(syllabus.theory_subjects || []), ...(syllabus.practical_subjects || [])];
        const sub = all.find(s => s.subject === subjectName);
        if (!sub) return [];
        const list = [];
        (sub.modules || sub.experiments || []).forEach(mod => { mod.chapters?.forEach(ch => list.push(ch.name)); });
        return list;
    };

    if (!isAdmin) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }}>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-color)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Verifying admin access...</p>
        </div>
    );

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.class_roll_no.includes(studentSearch));
    const availableSubjects = getSubjectsList(moduleForm.section_id);
    const availableChapters = getChaptersList(moduleForm.subject_name);

    const navItems = [
        { id: 'modules', icon: <BookOpen size={18} />, label: 'Study Materials', count: materials.length, color: '#3b82f6' },
        { id: 'students', icon: <Users size={18} />, label: 'Students', count: students.length, color: '#8b5cf6' },
        { id: 'notices', icon: <Bell size={18} />, label: 'Notices', count: notices.length, color: '#f59e0b' },
        { id: 'events', icon: <Calendar size={18} />, label: 'Events', count: events.length, color: '#10b981' },
        { id: 'holidays', icon: <GraduationCap size={18} />, label: 'Holidays', count: holidays.length, color: '#ec4899' },
        { id: 'exams', icon: <FileText size={18} />, label: 'Exams', count: exams.length, color: '#f43f5e' },
        { id: 'whatsapp', icon: <MessageCircle size={18} />, label: 'WhatsApp Groups', count: whatsappGroups.length, color: '#22c55e' },
        { id: 'finances', icon: <Coins size={18} />, label: 'Finances', count: expenses.length, color: '#f97316' }
    ];

    return (
        <div className="admin-v2-layout">
            {/* Desktop restriction for mobile */}
            <div className="mobile-admin-restriction">
                <div className="restriction-content">
                    <Monitor size={48} />
                    <h2>Desktop Only</h2>
                    <p>Please use a computer to manage data.</p>
                    <button onClick={() => navigate('/profile')}>Go to Profile</button>
                </div>
            </div>

            {/* Toast */}
            {status.message && (
                <div className={`admin-toast ${status.type}`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{status.message}</span>
                </div>
            )}

            {/* Sidebar */}
            <aside className="admin-v2-sidebar">
                <div className="admin-v2-brand">
                    <div className="brand-icon"><Zap size={20} /></div>
                    <div>
                        <div className="brand-name">{isSuperAdmin ? 'Superadmin' : 'Admin Panel'}</div>
                        <div className="brand-sub">EEvolution CMS</div>
                    </div>
                </div>

                <div className="admin-v2-nav-label">MANAGEMENT</div>
                <nav className="admin-v2-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`admin-v2-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{ '--nav-color': item.color }}
                        >
                            <span className="nav-btn-icon">{item.icon}</span>
                            <span className="nav-btn-label">{item.label}</span>
                            <span className="nav-btn-count">{item.count}</span>
                        </button>
                    ))}
                </nav>

                <button className="admin-v2-exit-btn" onClick={() => navigate('/profile')}>
                    <ArrowLeft size={18} /> Exit to App
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-v2-main">
                {/* ========== MODULES ========== */}
                {activeTab === 'modules' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><BookOpen size={24} /> Study Materials</h1>
                                <p>Upload lecture notes, books, practice sets and lab files.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{materials.length}</div>
                                <div className="stat-lbl">Total Files</div>
                            </div>
                        </div>

                        <div className="admin-v2-two-col">
                            {/* Add Form */}
                            <div className="admin-v2-card">
                                <div className="card-v2-header">
                                    <Plus size={18} /> <span>Upload New Material</span>
                                </div>
                                <form onSubmit={handleModuleSubmit} className="admin-v2-form">
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label><FolderOpen size={14} /> Section</label>
                                            <select value={moduleForm.section_id} onChange={e => setModuleForm({ ...moduleForm, section_id: e.target.value, subject_name: '', chapter_name: '' })}>
                                                <option value="class-notes">📝 Class Notes</option>
                                                <option value="practice-set">📋 Practice Sets</option>
                                                <option value="books">📚 Books</option>
                                                <option value="handwritten">✏️ Handwritten & PPTs</option>
                                                <option value="lab-notes">🧪 Lab Notes</option>
                                            </select>
                                        </div>
                                        <div className="fv2-group">
                                            <label><BookMarked size={14} /> Subject</label>
                                            <select value={moduleForm.subject_name} onChange={e => setModuleForm({ ...moduleForm, subject_name: e.target.value, chapter_name: '' })} required>
                                                <option value="">Select Subject</option>
                                                {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    {moduleForm.section_id !== 'practice-set' && (
                                        <div className="fv2-group">
                                            <label><Hash size={14} /> Chapter</label>
                                            <select value={moduleForm.chapter_name} onChange={e => setModuleForm({ ...moduleForm, chapter_name: e.target.value })} required>
                                                <option value="">Select Chapter</option>
                                                {availableChapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label><FileText size={14} /> File Name</label>
                                            <input placeholder="e.g., Unit 1 Lecture Notes" value={moduleForm.file_name} onChange={e => setModuleForm({ ...moduleForm, file_name: e.target.value })} required />
                                        </div>
                                        <div className="fv2-group">
                                            <label><Edit2 size={14} /> Description</label>
                                            <input placeholder="Short description of the file" value={moduleForm.file_description} onChange={e => setModuleForm({ ...moduleForm, file_description: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="fv2-group">
                                        <label><LinkIcon size={14} /> Google Drive Link</label>
                                        <input placeholder="https://drive.google.com/..." value={moduleForm.drive_link} onChange={e => setModuleForm({ ...moduleForm, drive_link: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="admin-v2-submit-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                                        Upload Material
                                    </button>
                                </form>
                            </div>

                            {/* List */}
                            <div className="admin-v2-card">
                                <div className="card-v2-header">
                                    <FileText size={18} /> <span>All Materials</span>
                                    <span className="header-count">{materials.length}</span>
                                </div>
                                <div className="admin-v2-list">
                                    {materials.map(m => (
                                        <div key={m.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><FileText size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">{m.file_name}</div>
                                                <div className="list-item-sub">{m.subject_name} · {m.chapter_name} · <span className="section-badge-mini">{m.section_id}</span></div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('study_materials', m.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {materials.length === 0 && <div className="empty-list-msg">No materials uploaded yet.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== STUDENTS ========== */}
                {activeTab === 'students' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><Users size={24} /> Students</h1>
                                <p>View and edit student donation amounts and file contribution counts.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{students.length}</div>
                                <div className="stat-lbl">Total Students</div>
                            </div>
                        </div>
                        <div className="admin-v2-card full-width">
                            <div className="card-v2-header">
                                <Users size={18} /> <span>Student Records</span>
                                <div className="header-search">
                                    <Search size={15} />
                                    <input placeholder="Search by name or roll no..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
                                </div>
                            </div>
                            <div className="students-v2-grid">
                                {filteredStudents.map(student => (
                                    <div key={student.id} className={`student-v2-card ${editingStudent?.id === student.id ? 'is-editing' : ''}`}>
                                        {/* Top row: avatar + info + edit btn */}
                                        <div className="student-v2-top-row">
                                            <div className="student-v2-avatar">
                                                {student.avatar_url ? (
                                                    <img src={student.avatar_url} alt="" />
                                                ) : (
                                                    student.name?.charAt(0).toUpperCase()
                                                )}
                                                {student.user_id && <div className="online-indicator" title="Registered Student"></div>}
                                            </div>
                                            <div className="student-v2-info">
                                                <div className="student-v2-name">
                                                    {student.name}
                                                    {student.user_id && <span className="reg-badge">Registered</span>}
                                                    <span className={`plan-badge ${student.subscription_plan || 'standard'}`}>
                                                        {student.subscription_plan || 'standard'}
                                                    </span>
                                                </div>
                                                <div className="student-v2-roll">
                                                    {student.class_roll_no}
                                                    {student.batch && <span className={`batch-badge-mini ${student.batch === 'Batch 1' ? 'b1' : 'b2'}`}>{student.batch}</span>}
                                                </div>
                                                <div className="student-v2-stats">
                                                    <span className="stat-pill">
                                                        <Coins size={12} /> ₹{student.donation || 0}
                                                    </span>
                                                    <span className="stat-pill">
                                                        <FileText size={12} /> {student.files_count || 0} files
                                                    </span>
                                                </div>
                                            </div>
                                            {editingStudent?.id === student.id ? (
                                                <button className="cancel-v2-btn" onClick={() => setEditingStudent(null)} title="Cancel"><X size={15} /></button>
                                            ) : (
                                                <button className="edit-v2-btn" onClick={() => setEditingStudent(student)}>
                                                    <Edit2 size={13} /> Edit
                                                </button>
                                            )}
                                        </div>

                                        {/* Edit Panel - expands below when editing */}
                                        {editingStudent?.id === student.id && (
                                            <div className="student-v2-edit-panel">
                                                <div className="edit-panel-fields">
                                                    <div className="edit-panel-field">
                                                        <label><Coins size={13} /> Donation (₹)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={editingStudent.donation || 0}
                                                            onChange={e => setEditingStudent({ ...editingStudent, donation: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div className="edit-panel-field">
                                                        <label><FileText size={13} /> Files Uploaded</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={editingStudent.files_count || 0}
                                                            onChange={e => setEditingStudent({ ...editingStudent, files_count: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div className="edit-panel-field" style={{ gridColumn: 'span 2' }}>
                                                        <label><Zap size={13} /> Subscription Plan</label>
                                                        <select
                                                            value={editingStudent.subscription_plan || 'standard'}
                                                            onChange={e => setEditingStudent({ ...editingStudent, subscription_plan: e.target.value })}
                                                            className="plan-select"
                                                        >
                                                            <option value="standard">Standard Plan (Basic)</option>
                                                            <option value="plus">PLUS Plan (Gate + Sem Papers)</option>
                                                            <option value="premium">PREMIUM Plan (Merch + Subscriptions)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <button className="save-v2-btn" onClick={() => handleUpdateStudent(student.id)} disabled={loading}>
                                                    {loading ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== NOTICES ========== */}
                {activeTab === 'notices' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><Bell size={24} /> Notices</h1>
                                <p>Post important announcements to the batch.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{notices.length}</div>
                                <div className="stat-lbl">Active Notices</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Post New Notice</span></div>
                                <form onSubmit={handleNoticeSubmit} className="admin-v2-form">
                                    <div className="fv2-group">
                                        <label>Notice Title</label>
                                        <input placeholder="e.g., Lab Exam Reschedule" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
                                    </div>
                                    <div className="fv2-group">
                                        <label>Content / Details</label>
                                        <textarea placeholder="Write the full notice content here..." value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })} rows={5} required />
                                    </div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label>Date</label>
                                            <input type="date" value={noticeForm.notice_date} onChange={e => setNoticeForm({ ...noticeForm, notice_date: e.target.value })} required />
                                        </div>
                                        <div className="fv2-group">
                                            <label>Attachment URL (Optional)</label>
                                            <input placeholder="https://..." value={noticeForm.attachment_link} onChange={e => setNoticeForm({ ...noticeForm, attachment_link: e.target.value })} />
                                        </div>
                                    </div>
                                    <button type="submit" className="admin-v2-submit-btn notices-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Bell size={16} />} Post Notice
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Bell size={18} /> <span>All Notices</span><span className="header-count">{notices.length}</span></div>
                                <div className="admin-v2-list">
                                    {notices.map(n => (
                                        <div key={n.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Bell size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">{n.title}</div>
                                                <div className="list-item-sub">{new Date(n.notice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('notices', n.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {notices.length === 0 && <div className="empty-list-msg">No notices posted yet.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== EVENTS ========== */}
                {activeTab === 'events' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><Calendar size={24} /> Events</h1>
                                <p>Create and manage college events and workshops.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{events.length}</div>
                                <div className="stat-lbl">Total Events</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Create New Event</span></div>
                                <form onSubmit={handleEventSubmit} className="admin-v2-form">
                                    <div className="fv2-group"><label>Event Title</label><input placeholder="e.g., Annual Tech Fest 2026" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required /></div>
                                    <div className="fv2-group"><label>Description</label><textarea placeholder="Describe the event..." value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} rows={3} required /></div>
                                    <div className="fv2-row">
                                        <div className="fv2-group"><label>Date & Time</label><input type="datetime-local" value={eventForm.event_date} onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })} required /></div>
                                        <div className="fv2-group"><label>Registration Link</label><input placeholder="https://forms.gle/..." value={eventForm.registration_link} onChange={e => setEventForm({ ...eventForm, registration_link: e.target.value })} required /></div>
                                    </div>
                                    <div className="fv2-group"><label>Photo URL (Optional)</label><input placeholder="https://..." value={eventForm.photo_url} onChange={e => setEventForm({ ...eventForm, photo_url: e.target.value })} /></div>
                                    <button type="submit" className="admin-v2-submit-btn events-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Calendar size={16} />} Create Event
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Calendar size={18} /> <span>All Events</span><span className="header-count">{events.length}</span></div>
                                <div className="admin-v2-list">
                                    {events.map(ev => (
                                        <div key={ev.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Calendar size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">{ev.title}</div>
                                                <div className="list-item-sub">{new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('events', ev.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {events.length === 0 && <div className="empty-list-msg">No events yet.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== HOLIDAYS ========== */}
                {activeTab === 'holidays' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><GraduationCap size={24} /> Holidays</h1>
                                <p>Manage official and unofficial holidays for the academic calendar.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{holidays.length}</div>
                                <div className="stat-lbl">Total Holidays</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Add Holiday</span></div>
                                <form onSubmit={handleHolidaySubmit} className="admin-v2-form">
                                    <div className="fv2-group"><label>Holiday Name</label><input placeholder="e.g., Durga Puja" value={holidayForm.name} onChange={e => setHolidayForm({ ...holidayForm, name: e.target.value })} required /></div>
                                    <div className="fv2-group"><label>Date</label><input type="date" value={holidayForm.date} onChange={e => setHolidayForm({ ...holidayForm, date: e.target.value })} required /></div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label>Holiday Type</label>
                                            <select value={holidayForm.type} onChange={e => setHolidayForm({ ...holidayForm, type: e.target.value })}>
                                                <option value="official">🏛️ Official Holiday (Fixed)</option>
                                                <option value="unofficial">📅 Unofficial / Prep Holiday</option>
                                                <option value="event">🎉 Extra-curricular Event Day</option>
                                            </select>
                                        </div>
                                        <div className="fv2-group">
                                            <label>Target Batch</label>
                                            <select value={holidayForm.batch} onChange={e => setHolidayForm({ ...holidayForm, batch: e.target.value })}>
                                                <option value="All">All Batches</option>
                                                <option value="Batch 1">Batch 1</option>
                                                <option value="Batch 2">Batch 2</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="admin-v2-submit-btn holiday-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Add Holiday
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><GraduationCap size={18} /> <span>All Holidays</span><span className="header-count">{holidays.length}</span></div>
                                <div className="admin-v2-list">
                                    {holidays.map(h => (
                                        <div key={h.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}><GraduationCap size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">
                                                    {h.name}
                                                    <span className={`type-badge-v2 ${h.type || 'official'}`}>{h.type || 'official'}</span>
                                                </div>
                                                <div className="list-item-sub">{h.date}</div>
                                            </div>
                                            {(h.type !== 'official' || isSuperAdmin) && (
                                                <button className="list-delete-btn" onClick={() => handleDelete('holidays', h.id)}><Trash2 size={14} /></button>
                                            )}
                                        </div>
                                    ))}
                                    {holidays.length === 0 && <div className="empty-list-msg">No holidays added.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== WHATSAPP ========== */}
                {activeTab === 'whatsapp' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><MessageCircle size={24} /> WhatsApp Groups</h1>
                                <p>Add subject-specific group links for student connectivity.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{whatsappGroups.length}</div>
                                <div className="stat-lbl">Active Groups</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Add Group</span></div>
                                <form onSubmit={handleWhatsappSubmit} className="admin-v2-form">
                                    <div className="fv2-group"><label>Group Name</label><input placeholder="e.g., Maths - 2 Study Group" value={whatsappForm.name} onChange={e => setWhatsappForm({ ...whatsappForm, name: e.target.value })} required /></div>
                                    <div className="fv2-group"><label>Description</label><input placeholder="What this group is for" value={whatsappForm.description} onChange={e => setWhatsappForm({ ...whatsappForm, description: e.target.value })} required /></div>
                                    <div className="fv2-group"><label>WhatsApp Invite Link</label><input placeholder="https://chat.whatsapp.com/..." value={whatsappForm.link} onChange={e => setWhatsappForm({ ...whatsappForm, link: e.target.value })} required /></div>
                                    <button type="submit" className="admin-v2-submit-btn whatsapp-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <MessageCircle size={16} />} Add Group
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><MessageCircle size={18} /> <span>All Groups</span><span className="header-count">{whatsappGroups.length}</span></div>
                                <div className="admin-v2-list">
                                    {whatsappGroups.map(wg => (
                                        <div key={wg.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}><MessageCircle size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">{wg.name}</div>
                                                <div className="list-item-sub">{wg.description}</div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('whatsapp_groups', wg.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {whatsappGroups.length === 0 && <div className="empty-list-msg">No groups added.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== FINANCES ========== */}
                {activeTab === 'finances' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><Coins size={24} /> Finances</h1>
                                <p>Track platform expenses. Donations are auto-pulled from student records.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">₹{expenses.reduce((s, e) => s + Number(e.amount || 0), 0)}</div>
                                <div className="stat-lbl">Total Expenses</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Log New Expense</span></div>
                                <form onSubmit={handleExpenseSubmit} className="admin-v2-form">
                                    <div className="fv2-group"><label>Expense Name</label><input placeholder="e.g., Domain Renewal" value={expenseForm.name} onChange={e => setExpenseForm({ ...expenseForm, name: e.target.value })} required /></div>
                                    <div className="fv2-group"><label>Amount (₹)</label><input type="number" placeholder="e.g., 2000" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} required /></div>
                                    <button type="submit" className="admin-v2-submit-btn finances-btn" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Coins size={16} />} Log Expense
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Coins size={18} /> <span>All Expenses</span><span className="header-count">{expenses.length}</span></div>
                                <div className="admin-v2-list">
                                    {expenses.map(exp => (
                                        <div key={exp.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}><Coins size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">{exp.name}</div>
                                                <div className="list-item-sub" style={{ color: '#f97316', fontWeight: '700' }}>₹{exp.amount}</div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('site_expenses', exp.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {expenses.length === 0 && <div className="empty-list-msg">No expenses logged.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* ========== EXAMS ========== */}
                {activeTab === 'exams' && (
                    <div className="admin-v2-page">
                        <div className="admin-v2-page-header">
                            <div>
                                <h1><FileText size={24} /> Examination Management</h1>
                                <p>Schedule Class Assessments, Practicals, and End Sem exams.</p>
                            </div>
                            <div className="page-header-stat">
                                <div className="stat-num">{exams.length}</div>
                                <div className="stat-lbl">Scheduled Exams</div>
                            </div>
                        </div>
                        <div className="admin-v2-two-col">
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><Plus size={18} /> <span>Schedule New Exam</span></div>
                                <form onSubmit={handleExamSubmit} className="admin-v2-form">
                                    <div className="fv2-group">
                                        <label>Exam Title</label>
                                        <input placeholder="e.g., Mathematics II - Second Internal" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} required />
                                    </div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label>Exam Type</label>
                                            <select value={examForm.type} onChange={e => setExamForm({ ...examForm, type: e.target.value })}>
                                                <option value="Class Assessment">📝 Class Assessment</option>
                                                <option value="Practical">🧪 Practical Exam</option>
                                                <option value="End Sem">🎓 End Sem Exam</option>
                                            </select>
                                        </div>
                                        <div className="fv2-group">
                                            <label>Date</label>
                                            <input type="date" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label><Clock size={14} /> Start Time</label>
                                            <input type="time" value={examForm.start_time} onChange={e => setExamForm({ ...examForm, start_time: e.target.value })} required />
                                        </div>
                                        <div className="fv2-group">
                                            <label><Clock size={14} /> End Time</label>
                                            <input type="time" value={examForm.end_time} onChange={e => setExamForm({ ...examForm, end_time: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label>Subject (Optional)</label>
                                            <input placeholder="e.g., MATH-201" value={examForm.subject} onChange={e => setExamForm({ ...examForm, subject: e.target.value })} />
                                        </div>
                                    <div className="fv2-row">
                                        <div className="fv2-group">
                                            <label>Room / Lab</label>
                                            <input placeholder="e.g., CR-2 or Machine Lab" value={examForm.room} onChange={e => setExamForm({ ...examForm, room: e.target.value })} />
                                        </div>
                                        <div className="fv2-group">
                                            <label>Target Batch</label>
                                            <select value={examForm.batch} onChange={e => setExamForm({ ...examForm, batch: e.target.value })}>
                                                <option value="All">All Batches</option>
                                                <option value="Batch 1">Batch 1</option>
                                                <option value="Batch 2">Batch 2</option>
                                            </select>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="fv2-group">
                                        <label>Description (Optional)</label>
                                        <textarea placeholder="e.g., Syllabus covers Unit 3 & 4" value={examForm.description} onChange={e => setExamForm({ ...examForm, description: e.target.value })} rows={2} />
                                    </div>
                                    <button type="submit" className="admin-v2-submit-btn" style={{ background: '#f43f5e' }} disabled={loading}>
                                        {loading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Schedule Exam
                                    </button>
                                </form>
                            </div>
                            <div className="admin-v2-card">
                                <div className="card-v2-header"><FileText size={18} /> <span>Scheduled Exams</span><span className="header-count">{exams.length}</span></div>
                                <div className="admin-v2-list">
                                    {exams.map(ex => (
                                        <div key={ex.id} className="admin-v2-list-item">
                                            <div className="list-item-icon" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}><FileText size={16} /></div>
                                            <div className="list-item-details">
                                                <div className="list-item-title">
                                                    {ex.title}
                                                    <span className={`type-badge-v2 ${ex.type.toLowerCase().replace(' ', '-')}`}>{ex.type}</span>
                                                </div>
                                                <div className="list-item-sub">{new Date(ex.date).toLocaleDateString()} · {ex.start_time} - {ex.end_time}</div>
                                            </div>
                                            <button className="list-delete-btn" onClick={() => handleDelete('exams', ex.id)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {exams.length === 0 && <div className="empty-list-msg">No exams scheduled.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
