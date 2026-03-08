import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Lock, ShieldCheck, AlertCircle, Save, CheckCircle } from 'lucide-react';

const Security = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                <h3>Account Sessions</h3>
                <p>Currently logged in devices and sessions.</p>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="menu-item"
                    style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                >
                    Sign Out From All Devices
                </button>
            </div>
        </div>
    );
};

export default Security;
