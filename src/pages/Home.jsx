import React from 'react';

const Home = () => {
    return (
        <div className="home-container">
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="title">EEvolution <span className="highlight">2.0</span></h1>
                    <p className="subtitle">Electrical Engineering Batch 2</p>
                    <div className="welcome-message">
                        Welcome to the ultimate hub for all things Electrical Engineering.
                    </div>
                </div>
            </header>

            <main className="main-content">
                <section className="about-section card">
                    <div className="card-content">
                        <h2>About EEvolution 2.0</h2>
                        <p>
                            EEvolution 2.0 is the central platform for the Electrical Engineering Batch 2 students.
                            We've evolved from our original site to a fully interactive and dynamic React application.
                        </p>
                        <p>
                            Here you will find everything you need to succeed in your coursework:
                        </p>
                        <ul className="features-list">
                            <li>📚 <strong>Study Section:</strong> Question practice sets, PYQs, and handwritten notes.</li>
                            <li>📝 <strong>Daily Notes:</strong> Instant access to daily class and lab notes.</li>
                            <li>🗓️ <strong>Schedules:</strong> Up-to-date daily class schedules and upcoming exam dates.</li>
                            <li>💬 <strong>Community:</strong> Real-time chat and memory posting features.</li>
                            <li>📢 <strong>Notices:</strong> Important updates and event details.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
