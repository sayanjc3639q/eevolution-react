import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, CreditCard, Smartphone, Building2,
    ShieldCheck, Lock, ChevronRight, Copy, Check,
    AlertCircle, X, QrCode, Wallet, CheckCircle2, Landmark
} from 'lucide-react';
import './Payment.css';

// UPI QR generated via public API — replace with real QR image later
const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=eevolution@ybl%26pn=EEvolution%26cu=INR`;


const AMOUNT_PRESETS = [49, 99, 199, 499];
const UPI_ID = 'eevolution@ybl';
const UPI_NAME = 'EEvolution Platform';

const Payment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [amount, setAmount] = useState(searchParams.get('amount') || 99);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(null); // 'upi' | 'card' | 'netbanking'
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [selectedBank, setSelectedBank] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState('select'); // 'select' | 'pay'

    const finalAmount = customAmount || amount;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(UPI_ID).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDemoPayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setErrorModal(true);
        }, 2200);
    };

    const formatCardNumber = (val) => {
        return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        const v = val.replace(/\D/g, '').slice(0, 4);
        return v.length >= 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    };

    const banks = [
        { id: 'sbi', name: 'State Bank of India', icon: <Landmark size={20} /> },
        { id: 'hdfc', name: 'HDFC Bank', icon: <Landmark size={20} /> },
        { id: 'icici', name: 'ICICI Bank', icon: <Landmark size={20} /> },
        { id: 'axis', name: 'Axis Bank', icon: <Landmark size={20} /> },
        { id: 'kotak', name: 'Kotak Mahindra Bank', icon: <Landmark size={20} /> },
        { id: 'pnb', name: 'Punjab National Bank', icon: <Landmark size={20} /> },
    ];

    return (
        <div className="payment-page">
            {/* Header */}
            <header className="payment-header">
                <button className="pay-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="payment-header-center">
                    <div className="payment-logo-badge">
                        <ShieldCheck size={18} />
                        <span>Secure Payment</span>
                    </div>
                    <h1>EEvolution <span>Checkout</span></h1>
                </div>
                <div className="payment-lock-badge">
                    <Lock size={14} /> SSL
                </div>
            </header>

            <div className="payment-body">

                {/* Order Summary */}
                <div className="payment-order-card">
                    <div className="order-card-top">
                        <div className="order-merchant">
                            <div className="order-merchant-logo">EE</div>
                            <div>
                                <div className="order-merchant-name">EEvolution Platform</div>
                                <div className="order-merchant-sub">Community Support Contribution</div>
                            </div>
                        </div>
                        <div className="order-amount-badge">₹{finalAmount}</div>
                    </div>

                    {/* Amount Selector */}
                    {step === 'select' && (
                        <div className="amount-selector">
                            <p className="selector-label">Choose or enter amount</p>
                            <div className="preset-amounts">
                                {AMOUNT_PRESETS.map(a => (
                                    <button
                                        key={a}
                                        className={`preset-btn ${amount === a && !customAmount ? 'active' : ''}`}
                                        onClick={() => { setAmount(a); setCustomAmount(''); }}
                                    >
                                        ₹{a}
                                    </button>
                                ))}
                            </div>
                            <div className="custom-amount-row">
                                <span className="rupee-prefix">₹</span>
                                <input
                                    type="number"
                                    placeholder="Custom amount"
                                    value={customAmount}
                                    onChange={e => setCustomAmount(e.target.value)}
                                    className="custom-amount-input"
                                    min="1"
                                />
                            </div>
                            <button className="proceed-btn" onClick={() => setStep('pay')}>
                                Proceed to Pay ₹{finalAmount}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'pay' && (
                        <button className="change-amount-link" onClick={() => { setStep('select'); setSelectedMethod(null); }}>
                            ← Change Amount
                        </button>
                    )}
                </div>

                {/* Payment Methods */}
                {step === 'pay' && (
                    <div className="payment-methods-card">
                        <h2 className="methods-title">Payment Method</h2>

                        {/* --- Method Tabs --- */}
                        <div className="method-tabs">
                            <button
                                className={`method-tab ${selectedMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setSelectedMethod('upi')}
                            >
                                <Smartphone size={18} />
                                <span>UPI</span>
                                <span className="recommended-tag">Recommended</span>
                            </button>
                            <button
                                className={`method-tab ${selectedMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setSelectedMethod('card')}
                            >
                                <CreditCard size={18} />
                                <span>Card</span>
                            </button>
                            <button
                                className={`method-tab ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                                onClick={() => setSelectedMethod('netbanking')}
                            >
                                <Building2 size={18} />
                                <span>Net Banking</span>
                            </button>
                        </div>

                        {/* --- UPI Panel --- */}
                        {selectedMethod === 'upi' && (
                            <div className="pay-panel upi-panel" key="upi">
                                <div className="upi-apps-row">
                                    <div className="upi-app-badge gpay">G Pay</div>
                                    <div className="upi-app-badge phonepe">PhonePe</div>
                                    <div className="upi-app-badge paytm">Paytm</div>
                                    <div className="upi-app-badge bhim">BHIM</div>
                                </div>

                                <div className="upi-divider"><span>Scan QR to Pay</span></div>

                                <div className="qr-wrapper">
                                    <div className="qr-inner">
                                        <img src={UPI_QR_URL} alt="UPI QR Code" className="qr-image" />
                                        <div className="qr-amount-overlay">₹{finalAmount}</div>
                                    </div>
                                    <p className="qr-scan-hint">Scan with any UPI app</p>
                                </div>

                                <div className="upi-id-row">
                                    <div className="upi-id-box">
                                        <Wallet size={16} />
                                        <span className="upi-id-text">{UPI_ID}</span>
                                    </div>
                                    <button className="copy-upi-btn" onClick={handleCopyUPI}>
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                <div className="upi-instruction">
                                    <p>1. Open any UPI app (GPay, PhonePe, Paytm, BHIM)</p>
                                    <p>2. Scan the QR code or enter UPI ID manually</p>
                                    <p>3. Enter ₹{finalAmount} and complete. You're done! 🎉</p>
                                </div>

                                <div className="upi-note">
                                    <CheckCircle2 size={14} />
                                    <span>After paying, your name will appear in the Donators Hall within 24hrs.</span>
                                </div>
                            </div>
                        )}

                        {/* --- Card Panel --- */}
                        {selectedMethod === 'card' && (
                            <div className="pay-panel card-panel" key="card">
                                <div className="card-preview">
                                    <div className="card-preview-chip"></div>
                                    <div className="card-preview-number">
                                        {cardData.number || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="card-preview-bottom">
                                        <div>
                                            <div className="card-preview-label">CARD HOLDER</div>
                                            <div className="card-preview-value">{cardData.name || 'YOUR NAME'}</div>
                                        </div>
                                        <div>
                                            <div className="card-preview-label">EXPIRES</div>
                                            <div className="card-preview-value">{cardData.expiry || 'MM/YY'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-form">
                                    <div className="form-field">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardData.number}
                                            onChange={e => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name on card"
                                            value={cardData.name}
                                            onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardData.expiry}
                                                onChange={e => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>CVV</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                value={cardData.cvv}
                                                onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                                maxLength={3}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className={`pay-now-btn ${processing ? 'loading' : ''}`}
                                        onClick={handleDemoPayment}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <><span className="spinner-ring"></span> Processing...</>
                                        ) : (
                                            <><Lock size={16} /> Pay ₹{finalAmount} Securely</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- Net Banking Panel --- */}
                        {selectedMethod === 'netbanking' && (
                            <div className="pay-panel netbanking-panel" key="netbanking">
                                <p className="nb-label">Select your bank</p>
                                <div className="bank-grid">
                                    {banks.map(bank => (
                                        <button
                                            key={bank.id}
                                            className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedBank(bank.id)}
                                        >
                                            <span className="bank-logo">{bank.icon}</span>
                                            <span className="bank-name">{bank.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className={`pay-now-btn ${processing ? 'loading' : ''}`}
                                    onClick={handleDemoPayment}
                                    disabled={processing || !selectedBank}
                                >
                                    {processing ? (
                                        <><span className="spinner-ring"></span> Redirecting to Bank...</>
                                    ) : (
                                        <><Building2 size={16} /> Pay ₹{finalAmount} via Net Banking</>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* If no method selected */}
                        {!selectedMethod && (
                            <div className="select-method-hint">
                                <QrCode size={40} />
                                <p>Select a payment method above to continue</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Trust Row */}
                <div className="payment-trust-row">
                    <div className="trust-item"><ShieldCheck size={14} /> 256-bit SSL Encrypted</div>
                    <div className="trust-item"><Lock size={14} /> PCI-DSS Compliant</div>
                    <div className="trust-item"><Smartphone size={14} /> UPI Secured</div>
                </div>
            </div>

            {/* Error Modal */}
            {errorModal && (
                <div className="payment-error-overlay" onClick={() => setErrorModal(false)}>
                    <div className="payment-error-modal" onClick={e => e.stopPropagation()}>
                        <button className="error-close-btn" onClick={() => setErrorModal(false)}><X size={20} /></button>
                        <div className="error-icon-ring">
                            <AlertCircle size={40} />
                        </div>
                        <h3>Payment Failed</h3>
                        <p>We were unable to process your payment. This may be due to:</p>
                        <ul className="error-reasons">
                            <li>Insufficient funds or card limit exceeded</li>
                            <li>Card not enabled for online transactions</li>
                            <li>Incorrect card details entered</li>
                            <li>Bank server timeout</li>
                        </ul>
                        <p className="error-suggestion">Please try <strong>UPI</strong> for instant, hassle-free payment.</p>
                        <div className="error-modal-actions">
                            <button className="try-upi-btn" onClick={() => { setErrorModal(false); setSelectedMethod('upi'); }}>
                                <Smartphone size={18} /> Try UPI Instead
                            </button>
                            <button className="retry-btn" onClick={() => setErrorModal(false)}>Retry</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
