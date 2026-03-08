import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Palette, Check, ArrowLeft, Sun, Moon, Laptop } from 'lucide-react';
import './Appearance.css';

const Appearance = () => {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState(localStorage.getItem('accent-color') || '#0ea5e9');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const colors = [
        { name: 'Sky Blue', value: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)' },
        { name: 'Electric Purple', value: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
        { name: 'Emerald', value: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
        { name: 'Rose', value: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
        { name: 'Amber', value: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
        { name: 'Indigo', value: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
    ];

    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', selectedColor);
        document.documentElement.style.setProperty('--accent-glow', colors.find(c => c.value === selectedColor)?.glow || 'rgba(14, 165, 233, 0.4)');
        localStorage.setItem('accent-color', selectedColor);
    }, [selectedColor]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button onClick={() => navigate('/profile')} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2>Appearance Settings</h2>
            </div>

            <div className="settings-section">
                <h3>Accent Color</h3>
                <p>Choose a color that matches your style</p>
                <div className="color-grid">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            className={`color-option ${selectedColor === color.value ? 'active' : ''}`}
                            style={{ '--option-color': color.value }}
                            onClick={() => setSelectedColor(color.value)}
                        >
                            {selectedColor === color.value && <Check size={20} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="settings-section">
                <h3>Interface Theme</h3>
                <div className="theme-toggle-group">
                    <button
                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                    >
                        <Moon size={18} />
                        <span>Dark Mode</span>
                    </button>
                    <button
                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                    >
                        <Sun size={18} />
                        <span>Light Mode</span>
                    </button>
                </div>
            </div>

            <div className="preview-card">
                <div className="preview-badge">Preview</div>
                <h4>EEvolution 2.0</h4>
                <p>Tailor your experience with premium gradients and custom themes.</p>
                <button className="preview-action">Sample Button</button>
            </div>
        </div>
    );
};

export default Appearance;
