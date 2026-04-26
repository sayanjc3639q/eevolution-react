import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { User, Mail, Lock, Hash, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import './Auth.css';

const Auth = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [rollDigits, setRollDigits] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle Roll Number Lookup
    useEffect(() => {
        if (isSignUp && rollDigits.length === 3) {
            lookupStudent();
        } else {
            setStudentData(null);
            setVerified(false);
        }
    }, [rollDigits, isSignUp]);

    const lookupStudent = async () => {
        const rollNum = parseInt(rollDigits);

        if (isNaN(rollNum) || rollNum <= 0) {
            setError('Please enter a valid roll number.');
            return;
        }

        if (rollNum >= 137) {
            setError('Invalid Roll Number.');
            setVerified(false);
            setStudentData(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Auto-pad with zeros for database matching (e.g., "73" -> "25/EE/073")
            const paddedDigits = rollDigits.padStart(3, '0');
            const classRollNo = `25/EE/${paddedDigits}`;

            const { data, error: fetchError } = await supabase
                .from('students')
                .select('*')
                .eq('class_roll_no', classRollNo)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!data) {
                setVerified(false);
                setStudentData(null);
                setError('Student roll number not found.');
            } else if (data.user_id) {
                setVerified(false);
                setStudentData(null);
                setError('This roll number is already registered.');
            } else {
                setStudentData(data);
                setVerified(true);
                setError(null);
            }
        } catch (err) {
            setError(err.message || 'Error connecting to database.');
            console.error('Supabase Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Check for existing session
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    if (error.message.includes('refresh_token_not_found') || error.message.includes('Refresh Token Not Found')) {
                        await supabase.auth.signOut();
                    }
                    return;
                }
                if (session) navigate('/profile', { replace: true });
            } catch (err) {
                console.error('Session check error:', err);
            }
        };
        checkUser();
    }, [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                if (!verified) throw new Error('Please verify your roll number first.');

                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: studentData.name,
                            roll_no: studentData.class_roll_no
                        }
                    }
                });

                if (signUpError) throw signUpError;

                alert('Sign up successful! Please check your email for verification.');
                setIsSignUp(false);
            } else {
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (loginError) throw loginError;
                navigate('/profile');
            }
        } catch (err) {
            setError(err.message || 'Error connecting to database.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isSignUp ? 'Join EEvolution' : 'Welcome Back'}</h2>
                    <p>{isSignUp ? 'Enter your details to create an account' : 'Sign in to access your resources'}</p>
                </div>

                <form onSubmit={handleAuth} className="auth-form">
                    {isSignUp && (
                        <div className="form-group roll-lookup">
                            <label>Class Roll Number</label>
                            <div className="roll-input-container">
                                <span className="roll-prefix">25/EE/</span>
                                <input
                                    type="text"
                                    maxLength="3"
                                    placeholder="073"
                                    value={rollDigits}
                                    onChange={(e) => setRollDigits(e.target.value)}
                                    className={verified ? 'verified' : ''}
                                />
                                {verified && <CheckCircle className="verify-icon success" />}
                            </div>

                            {studentData && (
                                <div className="student-verify-box fade-in">
                                    <p className="student-name">
                                        <Hash size={14} /> {studentData.name}
                                    </p>
                                    <p className="batch-info">
                                        {studentData.batch ? 
                                            studentData.batch : 
                                            (studentData.class_roll_no.includes('25/EE/') ? "EE Student Verified" : "Verified Member")
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Institutional Email</label>
                        <div className="input-with-icon">
                            <Mail className="icon" size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock className="icon" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="auth-btn" disabled={loading || (isSignUp && !verified)}>
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <button onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                    }}>
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
