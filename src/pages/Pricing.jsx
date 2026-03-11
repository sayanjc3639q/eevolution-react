import React from 'react';
import { Check, Zap, Crown, Star, ArrowRight } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    const plans = [
        {
            id: 'standard',
            name: 'Standard',
            price: 'Access',
            subtitle: 'Batch Students',
            icon: <Star className="plan-icon-svg" />,
            description: 'All current platform features included as standard for our community.',
            features: [
                'Full Lecture Notes & PPTs',
                'E-Books Library Access',
                'Class Routines & Notifications',
                'Personalized Study Dashboard',
                'Community Chat Access'
            ],
            btnText: 'Current Plan',
            popular: false
        },
        {
            id: 'plus',
            name: 'PLUS',
            price: '₹399',
            subtitle: 'per 3 months',
            icon: <Zap className="plan-icon-svg" />,
            description: 'Level up your engineering journey with exclusive study resources. (Special Student Offer)',
            features: [
                'Everything in Standard',
                'GATE Preparation Resources',
                'Early Access to Notes & Books',
                'MCQ Practice Modules',
                'Model Semester Question Papers',
                'Verified PLUS Badge'
            ],
            btnText: 'Upgrade to PLUS',
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '₹799',
            subtitle: 'per 3 months',
            icon: <Crown className="plan-icon-svg" />,
            description: 'The ultimate experience with premium perks and lifestyle benefits. (Student Discounted)',
            features: [
                'Everything in PLUS',
                'EEvolution Official Merchandise',
                'Canva Pro (Permanent Account)',
                'LinkedIn Premium Access',
                'YouTube Premium Access',
                'Priority Support & Mentorship'
            ],
            btnText: 'Go Premium',
            popular: false
        }
    ];

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <div className="tier-tag">EEVOLUTION TIERS</div>
                <h1>Choose Your Learning <span>Experience</span></h1>
                <p>Unlock specialized resources and premium benefits tailored for future engineers.</p>
            </div>

            <div className="plans-container">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.id} ${plan.popular ? 'popular' : ''}`}>
                        {plan.popular && <div className="popular-tag">Most Popular</div>}
                        
                        <div className="plan-visual">
                            <div className="plan-icon-wrapper">
                                {plan.icon}
                            </div>
                        </div>

                        <div className="plan-main">
                            <h3>{plan.name}</h3>
                            <div className="plan-price">
                                {plan.price}
                                <span className="price-sub">{plan.subtitle}</span>
                            </div>
                            <p className="plan-desc">{plan.description}</p>
                        </div>

                        <ul className="plan-features">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>
                                    <Check size={16} className="check-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`plan-btn ${plan.id}`}>
                            {plan.btnText}
                            {plan.id === 'standard' ? <Check size={18} /> : <ArrowRight size={18} />}
                        </button>
                    </div>
                ))}
            </div>

            <div className="pricing-footer">
                <div className="footer-note">
                    <p>Prices are inclusive of all taxes. Payments are securely processed via Razorpay.</p>
                    <p>Need help choosing? <a href="/support">Contact our support team</a></p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
