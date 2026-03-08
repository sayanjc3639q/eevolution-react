import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    User, LogOut, FileText, ShieldCheck, Mail, Hash,
    UserCircle, Eye, EyeOff, Calendar, Settings,
    ChevronRight, Palette, Lock, LayoutDashboard, AlertCircle,
    Camera, Trash2, Loader2
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [showSensitive, setShowSensitive] = useState(false);
    const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            setUser(user);

            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            setStudentData(data);

            // SuperAdmin Check
            const superAdminEmail = 'jcsayan7@gmail.com';
            const superAdminRoll = '25/EE/092';
            const isUserSuperAdmin = user.email === superAdminEmail || data?.class_roll_no === superAdminRoll;
            setIsSuperAdmin(isUserSuperAdmin);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        if (file.size > 1024 * 1024) {
            alert('Profile picture must be less than 1MB.');
            e.target.value = null;
            return;
        }

        try {
            setUploadingProfilePic(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ee_memories');

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const cloudData = await res.json();

            if (cloudData.secure_url) {
                const { error } = await supabase
                    .from('students')
                    .update({ avatar_url: cloudData.secure_url })
                    .eq('user_id', user.id);

                if (error) throw error;

                setStudentData(prev => ({ ...prev, avatar_url: cloudData.secure_url }));
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to update profile picture.');
        } finally {
            setUploadingProfilePic(false);
        }
    };

    const handleRevealProtected = async (e) => {
        e.preventDefault();
        if (showSensitive) {
            setShowSensitive(false);
            return;
        }
        setShowVerifyModal(true);
    };

    const verifyAndReveal = async () => {
        try {
            setVerifying(true);
            setVerifyError('');

            const { error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: confirmPassword,
            });

            if (error) {
                setVerifyError('Incorrect password. Access denied.');
                return;
            }

            setShowSensitive(true);
            setShowVerifyModal(false);
            setConfirmPassword('');
        } catch (err) {
            setVerifyError('An error occurred. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleProfilePicDelete = async () => {
        if (!user || !studentData?.avatar_url) return;

        try {
            setUploadingProfilePic(true);
            const { error } = await supabase
                .from('students')
                .update({ avatar_url: null })
                .eq('user_id', user.id);

            if (error) throw error;
            setStudentData(prev => ({ ...prev, avatar_url: null }));
        } catch (error) {
            console.error('Error deleting profile picture:', error);
            alert('Failed to remove profile picture.');
        } finally {
            setUploadingProfilePic(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-container skeleton-loading">
                <div className="profile-header-main skeleton-item">
                    <div className="profile-info-group">
                        <div className="avatar-large skeleton-pulse"></div>
                        <div className="user-text">
                            <div className="skeleton-line title skeleton-pulse"></div>
                            <div className="skeleton-line badge skeleton-pulse"></div>
                        </div>
                    </div>
                    <div className="header-stats">
                        <div className="h-stat skeleton-pulse"></div>
                    </div>
                </div>

                <div className="profile-grid">
                    <div className="info-column">
                        <div className="profile-card skeleton-item skeleton-pulse" style={{ height: '220px' }}></div>
                        <div className="admin-access-card skeleton-item skeleton-pulse" style={{ height: '80px', marginTop: '1rem' }}></div>
                    </div>
                    <div className="actions-column">
                        <div className="profile-card skeleton-item skeleton-pulse" style={{ height: '240px' }}></div>
                        <div className="status-indicator-card skeleton-item skeleton-pulse" style={{ height: '50px', marginTop: '1rem' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="profile-container error-state">
                <div className="profile-card">
                    <AlertCircle size={48} className="error-icon" />
                    <h2>Profile Not Found</h2>
                    <p>We couldn't find a student record linked to your account. Please contact the administrator.</p>
                    <button onClick={handleSignOut} className="signout-btn">Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Password Verification Modal */}
            {showVerifyModal && (
                <div className="verify-overlay">
                    <div className="verify-modal">
                        <div className="verify-header">
                            <Lock size={20} className="accent-icon" />
                            <h3>Authentication Required</h3>
                        </div>
                        <p>Please enter your password to reveal sensitive identity details.</p>

                        <div className="verify-input-group">
                            <input
                                type="password"
                                placeholder="Your Login Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoFocus
                            />
                            {verifyError && <span className="error-text">{verifyError}</span>}
                        </div>

                        <div className="verify-actions">
                            <button className="cancel-btn" onClick={() => {
                                setShowVerifyModal(false);
                                setConfirmPassword('');
                                setVerifyError('');
                            }}>Cancel</button>
                            <button
                                className="confirm-btn"
                                onClick={verifyAndReveal}
                                disabled={verifying || !confirmPassword}
                            >
                                {verifying ? <Loader2 className="spinner" size={16} /> : "Verify & Reveal"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header-main">
                <div className="profile-info-group">
                    <div className="avatar-large-container">
                        <div className="avatar-large">
                            {uploadingProfilePic ? (
                                <Loader2 className="spinner" size={24} color="white" />
                            ) : studentData.avatar_url ? (
                                <img src={studentData.avatar_url} alt="Profile" className="profile-img-preview" />
                            ) : (
                                studentData.name.charAt(0)
                            )}

                            <label className="avatar-upload-overlay" htmlFor="profilePicInput">
                                <Camera size={18} />
                            </label>
                            <input
                                id="profilePicInput"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleProfilePicUpload}
                                disabled={uploadingProfilePic}
                            />
                        </div>
                        {studentData.avatar_url && !uploadingProfilePic && (
                            <button className="avatar-delete-btn" onClick={handleProfilePicDelete} title="Remove profile picture">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    <div className="user-text">
                        <h1>{studentData.name}</h1>
                        <div className="badge-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="roll-badge">{studentData.class_roll_no}</span>
                            {isSuperAdmin && <span className="admin-badge super" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Superadmin & Developer</span>}
                            {!isSuperAdmin && studentData.is_admin && <span className="admin-badge" style={{ background: 'var(--accent-color)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Admin</span>}
                        </div>
                    </div>
                </div>

                <div className="header-stats">
                    <div className="h-stat">
                        <span className="h-val">{studentData.files_count}</span>
                        <span className="h-lbl">Files</span>
                    </div>
                </div>
            </div>

            {/* Sub-header info for mobile */}
            <div className="status-indicator-card mobile-only-status">
                <div className={`status-status ${studentData.is_approved ? 'approved' : 'pending'}`}>
                    <div className="dot"></div>
                    {studentData.is_approved ? 'Verified Batch 2' : 'Pending Verification'}
                </div>
            </div>

            <div className="profile-grid">
                {/* Left Column: Sensitive Data & Info */}
                <div className="info-column">
                    <div className="profile-card sensitive-info">
                        <div className="card-header">
                            <h3>Identity Details</h3>
                            <button
                                className="reveal-btn"
                                onClick={handleRevealProtected}
                            >
                                {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />}
                                {showSensitive ? "Hide Details" : "Verify & Reveal Info"}
                            </button>
                        </div>

                        <div className="details-list">
                            <div className="detail-item">
                                <label>Registration Number</label>
                                <div className="value-box">
                                    {showSensitive ? studentData.reg_no : "••••••••••••"}
                                </div>
                            </div>
                            <div className="detail-item">
                                <label>University Roll No</label>
                                <div className="value-box">
                                    {showSensitive ? studentData.university_roll_no : "•••••••••••"}
                                </div>
                            </div>
                            <div className="detail-item">
                                <label>Student ID</label>
                                <div className="value-box">
                                    {showSensitive ? studentData.student_id : "•••••••••••"}
                                </div>
                            </div>
                            <div className="detail-item">
                                <label>Email Address</label>
                                <div className="value-box email">{studentData.email}</div>
                            </div>
                        </div>
                    </div>

                    {(studentData.is_admin || isSuperAdmin) && (
                        <div className="admin-access-card">
                            <div className="admin-icon-box">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="admin-text">
                                <h3>Admin Control</h3>
                                <p>{isSuperAdmin ? 'Full Platform Oversight' : 'Access student records and approvals'}</p>
                            </div>
                            <button className="admin-go-btn" onClick={() => navigate('/admin')}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Experience & Actions */}
                <div className="actions-column">
                    <div className="profile-card experience-card">
                        <h3>Customization & Security</h3>
                        <div className="menu-list">
                            <button className="menu-item" onClick={() => navigate('/settings/theme')}>
                                <div className="menu-left">
                                    <div className="menu-icon-bg color"><Palette size={18} /></div>
                                    <span>Appearance Settings</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="menu-item" onClick={() => navigate('/settings/password')}>
                                <div className="menu-left">
                                    <div className="menu-icon-bg lock"><Lock size={18} /></div>
                                    <span>Security & Password</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="menu-item signout" onClick={handleSignOut}>
                                <div className="menu-left">
                                    <div className="menu-icon-bg red"><LogOut size={18} /></div>
                                    <span>Sign Out Session</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="status-indicator-card">
                        <div className={`status-status ${studentData.is_approved ? 'approved' : 'pending'}`}>
                            <div className="dot"></div>
                            {studentData.is_approved ? 'Official Batch 2 Member' : 'Batch 1 - Account Verification Pending'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
