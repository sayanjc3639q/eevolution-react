import React, { useEffect, useState } from 'react';
import './EntryScreen.css';


const EntryScreen = ({ onComplete }) => {
    const [animationStage, setAnimationStage] = useState('none'); // 'none' -> 'logo-pop' -> 'text-reveal' -> 'fade-out'

    useEffect(() => {
        // Start Sound Effect (optional)
        const playSound = () => {
            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3'); // A clean pop sound
            audio.volume = 0.3;
            audio.play().catch(e => console.warn('Audio play prevented by browser:', e));
        };

        // Stages Timing
        const timers = [
            setTimeout(() => {
                setAnimationStage('logo-pop');
                playSound();
            }, 500),
            
            setTimeout(() => {
                setAnimationStage('text-reveal');
            }, 1200),
            
            setTimeout(() => {
                setAnimationStage('fade-out');
            }, 3000),
            
            setTimeout(() => {
                onComplete();
            }, 3500)
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [onComplete]);

    return (
        <div className={`entry-overlay ${animationStage === 'fade-out' ? 'exit' : ''}`}>
            <div className="entry-content">
                <div className={`logo-container ${animationStage}`}>
                    <img src="assets/eevolution-2-electrical-engineering-logo.png" alt="EEvolution Logo" className="entry-logo" />
                </div>
                <div className={`text-container ${animationStage}`}>
                    <h1 className="entry-brand">
                        EEvolution <span className="highlight">2.0</span>
                    </h1>
                    <div className="loading-bar-wrapper">
                        <div className="loading-progress" />
                    </div>
                </div>
            </div>
            
            <div className="entry-footer">
                <p>Digital Hub for Electrical Engineering Students</p>
                <p className="subtitle">HIT Haldia</p>
            </div>
        </div>
    );
};

export default EntryScreen;
