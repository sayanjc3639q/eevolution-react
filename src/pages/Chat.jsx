import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2, MessageSquare, Trash2, Smile, Pencil, Check, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Chat.css';

const EDIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes in ms

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [sending, setSending] = useState(false);

    // Context menu state
    const [activeMenu, setActiveMenu] = useState(null); // { msgId }
    const [deletingId, setDeletingId] = useState(null);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    // Ticker to re-evaluate 10-min window every 30s
    const [tick, setTick] = useState(0);

    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);
    const editInputRef = useRef(null);

    // ─── Auth + real-time ────────────────────────────────────────────────
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
        });

        fetchMessages();

        const channel = supabase
            .channel('global-chat')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, async (payload) => {
                const { data: profile } = await supabase
                    .from('students').select('name, avatar_url')
                    .eq('user_id', payload.new.user_id).single();
                setMessages(prev => [...prev, { ...payload.new, students: profile }]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' }, (payload) => {
                setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, (payload) => {
                setMessages(prev => prev.filter(m => m.id !== payload.old.id));
            })
            .subscribe();

        return () => { subscription.unsubscribe(); supabase.removeChannel(channel); };
    }, []);

    // Tick every 30s to refresh "edit window" availability
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 30_000);
        return () => clearInterval(interval);
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        if (activeMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]);

    // Focus edit input when editing starts
    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            const len = editInputRef.current.value.length;
            editInputRef.current.setSelectionRange(len, len);
        }
    }, [editingId]);

    // ─── Data fetching ───────────────────────────────────────────────────
    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase.from('students').select('*').eq('user_id', userId).single();
        if (!error) setUserProfile(data);
    };

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('chat_messages')
            .select(`*, students:user_id (name, avatar_url)`)
            .eq('room_id', 'global')
            .order('created_at', { ascending: true })
            .limit(100);
        if (!error) setMessages(data || []);
        setLoading(false);
        scrollToBottom();
    };

    useEffect(() => { scrollToBottom(); }, [messages]);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // ─── Send ────────────────────────────────────────────────────────────
    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newMessage.trim() || !session || sending) return;
        setSending(true);
        const { error } = await supabase
            .from('chat_messages')
            .insert([{ user_id: session.user.id, content: newMessage.trim(), room_id: 'global' }]);
        if (error) { console.error(error); alert('Failed to send. Try again.'); }
        else setNewMessage('');
        setSending(false);
    };

    // ─── Context menu ────────────────────────────────────────────────────
    const handleBubbleClick = (e, msg, isOwn) => {
        if (!isOwn || editingId === msg.id) return;
        e.preventDefault();
        e.stopPropagation();
        setActiveMenu(prev => prev?.msgId === msg.id ? null : { msgId: msg.id });
    };

    // ─── Delete ──────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!activeMenu) return;
        const msgId = activeMenu.msgId;
        setActiveMenu(null);
        setDeletingId(msgId);
        const { error } = await supabase
            .from('chat_messages').delete()
            .eq('id', msgId).eq('user_id', session.user.id);
        if (error) { console.error(error); alert('Could not delete. Try again.'); }
        else setMessages(prev => prev.filter(m => m.id !== msgId));
        setDeletingId(null);
    };

    // ─── Edit ────────────────────────────────────────────────────────────
    const startEdit = (msg) => {
        setActiveMenu(null);
        setEditingId(msg.id);
        setEditText(msg.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async () => {
        if (!editText.trim() || savingEdit) return;
        if (editText.trim() === messages.find(m => m.id === editingId)?.content) {
            cancelEdit(); return;
        }
        setSavingEdit(true);
        const now = new Date().toISOString();
        const { error } = await supabase
            .from('chat_messages')
            .update({ content: editText.trim(), is_edited: true, edited_at: now })
            .eq('id', editingId)
            .eq('user_id', session.user.id);
        if (error) { console.error(error); alert('Could not edit. Try again.'); }
        else {
            setMessages(prev => prev.map(m =>
                m.id === editingId
                    ? { ...m, content: editText.trim(), is_edited: true, edited_at: now }
                    : m
            ));
        }
        setSavingEdit(false);
        cancelEdit();
    };

    // Is the message within the 10-minute edit window?
    const canEdit = (msg) => {
        const age = Date.now() - new Date(msg.created_at).getTime();
        return age < EDIT_WINDOW_MS;
    };

    // Remaining time string for tooltip
    const editTimeLeft = (msg) => {
        const remaining = EDIT_WINDOW_MS - (Date.now() - new Date(msg.created_at).getTime());
        if (remaining <= 0) return 'Edit window expired';
        const mins = Math.ceil(remaining / 60_000);
        return `${mins} min${mins !== 1 ? 's' : ''} left to edit`;
    };

    // ─── Render ──────────────────────────────────────────────────────────
    if (loading && messages.length === 0) {
        return (
            <div className="chat-loading">
                <Loader2 className="spinner" />
                <p>Connecting to global chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-container" onClick={() => setActiveMenu(null)}>
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <MessageSquare size={48} className="empty-icon" />
                        <h3>No messages yet</h3>
                        <p>Be the first one to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = session?.user?.id === msg.user_id;
                        const isMenuOpen = activeMenu?.msgId === msg.id;
                        const isDeleting = deletingId === msg.id;
                        const isEditing = editingId === msg.id;
                        const editable = canEdit(msg);

                        return (
                            <div key={msg.id} className={`message-wrapper ${isOwn ? 'own' : ''}`}>
                                {!isOwn && (
                                    <div className="sender-avatar">
                                        {msg.students?.avatar_url
                                            ? <img src={msg.students.avatar_url} alt="" />
                                            : <div className="avatar-placeholder"><User size={16} /></div>
                                        }
                                    </div>
                                )}

                                <div className="message-content">
                                    {!isOwn && <span className="sender-name">{msg.students?.name || 'Anonymous User'}</span>}

                                    <div className="msg-bubble-wrapper">

                                        {/* ── Inline Edit Mode ── */}
                                        {isOwn && isEditing ? (
                                            <div className="edit-inline-box">
                                                <textarea
                                                    ref={editInputRef}
                                                    className="edit-textarea"
                                                    value={editText}
                                                    onChange={e => setEditText(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    maxLength={500}
                                                    rows={1}
                                                />
                                                <div className="edit-actions">
                                                    <button className="edit-cancel-btn" onClick={cancelEdit} title="Cancel (Esc)">
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button className="edit-save-btn" onClick={saveEdit} disabled={!editText.trim() || savingEdit} title="Save (Enter)">
                                                        {savingEdit ? <Loader2 size={14} className="spinner" /> : <Check size={14} />} Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── Normal Bubble ── */
                                            <div
                                                className={`message-bubble ${isOwn ? 'own-clickable' : ''} ${isDeleting ? 'deleting' : ''} ${isMenuOpen ? 'menu-open' : ''}`}
                                                onClick={(e) => handleBubbleClick(e, msg, isOwn)}
                                            >
                                                <p>{msg.content}</p>
                                                <div className="bubble-footer">
                                                    {msg.is_edited && (
                                                        <span className="edited-tag">edited</span>
                                                    )}
                                                    <span className="message-time">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Context Menu ── */}
                                        {isOwn && isMenuOpen && !isEditing && (
                                            <div
                                                className="msg-context-menu"
                                                ref={menuRef}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {/* Edit option */}
                                                <button
                                                    className={`ctx-btn ctx-edit-btn ${!editable ? 'ctx-btn-disabled' : ''}`}
                                                    onClick={() => editable && startEdit(msg)}
                                                    disabled={!editable}
                                                    title={editTimeLeft(msg)}
                                                >
                                                    <Pencil size={14} />
                                                    <span>Edit Message</span>
                                                    {!editable && <span className="ctx-expired-tag">Expired</span>}
                                                </button>

                                                <div className="ctx-divider" />

                                                {/* Delete option */}
                                                <button className="ctx-btn ctx-delete-btn" onClick={handleDelete}>
                                                    <Trash2 size={14} />
                                                    <span>Delete Message</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="chat-input-area">
                {!session ? (
                    <div className="login-prompt">
                        <p>Please <a href="/login">Sign In</a> to join the conversation</p>
                    </div>
                ) : (
                    <div className="chat-form">
                        <button type="button" className="emoji-btn"><Smile size={22} /></button>
                        <input
                            type="text"
                            name="chatMessage"
                            id="chatMessageInput"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(e); }}
                            maxLength={500}
                            autoComplete="off"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            data-form-type="other"
                            autoCorrect="on"
                            spellCheck="true"
                            enterKeyHint="send"
                        />
                        <button type="button" onClick={handleSendMessage} className="send-btn" disabled={!newMessage.trim() || sending}>
                            {sending ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
