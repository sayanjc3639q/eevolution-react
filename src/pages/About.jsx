import React from 'react';
import { Info, Target, Users, Zap, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
    const stats = [
        { label: "Community Driven", icon: <Users size={24} />, desc: "Built by students, for students." },
        { label: "Resource Focused", icon: <BookOpen size={24} />, desc: "Centralized learning materials." },
        { label: "Constant Updates", icon: <Zap size={24} />, desc: "Always evolving with batch needs." }
    ];

    return (
        <div className="about-container">
            <SEO 
                title="About Us"
                description="Learn about the mission, vision, and team behind EEvolution 2.0. A platform built by students for students."
                keywords="EEvolution mission, student project, lead developer, about us"
            />
            <div className="about-hero">
                <div className="about-tag">
                    <Info size={14} />
                    <span>EEvolution 2.0</span>
                </div>
                <h1>The Laboratory of <span className="highlight">Knowledge</span></h1>
                <p>
                    EEvolution 2.0 is a centralized digital hub designed specifically for Batch 2 Electrical Engineering students.
                    Our mission is to streamline academic resources, foster community interaction, and provide a unified
                    platform for all student needs.
                </p>
            </div>

            <div className="about-section-grid">
                <div className="about-card-info">
                    <div className="card-header">
                        <Target className="accent-icon" />
                        <h2>Our Vision</h2>
                    </div>
                    <p>
                        To create a seamless academic ecosystem where every student has instant access to notes,
                        routines, and official notices, ensuring nobody falls behind in their learning journey.
                    </p>
                </div>

                <div className="about-card-info">
                    <div className="card-header">
                        <Users className="accent-icon" />
                        <h2>Our Community</h2>
                    </div>
                    <p>
                        Supported by a network of contributors and donators, EEvolution is a community platform
                        that thrives on collaborative effort and shared academic excellence.
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="about-stat-card">
                        <div className="stat-icon-bg">{stat.icon}</div>
                        <h3>{stat.label}</h3>
                        <p>{stat.desc}</p>
                    </div>
                ))}
            </div>

            <div className="developer-section">
                <h2>Behind the Code</h2>
                <div className="dev-hero-card">
                    <div className="dev-avatar-large">S</div>
                    <div className="dev-details">
                        <h3>Sayan</h3>
                        <p className="dev-role">Lead Developer & Visionary</p>
                        <p className="dev-bio">
                            Deeply passionate about bridging the gap between technology and education through
                            beautiful, functional user interfaces.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
