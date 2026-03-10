import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Bell,
    Calendar,
    Users,
    Plus,
    Save,
    Trash2,
    Search,
    ChevronRight,
    Loader2,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Clock,
    Link as LinkIcon,
    FileText,
    Image as ImageIcon,
    MessageCircle,
    Menu,
    X,
    Monitor,
    Smartphone,
    Info,
    Coins,
    Award,
    GraduationCap
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

    // State for Lists
    const [materials, setMaterials] = useState([]);
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [whatsappGroups, setWhatsappGroups] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form States
    const [studentSearch, setStudentSearch] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);

    const [routineForm, setRoutineForm] = useState({ day: 'Monday', start_time: '', end_time: '', subject: '', prof: '', room: '' });
    const [holidayForm, setHolidayForm] = useState({ date: '', name: '', type: 'official' });
    const [moduleForm, setModuleForm] = useState({ section_id: 'class-notes', subject_name: '', chapter_name: '', file_name: '', file_description: '', drive_link: '' });
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', attachment_link: '', attachment_type: 'pdf', notice_date: new Date().toISOString().split('T')[0] });
    const [whatsappForm, setWhatsappForm] = useState({ name: '', description: '', link: '' });
    const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', registration_link: '', photo_url: '' });
    const [expenseForm, setExpenseForm] = useState({ name: '', amount: '' });

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }

        const { data, error } = await supabase.from('students').select('is_admin, class_roll_no, email').eq('user_id', user.id).single();

        // Define SuperAdmin: Sayan (jcsayan7@gmail.com / 25/EE/092)
        const superAdminEmail = 'jcsayan7@gmail.com';
        const superAdminRoll = '25/EE/092';
        const isUserSuperAdmin = user.email === superAdminEmail || data?.class_roll_no === superAdminRoll;

        if (isUserSuperAdmin) {
            setIsSuperAdmin(true);
            setIsAdmin(true);
            fetchAllData();
        } else if (data?.is_admin) {
            setIsAdmin(true);
            fetchAllData();
        } else {
            navigate('/profile');
        }
    };

    const fetchAllData = () => {
        fetchStudents();
        fetchMaterials();
        fetchNotices();
        fetchEvents();
        fetchRoutines();
        fetchHolidays();
        fetchWhatsappGroups();
        fetchSyllabus();
        fetchExpenses();
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

    const fetchRoutines = async () => {
        const { data, error } = await supabase.from('routines').select('*').order('day', { ascending: true }).order('start_time', { ascending: true });
        if (!error) setRoutines(data);
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



    const showAlert = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const submitData = { ...moduleForm };
        if (submitData.section_id === 'practice-set') {
            submitData.chapter_name = 'General'; // Default placeholder for non-chapter items
        }
        const { error } = await supabase.from('study_materials').insert([submitData]);
        if (error) showAlert('error', error.message);
        else {
            showAlert('success', 'Module added!');
            setModuleForm({ section_id: 'class-notes', subject_name: '', chapter_name: '', file_name: '', file_description: '', drive_link: '' });
            fetchMaterials();
        }
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

    const handleRoutineSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('routines').insert([routineForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Routine updated!'); setRoutineForm({ day: 'Monday', start_time: '', end_time: '', subject: '', prof: '', room: '' }); fetchRoutines(); }
        setLoading(false);
    };

    const handleHolidaySubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('holidays').insert([holidayForm]);
        if (error) showAlert('error', error.message);
        else {
            showAlert('success', 'Holiday added!');
            setHolidayForm({ date: '', name: '', type: 'official' });
            fetchHolidays();
        }
        setLoading(false);
    };

    const handleWhatsappSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('whatsapp_groups').insert([whatsappForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Group added!'); setWhatsappForm({ name: '', description: '', link: '' }); fetchWhatsappGroups(); }
        setLoading(false);
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const { error } = await supabase.from('site_expenses').insert([expenseForm]);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Expense added!'); setExpenseForm({ name: '', amount: '' }); fetchExpenses(); }
        setLoading(false);
    };

    const handleDelete = async (table, id) => {
        if (table === 'holidays') {
            const h = holidays.find(i => i.id === id);
            if (h && h.type === 'official' && !isSuperAdmin) {
                showAlert('error', 'Official holidays are fixed and cannot be deleted.');
                return;
            }
        }

        if (!window.confirm('Delete this item?')) return;
        setLoading(true);
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) showAlert('error', error.message);
        else {
            showAlert('success', 'Deleted!');
            if (table === 'study_materials') fetchMaterials();
            else if (table === 'notices') fetchNotices();
            else if (table === 'events') fetchEvents();
            else if (table === 'routines') fetchRoutines();
            else if (table === 'holidays') fetchHolidays();
            else if (table === 'whatsapp_groups') fetchWhatsappGroups();
            else if (table === 'site_expenses') fetchExpenses();
        }
        setLoading(false);
    };

    const handleUpdateStudent = async (studentId) => {
        setLoading(true);
        const { error } = await supabase.from('students').update({ donation: editingStudent.donation, files_count: editingStudent.files_count }).eq('id', studentId);
        if (error) showAlert('error', error.message);
        else { showAlert('success', 'Student updated!'); setEditingStudent(null); fetchStudents(); }
        setLoading(false);
    };

    const getSubjectsList = (sectionId) => {
        if (!syllabus) return [];
        if (sectionId === 'lab-notes') {
            return (syllabus.practical_subjects || []).map(s => s.subject);
        }
        return [...(syllabus.theory_subjects || []), ...(syllabus.practical_subjects || [])].map(s => s.subject);
    };

    const getChaptersList = (subjectName) => {
        if (!syllabus || !subjectName) return [];
        const allSyllabusSubjects = [...(syllabus.theory_subjects || []), ...(syllabus.practical_subjects || [])];
        const sub = allSyllabusSubjects.find(s => s.subject === subjectName);
        if (!sub) return [];

        const chaptersList = [];
        (sub.modules || sub.experiments || []).forEach(mod => {
            mod.chapters?.forEach((ch) => {
                chaptersList.push(ch.name);
            });
        });
        return chaptersList;
    };

    if (!isAdmin) return <div className="admin-loading"><Loader2 className="spinner" /></div>;

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.class_roll_no.includes(studentSearch));
    const availableSubjects = getSubjectsList(moduleForm.section_id);
    const availableChapters = getChaptersList(moduleForm.subject_name);

    return (
        <div className={`admin-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {status.message && (
                <div className={`status-toast ${status.type}`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{status.message}</span>
                </div>
            )}

            <div className="mobile-admin-restriction">
                <div className="restriction-content">
                    <Monitor size={48} />
                    <h2>Desktop Only</h2>
                    <p>Please use a computer to manage data.</p>
                    <button onClick={() => navigate('/profile')}>Go to Profile</button>
                </div>
            </div>

            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`admin-sidebar ${isSidebarOpen ? 'show' : ''}`}>
                <div className="admin-brand">
                    <LayoutDashboard size={24} />
                    <span>{isSuperAdmin ? 'Superadmin' : 'Admin Panel'}</span>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'modules' ? 'active' : ''} onClick={() => setActiveTab('modules')}><BookOpen size={20} /> <span>Modules</span></button>
                    <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}><Users size={20} /> <span>Students</span></button>
                    <button className={activeTab === 'notices' ? 'active' : ''} onClick={() => setActiveTab('notices')}><Bell size={20} /> <span>Notices</span></button>
                    <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}><Calendar size={20} /> <span>Events</span></button>
                    <button className={activeTab === 'routine' ? 'active' : ''} onClick={() => setActiveTab('routine')}><Clock size={20} /> <span>Routine</span></button>
                    <button className={activeTab === 'holidays' ? 'active' : ''} onClick={() => setActiveTab('holidays')}><Calendar size={20} /> <span>Holidays</span></button>
                    <button className={activeTab === 'whatsapp' ? 'active' : ''} onClick={() => setActiveTab('whatsapp')}><MessageCircle size={20} /> <span>WhatsApp</span></button>
                    <button className={activeTab === 'finances' ? 'active' : ''} onClick={() => setActiveTab('finances')}><Coins size={20} /> <span>Finances</span></button>
                    <button className="exit-btn-nav" onClick={() => navigate('/profile')}><ArrowLeft size={20} /> <span>Exit</span></button>
                </nav>
            </div>

            <main className="admin-main">
                {activeTab === 'modules' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Material</span></h2>
                            <form onSubmit={handleModuleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group"><label>Section</label><select value={moduleForm.section_id} onChange={(e) => setModuleForm({ ...moduleForm, section_id: e.target.value })}><option value="class-notes">Class Notes</option><option value="practice-set">Practice Sets</option><option value="books">Books</option><option value="handwritten">Handwritten & PPTs</option><option value="lab-notes">Lab Notes</option></select></div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <select value={moduleForm.subject_name} onChange={(e) => setModuleForm({ ...moduleForm, subject_name: e.target.value, chapter_name: '' })} required>
                                            <option value="">Select Subject</option>
                                            {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                    </div>
                                    {moduleForm.section_id !== 'practice-set' && (
                                        <div className="form-group">
                                            <label>Chapter Name</label>
                                            <select value={moduleForm.chapter_name} onChange={(e) => setModuleForm({ ...moduleForm, chapter_name: e.target.value })} required>
                                                <option value="">Select Chapter</option>
                                                {availableChapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group"><label>File Name</label><input value={moduleForm.file_name} onChange={(e) => setModuleForm({ ...moduleForm, file_name: e.target.value })} required /></div>
                                    <div className="form-group"><label>File Description</label><input value={moduleForm.file_description} onChange={(e) => setModuleForm({ ...moduleForm, file_description: e.target.value })} required /></div>
                                    <div className="form-group full"><label>Drive Link</label><input value={moduleForm.drive_link} onChange={(e) => setModuleForm({ ...moduleForm, drive_link: e.target.value })} required /></div>
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}><Plus /> Add</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Materials</span></h2>
                            <div className="management-list">
                                {materials.map(m => (
                                    <div key={m.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{m.subject_name} - {m.chapter_name}</h4>
                                            <span>{m.file_name}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('study_materials', m.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="admin-card-section">
                        <h2>Manage <span className="highlight">Students</span></h2>
                        <div className="mini-search" style={{ marginBottom: '1.5rem' }}>
                            <Search size={18} />
                            <input placeholder="Search..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} style={{ width: '100%' }} />
                        </div>
                        <div className="students-list-admin">
                            {filteredStudents.map(student => (
                                <div key={student.id} className="student-admin-card">
                                    <div className="student-base-info">
                                        <h4>{student.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{student.class_roll_no}</p>
                                    </div>
                                    {editingStudent?.id === student.id ? (
                                        <div className="student-edit-fields">
                                            <div className="input-with-label">
                                                <label>Donation</label>
                                                <input type="number" value={editingStudent.donation || 0} onChange={(e) => setEditingStudent({ ...editingStudent, donation: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="input-with-label">
                                                <label>Files</label>
                                                <input type="number" value={editingStudent.files_count || 0} onChange={(e) => setEditingStudent({ ...editingStudent, files_count: parseInt(e.target.value) })} />
                                            </div>
                                            <button className="save-mini-btn" onClick={() => handleUpdateStudent(student.id)} disabled={loading}><Save size={18} /></button>
                                            <button className="delete-btn" onClick={() => setEditingStudent(null)}><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <div className="student-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.9rem' }}>₹{student.donation || 0} | {student.files_count || 0} Files</span>
                                            <button className="submit-btn" style={{ margin: 0, padding: '0.5rem 1rem', minWidth: 'auto', WebkitTextFillColor: 'white' }} onClick={() => setEditingStudent(student)}>Edit</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Notice</span></h2>
                            <form onSubmit={handleNoticeSubmit} className="admin-form">
                                <div className="form-group"><label>Title</label><input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required /></div>
                                <div className="form-group"><label>Content</label><textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} rows="4" required /></div>
                                <div className="form-group"><label>Attachment URL (Optional)</label><input value={noticeForm.attachment_link} onChange={(e) => setNoticeForm({ ...noticeForm, attachment_link: e.target.value })} /></div>
                                <div className="form-group"><label>Date</label><input type="date" value={noticeForm.notice_date} onChange={(e) => setNoticeForm({ ...noticeForm, notice_date: e.target.value })} required /></div>
                                <button type="submit" className="submit-btn notice" disabled={loading}><Plus /> Add Notice</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Notices</span></h2>
                            <div className="management-list">
                                {notices.map(notice => (
                                    <div key={notice.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{notice.title}</h4>
                                            <span>{new Date(notice.notice_date).toLocaleDateString()}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('notices', notice.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Event</span></h2>
                            <form onSubmit={handleEventSubmit} className="admin-form">
                                <div className="form-group"><label>Title</label><input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required /></div>
                                <div className="form-group"><label>Description</label><textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows="3" required /></div>
                                <div className="form-group"><label>Date (Time format)</label><input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} required /></div>
                                <div className="form-group"><label>Registration Link</label><input value={eventForm.registration_link} onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })} required /></div>
                                <div className="form-group"><label>Photo URL (Optional)</label><input value={eventForm.photo_url} onChange={(e) => setEventForm({ ...eventForm, photo_url: e.target.value })} /></div>
                                <button type="submit" className="submit-btn event" disabled={loading}><Plus /> Create Event</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Events</span></h2>
                            <div className="management-list">
                                {events.map(ev => (
                                    <div key={ev.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{ev.title}</h4>
                                            <span>{new Date(ev.event_date).toLocaleDateString()}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('events', ev.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'routine' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Class</span></h2>
                            <form onSubmit={handleRoutineSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group"><label>Day</label><select value={routineForm.day} onChange={(e) => setRoutineForm({ ...routineForm, day: e.target.value })}><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></div>
                                    <div className="form-group"><label>Subject</label><input value={routineForm.subject} onChange={(e) => setRoutineForm({ ...routineForm, subject: e.target.value })} required /></div>
                                    <div className="form-group"><label>Start Time</label><input type="time" value={routineForm.start_time} onChange={(e) => setRoutineForm({ ...routineForm, start_time: e.target.value })} required /></div>
                                    <div className="form-group"><label>End Time</label><input type="time" value={routineForm.end_time} onChange={(e) => setRoutineForm({ ...routineForm, end_time: e.target.value })} required /></div>
                                    <div className="form-group"><label>Professor</label><input value={routineForm.prof} onChange={(e) => setRoutineForm({ ...routineForm, prof: e.target.value })} required /></div>
                                    <div className="form-group"><label>Room</label><input value={routineForm.room} onChange={(e) => setRoutineForm({ ...routineForm, room: e.target.value })} required /></div>
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}><Plus /> Add Class</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Routine</span></h2>
                            <div className="management-list">
                                {routines.map(r => (
                                    <div key={r.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{r.subject} ({r.day})</h4>
                                            <span>{r.start_time} - {r.end_time} | {r.prof}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('routines', r.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'holidays' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Holiday</span></h2>
                            <form onSubmit={handleHolidaySubmit} className="admin-form">
                                <div className="form-group"><label>Name</label><input value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} placeholder="e.g., Exam Prep Break" required /></div>
                                <div className="form-group"><label>Date</label><input type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} required /></div>
                                <div className="form-group">
                                    <label>Holiday Type</label>
                                    <select value={holidayForm.type} onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}>
                                        <option value="official">Official Holiday (Fixed)</option>
                                        <option value="unofficial">Unofficial / Prep Holiday</option>
                                        <option value="event">Extra-curricular Event Day</option>
                                    </select>
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}><Plus /> Add</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Holidays</span></h2>
                            <div className="management-list">
                                {holidays.map(h => (
                                    <div key={h.id} className="management-item">
                                        <div className="item-info">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h4>{h.name}</h4>
                                                <span className={`type-badge-mini ${h.type || 'official'}`}>{h.type || 'official'}</span>
                                            </div>
                                            <span>{h.date}</span>
                                        </div>
                                        {(h.type !== 'official' || isSuperAdmin) && (
                                            <button className="delete-btn" onClick={() => handleDelete('holidays', h.id)}><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'whatsapp' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Group</span></h2>
                            <form onSubmit={handleWhatsappSubmit} className="admin-form">
                                <div className="form-group"><label>Name</label><input value={whatsappForm.name} onChange={(e) => setWhatsappForm({ ...whatsappForm, name: e.target.value })} required /></div>
                                <div className="form-group"><label>Description</label><input value={whatsappForm.description} onChange={(e) => setWhatsappForm({ ...whatsappForm, description: e.target.value })} required /></div>
                                <div className="form-group"><label>Link URL</label><input value={whatsappForm.link} onChange={(e) => setWhatsappForm({ ...whatsappForm, link: e.target.value })} required /></div>
                                <button type="submit" className="submit-btn" disabled={loading}><Plus /> Add</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Groups</span></h2>
                            <div className="management-list">
                                {whatsappGroups.map(wg => (
                                    <div key={wg.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{wg.name}</h4>
                                            <span>{wg.description}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('whatsapp_groups', wg.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'finances' && (
                    <div className="admin-content-split">
                        <div className="admin-card-section">
                            <h2>Add <span className="highlight">Expense</span></h2>
                            <form onSubmit={handleExpenseSubmit} className="admin-form">
                                <div className="form-group"><label>Expense Name</label><input value={expenseForm.name} onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })} required /></div>
                                <div className="form-group"><label>Amount (₹)</label><input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required /></div>
                                <button type="submit" className="submit-btn" disabled={loading}><Plus /> Add</button>
                            </form>
                        </div>
                        <div className="admin-card-section manage-section">
                            <h2>Manage <span className="highlight">Expenses</span></h2>
                            <div className="management-list">
                                {expenses.map(exp => (
                                    <div key={exp.id} className="management-item">
                                        <div className="item-info">
                                            <h4>{exp.name}</h4>
                                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>₹{exp.amount}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete('site_expenses', exp.id)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Admin;
