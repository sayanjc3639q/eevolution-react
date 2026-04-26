import React, { useState, useEffect } from 'react';
import { Calendar, TreePalm, ArrowLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Holidays.css';

const Holidays = () => {
    const navigate = useNavigate();
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('holidays')
            .select('*')
            .order('date', { ascending: true });

        if (!error) {
            setHolidays(data);
        }
        setLoading(false);
    };

    // Helper to check if a date has passed
    const isUpcoming = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const holidayDate = new Date(dateStr);
        return holidayDate >= today;
    };

    // Group holidays by month
    const groupedHolidays = holidays.reduce((acc, current) => {
        const date = new Date(current.date);
        const month = date.toLocaleString('default', { month: 'long' });
        if (!acc[month]) acc[month] = [];
        acc[month].push(current);
        return acc;
    }, {});

    const months = Object.keys(groupedHolidays);

    return (
        <div className="holidays-container">
            <div className="holidays-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <h1>Holiday <span className="highlight">Calendar</span></h1>
                <p>Official EE Holiday List 2026</p>
            </div>

            <div className="holidays-content">
                <div className="holiday-info-card">
                    <Info size={20} />
                    <p>Holidays marked with a dot are upcoming. Dates are subject to change based on university notifications.</p>
                </div>

                {loading ? (
                    <div className="skeleton-loading">
                        <div className="skeleton-line title skeleton-pulse" style={{ width: '120px', marginBottom: '1.5rem' }}></div>
                        <div className="holiday-grid">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="holiday-card skeleton-item skeleton-pulse" style={{ height: '80px', marginBottom: '1rem', border: 'none' }}></div>
                            ))}
                        </div>
                    </div>
                ) : months.length > 0 ? (
                    months.map((month) => (
                        <div key={month} className="month-section">
                            <h2 className="month-title">{month}</h2>
                            <div className="holiday-grid">
                                {groupedHolidays[month].map((holiday, idx) => {
                                    const upcoming = isUpcoming(holiday.date);
                                    const dateObj = new Date(holiday.date);
                                    const day = dateObj.getDate();
                                    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                                    return (
                                        <div key={idx} className={`holiday-card ${upcoming ? 'upcoming' : 'passed'}`}>
                                            <div className="date-box">
                                                <span className="day">{day}</span>
                                                <span className="weekday">{weekday}</span>
                                            </div>
                                            <div className="holiday-name">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                    <h3>{holiday.name}</h3>
                                                    <span className={`holiday-type-label ${holiday.type || 'official'}`}>
                                                        {holiday.type || 'official'}
                                                    </span>
                                                </div>
                                                {upcoming && <span className="upcoming-tag">Upcoming</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No Holidays Found</h3>
                        <p>Relax! There are no holidays currently listed in the calendar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Holidays;
