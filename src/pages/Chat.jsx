import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2, MessageSquare, Trash2, Smile } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Get session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
        });

        fetchMessages();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('global-chat')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                async (payload) => {
                    // Fetch profile for the new message
                    const { data: profile } = await supabase
                        .from('students')
                        .select('name, avatar_url')
                        .eq('user_id', payload.new.user_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        students: profile
                    };

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (!error) setUserProfile(data);
    };

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                *,
                students:user_id (
                    name,
                    avatar_url
                )
            `)
            .eq('room_id', 'global')
            .order('created_at', { ascending: true })
            .limit(100);

        if (!error) {
            setMessages(data || []);
        }
        setLoading(false);
        scrollToBottom();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !session || sending) return;

        setSending(true);
        const { error } = await supabase
            .from('chat_messages')
            .insert([
                {
                    user_id: session.user.id,
                    content: newMessage.trim(),
                    room_id: 'global'
                }
            ]);

        if (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } else {
            setNewMessage('');
        }
        setSending(false);
    };

    if (loading && messages.length === 0) {
        return (
            <div className="chat-loading">
                <Loader2 className="spinner" />
                <p>Connecting to global chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <MessageSquare size={48} className="empty-icon" />
                        <h3>No messages yet</h3>
                        <p>Be the first one to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = session?.user?.id === msg.user_id;
                        return (
                            <div key={msg.id} className={`message-wrapper ${isOwn ? 'own' : ''}`}>
                                {!isOwn && (
                                    <div className="sender-avatar">
                                        {msg.students?.avatar_url ? (
                                            <img src={msg.students.avatar_url} alt="" />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="message-content">
                                    {!isOwn && <span className="sender-name">{msg.students?.name || 'Anonymous User'}</span>}
                                    <div className="message-bubble">
                                        <p>{msg.content}</p>
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                {!session ? (
                    <div className="login-prompt">
                        <p>Please <a href="/login">Sign In</a> to join the conversation</p>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="chat-form">
                        <button type="button" className="emoji-btn">
                            <Smile size={22} />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            maxLength={500}
                            autoComplete="off"
                            autoCorrect="on"
                            spellCheck="true"
                            enterKeyHint="send"
                        />
                        <button type="submit" className="send-btn" disabled={!newMessage.trim() || sending}>
                            {sending ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Chat;
