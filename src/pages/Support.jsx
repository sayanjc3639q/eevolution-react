import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    ArrowLeft,
    CreditCard,
    TrendingUp,
    PieChart,
    Zap,
    Coffee,
    Info,
    ShieldCheck,
    Smartphone,
    Rocket,
    CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Support.css';

const Support = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalDonations, setTotalDonations] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [targetAmount, setTargetAmount] = useState(0);

    useEffect(() => {
        fetchFinances();
    }, []);

    const fetchFinances = async () => {
        setLoading(true);
        try {
            // 1. Fetch total donations from students table
            const { data: students, error: sError } = await supabase
                .from('students')
                .select('donation')
                .gt('donation', 0);

            if (!sError && students) {
                const total = students.reduce((sum, s) => sum + Number(s.donation || 0), 0);
                setTotalDonations(total);
            }

            // 2. Fetch expenses from site_expenses table
            const { data: expData, error: eError } = await supabase
                .from('site_expenses')
                .select('*')
                .order('amount', { ascending: false });

            if (!eError && expData) {
                setExpenses(expData);
                const target = expData.reduce((sum, e) => sum + Number(e.amount || 0), 0);
                setTargetAmount(target);
            }
        } catch (err) {
            console.error('Error fetching finances:', err);
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = targetAmount > 0
        ? Math.min(Math.round((totalDonations / targetAmount) * 100), 100)
        : 0;

    const remainingAmount = Math.max(targetAmount - totalDonations, 0);

    return (
        <div className="support-container">
            <header className="support-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="header-badge">
                    <Heart size={16} fill="white" /> Community Fuel
                </div>
                <h1>Fuel the <span className="highlight">EEvolution</span></h1>
                <p>Help us keep the servers running and the resources free forever.</p>
            </header>

            <div className="support-content">
                {/* Progress Card */}
                <div className="finance-card main-progress">
                    <div className="card-header-row">
                        <TrendingUp size={24} className="accent" />
                        <h3>Annual Funding Goal</h3>
                    </div>

                    <div className="progress-stats">
                        <div className="stat-main">
                            <span className="amount-collected">₹{totalDonations}</span>
                            <span className="amount-target">of ₹{targetAmount}</span>
                        </div>
                        <div className="stat-percentage">{progressPercentage}%</div>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="bar-glow"></div>
                        </div>
                    </div>

                    <p className="progress-info">
                        <strong>₹{remainingAmount}</strong> more needed to cover current annual expenses.
                    </p>
                </div>

                <div className="support-grid">
                    {/* Breakdown Card */}
                    <div className="finance-card">
                        <div className="card-header-row">
                            <PieChart size={22} className="accent" />
                            <h3>Cost Breakdown</h3>
                        </div>
                        <div className="expense-list">
                            {loading ? (
                                <div className="skeleton-loading">
                                    {[1, 2, 3].map(n => <div key={n} className="skeleton-line skeleton-pulse" style={{ height: '40px', marginBottom: '10px' }}></div>)}
                                </div>
                            ) : expenses.length > 0 ? (
                                expenses.map((exp, idx) => (
                                    <div key={idx} className="expense-row">
                                        <div className="expense-name">
                                            <div className="exp-index">0{idx + 1}</div>
                                            <span>{exp.name}</span>
                                        </div>
                                        <div className="expense-val">₹{exp.amount}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="muted-text">No expenses listed.</p>
                            )}
                        </div>
                        <div className="total-expense-row">
                            <span>Total Annual Cost</span>
                            <strong>₹{targetAmount}</strong>
                        </div>
                    </div>

                    {/* Quality Card */}
                    <div className="finance-card quality-assurance">
                        <div className="card-header-row">
                            <ShieldCheck size={22} className="accent" />
                            <h3>Why Support Us?</h3>
                        </div>
                        <ul className="benefits-list">
                            <li>
                                <CheckCircle2 size={16} className="check" />
                                <span><strong>Ad-Free Experience:</strong> We will never run ads.</span>
                            </li>
                            <li>
                                <CheckCircle2 size={16} className="check" />
                                <span><strong>High Speed Servers:</strong> Fast file loads and sync.</span>
                            </li>
                            <li>
                                <CheckCircle2 size={16} className="check" />
                                <span><strong>Free Resources:</strong> All papers and notes remain free.</span>
                            </li>
                        </ul>
                        <div className="info-box-mini">
                            <Info size={14} />
                            <span>Run by students, for students. No profit motive.</span>
                        </div>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="support-cta-box">
                    <div className="cta-icon-bg">
                        <Rocket size={40} />
                    </div>
                    <h2>Become a Proud Supporter</h2>
                    <p>Every contribution, big or small, plays a vital role in keeping this platform alive and thriving for everyone.</p>

                    <button className="payment-trigger" onClick={() => window.open('https://upilinks.in/EEvolutionDonate', '_blank')}>
                        <CreditCard size={20} />
                        Contribute Now
                    </button>

                    <div className="payment-methods">
                        <span>Highly secure payment via UPI</span>
                        <div className="upi-icons">
                            <Smartphone size={16} /> GPay • PhonePe • Paytm
                        </div>
                    </div>
                </div>

                <div className="transparency-note">
                    <Info size={16} />
                    <span>Transparecy matters. All donations are publicly listed in the Donators Hall.</span>
                </div>
            </div>
        </div>
    );
};

export default Support;
