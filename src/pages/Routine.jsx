import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuery } from '@tanstack/react-query';
import './Routine.css';

const Routine = () => {
    const navigate = useNavigate();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Get current day of week (0=Sun, 1=Mon... 5=Fri, 6=Sat)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const initialDay = days.includes(today) ? today : "Monday";

    const [selectedDay, setSelectedDay] = useState(initialDay);

    // --- CACHED BATCH FETCHING ---
    const { data: studentBatch = 'Batch 2' } = useQuery({
        queryKey: ['userBatch'],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return 'Batch 2';
            const { data: student } = await supabase
                .from('students')
                .select('batch')
                .eq('user_id', session.user.id)
                .single();
            return student?.batch || 'Batch 2';
        }
    });

    // --- CACHED ROUTINE FETCHING ---
    const { data: routineData = [], isLoading: routineLoading } = useQuery({
        queryKey: ['routine', studentBatch],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('routines')
                .select('*')
                .eq('batch', studentBatch)
                .order('start_time', { ascending: true });
            if (error) throw error;
            return data;
        },
        enabled: !!studentBatch
    });

    const loading = routineLoading;

    const routineForDay = routineData.filter(item => item.day === selectedDay);

    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className="routine-container">
            <div className="routine-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <h1>Class <span className="highlight">Routine</span></h1>
                <p>EE Weekly Schedule {studentBatch && <span className="batch-tag-inline">({studentBatch})</span>}</p>
            </div>

            <div className="day-selector-wrapper">
                <div className="day-selector">
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                            onClick={() => handleDayChange(day)}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="routine-content">
                <div className="day-heading">
                    <Calendar size={20} className="accent-icon" />
                    <h2>{selectedDay}'s Schedule</h2>
                </div>

                <div className="schedule-list">
                    {loading ? (
                        <div className="skeleton-loading">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="schedule-card skeleton-item skeleton-pulse" style={{ height: '100px', marginBottom: '1rem', border: 'none' }}></div>
                            ))}
                        </div>
                    ) : routineForDay.length > 0 ? (
                        routineForDay.map((item, idx) => (
                            <div key={idx} className="schedule-card">
                                <div className="time-strip">
                                    <Clock size={16} />
                                    <span>{item.start_time} - {item.end_time}</span>
                                </div>
                                <div className="card-main">
                                    <div className="subject-info">
                                        <h3>{item.subject}</h3>
                                        <div className="prof-info">
                                            <User size={14} />
                                            <span>{item.prof}</span>
                                        </div>
                                    </div>
                                    <div className="room-badge">
                                        <MapPin size={14} />
                                        <span>{item.room}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-day">
                            <p>No classes scheduled for this day. Enjoy your holiday!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Routine;
