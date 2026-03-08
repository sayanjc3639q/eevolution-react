import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Lock, ShieldCheck, AlertCircle, Save, CheckCircle, AlertTriangle, Trash2, MonitorSmartphone } from 'lucide-react';

const Security = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [dangerActionLoading, setDangerActionLoading] = useState(false);
    const [dangerError, setDangerError] = useState(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setSessionsLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_user_sessions');
            if (error) throw error;
            setSessions(data || []);
        } catch (err) {
            console.error("Error fetching sessions:", err);
        } finally {
            setSessionsLoading(false);
        }
    };

    const parseDevice = (ua) => {
        if (!ua) return 'Unknown Device';
        let browser = 'Web Browser';
        let os = 'Unknown OS';

        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Edg')) browser = 'Edge';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';

        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac OS') || ua.includes('Macintosh')) os = 'macOS';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        else if (ua.includes('Linux')) os = 'Linux';

        return `${browser} on ${os}`;
    };

    const handleLogoutSession = async (sessionId) => {
        if (!window.confirm("Log out of this device?")) return;
        try {
            const { error } = await supabase.rpc('delete_user_session', { p_session_id: sessionId });
            if (error) throw error;

            const currentSession = await supabase.auth.getSession();
            setSessions(sessions.filter(s => s.id !== sessionId));

            if (currentSession.data?.session?.id === sessionId) {
                await supabase.auth.signOut();
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            alert("Failed to log out device.");
        }
    };

    const handleLogoutAllOther = async () => {
        if (!window.confirm("Log out of ALL other devices? This will keep you logged in on your current device only.")) return;
        try {
            const { error } = await supabase.auth.signOut({ scope: 'others' });
            if (error) throw error;
            alert("Logged out of other devices.");
            fetchSessions();
        } catch (err) {
            console.error(err);
            alert("Failed to log out of other devices.");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeregister = async () => {
        if (!window.confirm("WARNING: This will disconnect your email and permanently delete your uploaded memories and chats. You can re-register later with your roll number. Proceed?")) return;

        setDangerActionLoading(true);
        setDangerError(null);
        try {
            const { error } = await supabase.rpc('deregister_user');
            if (error) throw error;

            await supabase.auth.signOut();
            navigate('/', { replace: true });
        } catch (err) {
            setDangerError(err.message || 'Failed to de-register account.');
        } finally {
            setDangerActionLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will PERMANENTLY delete all your info. You CANNOT register back until an admin explicitly approves and re-adds your record. Are you absolutely sure?")) return;

        setDangerActionLoading(true);
        setDangerError(null);
        try {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) throw error;

            await supabase.auth.signOut();
            navigate('/', { replace: true });
        } catch (err) {
            setDangerError(err.message || 'Failed to delete account.');
        } finally {
            setDangerActionLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button onClick={() => navigate('/profile')} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2>Security & Password</h2>
            </div>

            <div className="settings-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={32} color="var(--accent-color)" />
                    <div>
                        <h3 style={{ margin: 0 }}>Protect Your Account</h3>
                        <p style={{ margin: 0 }}>Ensure your account is using a strong, unique password.</p>
                    </div>
                </div>

                <form onSubmit={handleUpdatePassword}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Min 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="6"
                            className="value-box"
                            style={{ width: '100%', outline: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="value-box"
                            style={{ width: '100%', outline: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    {error && (
                        <div className="auth-error" style={{ marginBottom: '1.5rem' }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10b981',
                            color: '#10b981',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            align_items: 'center',
                            gap: '0.5rem'
                        }}>
                            <CheckCircle size={16} />
                            <span>Password updated successfully!</span>
                        </div>
                    )}

                    <button type="submit" className="auth-btn" disabled={loading} style={{ width: 'auto', padding: '0.8rem 2rem' }}>
                        <Save size={18} />
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            <div className="settings-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <MonitorSmartphone size={28} color="var(--text-primary)" />
                    <div>
                        <h3 style={{ margin: 0 }}>Active Devices</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>You are limited to 3 concurrent sessions.</p>
                    </div>
                </div>

                {sessionsLoading ? (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Loading devices...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {sessions.map(s => (
                            <div key={s.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem', background: 'var(--bg-primary)',
                                borderRadius: '12px', border: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{parseDevice(s.user_agent)}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        IP: {s.ip || 'Unknown'} • Signed in: {new Date(s.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleLogoutSession(s.id)}
                                    style={{
                                        padding: '0.5rem 1rem', background: 'transparent',
                                        border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                                        borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                                    }}>
                                    Sign Out
                                </button>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No active sessions found.</p>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={handleLogoutAllOther}
                        className="menu-item"
                        style={{ border: '1px solid var(--border-color)', flex: 1, justifyContent: 'center', background: 'transparent' }}
                    >
                        Sign Out Other Devices
                    </button>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            navigate('/');
                        }}
                        className="menu-item"
                        style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', flex: 1, justifyContent: 'center' }}
                    >
                        Sign Out Everywhere
                    </button>
                </div>
            </div>

            <div className="settings-section danger-zone">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={28} color="#ef4444" />
                    <div>
                        <h3 style={{ margin: 0, color: '#ef4444' }}>Danger Zone</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Irreversible account actions.</p>
                    </div>
                </div>

                {dangerError && (
                    <div className="auth-error" style={{ marginBottom: '1rem' }}>
                        <AlertCircle size={16} />
                        <span>{dangerError}</span>
                    </div>
                )}

                <div className="danger-actions">
                    <div className="danger-item">
                        <div className="danger-text">
                            <h4>De-register Account</h4>
                            <p>Disconnects email and deletes uploaded data (memories/chats). You can join again later without admin approval.</p>
                        </div>
                        <button
                            className="danger-btn outline"
                            onClick={handleDeregister}
                            disabled={dangerActionLoading}
                        >
                            De-register
                        </button>
                    </div>

                    <div className="danger-item">
                        <div className="danger-text">
                            <h4>Delete Account</h4>
                            <p>Permanently deletes all your info. You cannot register back until an admin creates a new record for you.</p>
                        </div>
                        <button
                            className="danger-btn solid"
                            onClick={handleDeleteAccount}
                            disabled={dangerActionLoading}
                        >
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
