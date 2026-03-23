import React from 'react';
import { 
    Info, Users, Rocket, Monitor, Coins, Github, Linkedin, Mail, 
    CheckCircle2, Heart, Award, ShieldCheck, Zap
} from 'lucide-react';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
    const coreEngine = [
        {
            name: "Sayantan Bhowmik",
            role: "Product Experience Manager",
            icon: <Rocket size={24} />,
            image: "https://res.cloudinary.com/dkcsgmfcw/image/upload/v1773171612/ftcntr9rkp3agjcivbku.webp",
            desc: "Bug tracking, UX suggestions, and donation management."
        },
        {
            name: "Sathi Mondal",
            role: "UI/UX Test Engineer",
            icon: <Monitor size={24} />,
            image: "https://res.cloudinary.com/dkcsgmfcw/image/upload/v1773384666/tvezlcxsalzg1pzmywbx.jpg",
            desc: "Testing logins, theme colors, interface themes, and local storage state."
        },
        {
            name: "Sayan Parua",
            role: "Gamification Strategist",
            icon: <Coins size={24} />,
            image: "https://ui-avatars.com/api/?name=Sayan+Parua&background=3b82f6&color=fff",
            desc: "Evo-coins concept and regulated upload features."
        }
    ];

    return (
        <div className="about-v2-container">
            {/* Decorative background elements */}
            <div className="about-bg-blob blob-1"></div>
            <div className="about-bg-blob blob-2"></div>
            
            <SEO 
                title="About Us"
                description="Identity, Mission, and the Team behind EEvolution 2.0. A non-profit community platform for Electrical Engineering students."
                keywords="EEvolution about, non-profit, student community, electrical engineering, sayan maity"
            />
            
            <header className="about-v2-header">
                <h1>About Us</h1>
            </header>

            <section className="about-v2-intro">
                <div className="intro-content">
                    <div className="mission-tag">
                        <ShieldCheck size={14} />
                        <span>MISSION</span>
                    </div>
                    <h2>About EEvolution 2.0</h2>
                    
                    <div className="mission-text">
                        <h3>Identity & Non-Profit Mission</h3>
                        <p>
                            EEvolution 2.0 is not a business; it is a non-profit scheme created to allow students easy access 
                            to academic resources, modules, and community information. It is maintained and regulated 
                            through the decisions of the Electrical Engineering Batch 2 community and its concerned 
                            administrators.
                        </p>

                        <h3>Community Driven</h3>
                        <p>
                            This platform is built for students, by students. We are dedicated to providing a high-quality 
                            digital experience that simplifies academic life and fosters long-term digital collaboration. 
                            Full responsibility lies with the platform's administrators and owners.
                        </p>
                    </div>

                    <div className="mission-highlights">
                        <div className="highlight-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>High-speed document access</span>
                        </div>
                        <div className="highlight-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Exclusive Batch Community feed</span>
                        </div>
                        <div className="highlight-item">
                            <CheckCircle2 size={18} className="check-icon" />
                            <span>Gamified rewards with Evo-Coins</span>
                        </div>
                    </div>
                </div>

                <div className="lead-dev-profile">
                    <div className="profile-avatar-wrapper">
                        <div className="avatar-ring"></div>
                        <img 
                            src="https://res.cloudinary.com/dkcsgmfcw/image/upload/v1773424978/ygreiolvwem8e1rl3kod.jpg" 
                            alt="Sayan Maity" 
                            className="profile-img"
                            onError={(e) => {
                                e.target.src = "https://ui-avatars.com/api/?name=Sayan+Maity&background=6e2cf2&color=fff&size=128";
                            }}
                        />
                    </div>
                    <div className="profile-info">
                        <h3>Sayan Maity</h3>
                        <p className="profile-role">Lead Developer & Visionary</p>
                        <p className="profile-bio">
                            Passionate about building software that solves community problems. EEvolution is a passion 
                            project designed to streamline student life and foster digital collaboration among future 
                            engineers.
                        </p>
                        <div className="profile-socials">
                            <a href="https://github.com/sayanjc3639q" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                            <a href="https://linkedin.com/in/sayanjc3639q" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                            <a href="mailto:jcsayan7@gmail.com"><Mail size={20} /></a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            <section className="core-engine-section">
                <div className="section-title-wrapper">
                    <Users size={24} className="title-icon" />
                    <h2>The <span className="blue-gradient">Core Engine</span></h2>
                </div>

                <div className="core-engine-grid">
                    {coreEngine.map((member, idx) => (
                        <div key={idx} className="engine-card">
                            <div className="engine-header">
                                <div className="engine-image-wrapper">
                                    <img src={member.image} alt={member.name} className="engine-img" />
                                </div>
                                <div className="engine-icon-wrapper">
                                    {member.icon}
                                </div>
                            </div>
                            <h3>{member.name}</h3>
                            <p className="engine-role">{member.role}</p>
                            <p className="engine-desc">{member.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="values-section">
                <div className="section-title-wrapper">
                    <Heart size={24} className="title-icon" />
                    <h2>Our <span className="blue-gradient">Core Values</span></h2>
                </div>
                <div className="values-grid">
                    <div className="value-item">
                        <div className="value-icon"><Award size={20} /></div>
                        <h4>Excellence</h4>
                        <p>Striving for the highest quality in academic resources.</p>
                    </div>
                    <div className="value-item">
                        <div className="value-icon"><Users size={20} /></div>
                        <h4>Community</h4>
                        <p>Built by Batch 2 students for the entire community.</p>
                    </div>
                    <div className="value-item">
                        <div className="value-icon"><ShieldCheck size={20} /></div>
                        <h4>Integrity</h4>
                        <p>Transparent and ethical management of resources.</p>
                    </div>
                </div>
            </section>

            <section className="tech-arch-section">
                <div className="section-title-wrapper">
                    <Rocket size={24} className="title-icon" />
                    <h2>The Tech <span className="blue-gradient">Architecture</span></h2>
                </div>

                <div className="tech-arch-grid">
                    <div className="arch-card">
                        <div className="arch-icon-wrapper react">
                            <Zap size={24} />
                        </div>
                        <h3>React 19</h3>
                        <p className="arch-type">The UI Logic</p>
                        <p className="arch-desc">Fast, interactive, and modular frontend framework for a seamless user experience.</p>
                    </div>

                    <div className="arch-card">
                        <div className="arch-icon-wrapper supabase">
                            <ShieldCheck size={24} />
                        </div>
                        <h3>Supabase</h3>
                        <p className="arch-type">The Database</p>
                        <p className="arch-desc">Secure PostgreSQL database with real-time capabilities and built-in authentication.</p>
                    </div>

                    <div className="arch-card">
                        <div className="arch-icon-wrapper vite">
                            <Rocket size={24} />
                        </div>
                        <h3>Vite 6</h3>
                        <p className="arch-type">The Engine</p>
                        <p className="arch-desc">Next-generation frontend tooling providing lightning-fast development and optimized builds.</p>
                    </div>
                </div>
            </section>

            <footer className="about-v2-footer">
                <div className="footer-line"></div>
                <p>EEvolution 2.0 <span>© 2026</span></p>
            </footer>
        </div>
    );
};

export default About;

