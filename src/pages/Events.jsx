import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowLeft, LayoutGrid, Ticket } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/SEO';
import './Events.css';

const Events = () => {
    const navigate = useNavigate();

    // --- CACHED EVENTS FETCHING ---
    const { data: events = [], isLoading: loading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });
            if (error) throw error;
            return data;
        }
    });

    const isUpcoming = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateStr) >= today;
    };

    return (
        <div className="events-page">
            <SEO 
                title="College Events"
                description="Upcoming college fests, workshops, and extracurricular activities for HIT Haldia students. Don't miss out on campus life!"
                keywords="college fests, workshops, campus activities, student events"
            />
            <div className="page-header">
                <button onClick={() => navigate(-1)} className="back-btn-pill">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <h1>College <span className="highlight">Events</span></h1>
                <p>Don't miss out on campus activities and fests</p>
            </div>

            <div className="events-grid">
                {loading ? (
                    <div className="skeleton-loading" style={{ display: 'contents' }}>
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="event-card skeleton-item skeleton-pulse" style={{ height: '320px', border: 'none' }}></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className={`event-card ${!isUpcoming(event.event_date) ? 'past-event' : ''}`}>
                            {event.photo_url && (
                                <div className="event-photo">
                                    <img src={event.photo_url} alt={event.title} />
                                    {!isUpcoming(event.event_date) && <div className="event-overlay">PAST EVENT</div>}
                                </div>
                            )}
                            <div className="event-details">
                                <div className="event-date-pill">
                                    <CalendarIcon size={16} />
                                    <span>{new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <h3>{event.title}</h3>
                                <p className="event-desc">{event.description}</p>

                                {event.registration_link && isUpcoming(event.event_date) && (
                                    <a
                                        href={event.registration_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="register-btn"
                                    >
                                        <Ticket size={18} />
                                        Register Now
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-events">
                        <LayoutGrid size={48} className="muted-icon" />
                        <p>No events scheduled at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
