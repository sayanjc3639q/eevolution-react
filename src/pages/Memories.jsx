import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Plus, Heart, MessageCircle, X, Loader2, Send, Trash2, ChevronUp, MoreHorizontal, Share2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import './Memories.css';

const Memories = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [uploading, setUploading] = useState(false);
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [likingIds, setLikingIds] = useState(new Set());
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [actionCooldowns, setActionCooldowns] = useState({});
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        if (isCommentModalOpen || isUploadModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isCommentModalOpen, isUploadModalOpen]);

    // Form states
    const [caption, setCaption] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [userRoll, setUserRoll] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showCopied, setShowCopied] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    if (error.message.includes('refresh_token_not_found') || error.message.includes('Refresh Token Not Found')) {
                        await supabase.auth.signOut();
                    }
                    return;
                }
                setSession(session);

                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('students')
                        .select('is_admin, class_roll_no')
                        .eq('user_id', session.user.id)
                        .single();

                    if (profile) {
                        if (profile.is_admin) setIsAdmin(true);
                        setUserRoll(profile.class_roll_no || 'N/A');
                    }
                }
            } catch (err) {
                console.warn('Memories session check failed:', err);
            }
        };

        checkUser();
        fetchMemories();

        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clicks outside to close menu
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fetchMemories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memories')
            .select('*, memory_comments(*), memory_likes(user_id), students(avatar_url)')
            .order('created_at', { ascending: false });

        if (!error) setMemories(data);
        setLoading(false);
    };

    const handleFileChange = (e) => {
        setUploadError(''); // Clear previous errors
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                setUploadError('Image is too large. Please select a photo under 3MB.');
                setImageFile(null);
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
                e.target.value = null;
                return;
            }
            setImageFile(file);

            // USE URL.createObjectURL instead of FileReader for mobile performance
            // This is much faster and uses far less memory
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile || !session) return;

        setUploadError('');
        setUploading(true);
        try {
            // STEP 1: Upload to Cloudinary (Using unsigned upload for ease)
            // You will need to add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ee_memories');

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const cloudData = await res.json();

            if (cloudData.secure_url) {
                // STEP 2: Save metadata to Supabase
                const { error } = await supabase.from('memories').insert([{
                    uploader_name: session.user.user_metadata.full_name || 'Anonymous',
                    roll_number: userRoll,
                    caption,
                    image_url: cloudData.secure_url,
                    user_id: session.user.id
                }]);

                if (!error) {
                    setIsUploadModalOpen(false);
                    setCaption('');
                    setImageFile(null);
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    setImagePreview(null);
                    fetchMemories();
                }
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleLike = async (memoryId, alreadyLiked) => {
        if (!session || likingIds.has(memoryId)) return;

        // RATE LIMITER: Prevent more than 1 action per second per post
        const now = Date.now();
        const lastAction = actionCooldowns[memoryId] || 0;
        if (now - lastAction < 1000) {
            console.warn("Rate limited: Relax! You're clicking too fast.");
            return;
        }

        setLikingIds(prev => new Set(prev).add(memoryId));
        setActionCooldowns(prev => ({ ...prev, [memoryId]: now }));

        // Optimistic UI Update: Instantly update the count and liked status locally
        const memoryIndex = memories.findIndex(m => m.id === memoryId);
        if (memoryIndex !== -1) {
            const updatedMemories = [...memories];
            const memory = { ...updatedMemories[memoryIndex] };

            if (alreadyLiked) {
                memory.likes_count = Math.max(0, memory.likes_count - 1);
                // Filter out the current user's ID from the likes list
                if (memory.memory_likes) {
                    memory.memory_likes = memory.memory_likes.filter(l => l.user_id !== session.user.id);
                }
            } else {
                memory.likes_count += 1;
                // Add the current user's ID to the likes list
                if (!memory.memory_likes) memory.memory_likes = [];
                memory.memory_likes = [...memory.memory_likes, { user_id: session.user.id }];
            }

            updatedMemories[memoryIndex] = memory;
            setMemories(updatedMemories);
        }

        try {
            if (alreadyLiked) {
                // Delete the like in background
                await supabase
                    .from('memory_likes')
                    .delete()
                    .match({ memory_id: memoryId, user_id: session.user.id });
            } else {
                // Insert the like in background
                await supabase
                    .from('memory_likes')
                    .insert([{ memory_id: memoryId, user_id: session.user.id }]);
            }
            // No full UI refresh (fetchMemories) needed anymore!
        } catch (err) {
            console.error("Liking failed, reverting:", err);
            // On hard failure, we might want to re-fetch, but for now we keep the optimistic state
            fetchMemories();
        } finally {
            setLikingIds(prev => {
                const updated = new Set(prev);
                updated.delete(memoryId);
                return updated;
            });
        }
    };

    const handleDelete = async (memoryId) => {
        if (!window.confirm("ARE YOU SURE? THIS MEMORY WILL BE DELETED FOREVER!")) return;

        setDeletingIds(prev => new Set(prev).add(memoryId));
        const { error } = await supabase.from('memories').delete().eq('id', memoryId);

        if (!error) {
            fetchMemories();
        } else {
            alert("Error deleting memory: " + error.message);
        }
        setDeletingIds(prev => {
            const updated = new Set(prev);
            updated.delete(memoryId);
            return updated;
        });
    };

    const handleShare = async (memory) => {
        const shareUrl = `${window.location.origin}/memories?id=${memory.id}`;
        const shareText = `📸 Campus Memory by ${memory.uploader_name}: "${memory.caption}"\n\nView Full Image: ${memory.image_url}\n\n`;

        // 1. Try Native Share (App Tray) - Requires HTTPS
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'EEvolution Memory',
                    text: shareText,
                    url: shareUrl,
                });
                return; // Share success
            } catch (err) {
                if (err.name === 'AbortError') return; // User cancelled
                console.error('Native share failed, using fallback:', err);
            }
        }

        // 2. Fallback: Copy to Clipboard
        try {
            await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);

            // 3. Mobile Bonus: If native share fails but it's mobile, trigger WhatsApp
            if (/iPhone|Android/i.test(navigator.userAgent)) {
                const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
                window.open(waUrl, '_blank');
            }
        } catch (err) {
            // Only hits if both methods fail (usually extreme HTTP security)
            alert("Sharing is restricted on this connection. Copy the URL manually or try on a secure (HTTPS) link.");
        }
    };

    const postComment = async (e) => {
        e.preventDefault();
        if (!newComment || !session) return;

        const { error } = await supabase.from('memory_comments').insert([{
            memory_id: selectedMemory.id,
            user_id: session.user.id,
            user_name: session.user.user_metadata.full_name || 'Student',
            comment_text: newComment
        }]);

        if (!error) {
            setNewComment('');
            fetchMemories();
            // Refresh local selected memory comments
            const { data } = await supabase.from('memories').select('*, memory_comments(*)').eq('id', selectedMemory.id).single();
            setSelectedMemory(data);
        }
    };

    return (
        <div className="memories-page">
            <SEO 
                title="Batch Memories"
                description="Explore the digital album of our collective journey. Photos and memories shared by Electrical Engineering students."
                keywords="EEvolution memories, batch photos, student life, memories"
            />
            <div className="page-header sticky-header">
                {session && (
                    <button className="add-memory-btn" onClick={() => setIsUploadModalOpen(true)}>
                        <Plus size={20} />
                        <span>Share a Moment</span>
                    </button>
                )}
            </div>

            {loading ? (
                <div className="memories-grid skeleton-loading">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="memory-card skeleton-card-item">
                            <div className="memory-card-header">
                                <div className="uploader-meta">
                                    <div className="uploader-avatar skeleton-pulse" style={{ background: 'var(--bg-tertiary)' }}></div>
                                    <div className="uploader-details">
                                        <div className="skeleton-line skeleton-pulse" style={{ width: '100px', height: '14px', marginBottom: '4px' }}></div>
                                        <div className="skeleton-line skeleton-pulse" style={{ width: '60px', height: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="memory-image skeleton-pulse" style={{ aspectRatio: '3/4', background: 'var(--bg-tertiary)' }}></div>
                            <div className="memory-card-content">
                                <div className="skeleton-line skeleton-pulse" style={{ width: '40%', height: '12px', marginBottom: '10px' }}></div>
                                <div className="skeleton-line skeleton-pulse" style={{ width: '90%', height: '12px' }}></div>
                                <div className="skeleton-line skeleton-pulse" style={{ width: '70%', height: '12px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : memories.length > 0 ? (
                <div className="memories-grid">
                    {memories.map((memory) => {
                        const isLiked = memory.memory_likes?.some(l => l.user_id === session?.user?.id);
                        return (
                            <div key={memory.id} className="memory-card">
                                {/* Card Header */}
                                <div className="memory-card-header">
                                    <div className="uploader-meta">
                                        <div className="uploader-avatar">
                                            {memory.students?.avatar_url ? (
                                                <img
                                                    src={memory.students.avatar_url}
                                                    alt={memory.uploader_name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            ) : (
                                                memory.uploader_name.charAt(0)
                                            )}
                                        </div>
                                        <div className="uploader-details">
                                            <span className="uploader-name">{memory.uploader_name}</span>
                                            <span className="uploader-roll">{memory.roll_number}</span>
                                        </div>
                                    </div>
                                    <div className="memory-header-options">
                                        <button
                                            className="options-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === memory.id ? null : memory.id);
                                            }}
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        {activeMenuId === memory.id && (
                                            <div className="options-dropdown">
                                                {(isAdmin || memory.user_id === session?.user?.id) && (
                                                    <button
                                                        className="dropdown-item delete"
                                                        onClick={() => handleDelete(memory.id)}
                                                        disabled={deletingIds.has(memory.id)}
                                                    >
                                                        <Trash2 size={16} /> Delete Post
                                                    </button>
                                                )}
                                                <button className="dropdown-item" onClick={() => handleShare(memory)}>
                                                    <Share2 size={16} /> Share Post
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Image */}
                                <div className="memory-image">
                                    <img src={memory.image_url} alt={memory.caption} />
                                </div>

                                {/* Action Bar */}
                                <div className="memory-card-actions">
                                    <div className="interaction-buttons">
                                        <button
                                            className={`action-icon-btn ${isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(memory.id, isLiked)}
                                        >
                                            <Heart
                                                size={26}
                                                fill={isLiked ? "#ff4d4d" : "none"}
                                                color={isLiked ? "#ff4d4d" : "currentColor"}
                                            />
                                        </button>
                                        <button className="action-icon-btn" onClick={() => {
                                            setSelectedMemory(memory);
                                            setIsCommentModalOpen(true);
                                        }}>
                                            <MessageCircle size={26} />
                                        </button>
                                        <button className="action-icon-btn" onClick={() => handleShare(memory)}>
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="memory-card-content">
                                    <div className="card-likes-count">{memory.likes_count} likes</div>
                                    <p className="memory-caption">
                                        <span className="caption-date">{new Date(memory.created_at).toLocaleDateString()}</span> {memory.caption}
                                    </p>
                                    {memory.memory_comments?.length > 0 && (
                                        <button className="view-comments-link" onClick={() => {
                                            setSelectedMemory(memory);
                                            setIsCommentModalOpen(true);
                                        }}>
                                            View all {memory.memory_comments?.length} comments
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-memories">
                    <div className="ghost-icon-box">
                        <Camera size={48} className="ghost-icon" />
                    </div>
                    <h3>No Memories Yet</h3>
                    <p>Be the first to share a moment! Click "Share a Moment" to start.</p>
                </div>
            )}

            {/* Upload Modal - Using class for stable state instead of conditional rendering */}
            <div className={`modal-overlay ${isUploadModalOpen ? 'show' : ''}`}>
                <div className="upload-modal">
                    <div className="modal-header">
                        <h2>Share New <span className="highlight">Memory</span></h2>
                        <button className="close-btn" onClick={() => {
                            setIsUploadModalOpen(false);
                            setUploadError('');
                        }}>
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleUpload}>
                        <label className="image-upload-area" htmlFor="fileInput">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="preview-img" />
                            ) : (
                                <div className="upload-placeholder">
                                    <ImageIcon size={40} />
                                    <p>Click to select a photo (Max 3MB)</p>
                                </div>
                            )}
                            <input id="fileInput" type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </label>

                        {uploadError && (
                            <div className="upload-error-message">
                                {uploadError}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Caption</label>
                            <textarea
                                placeholder="Write a short story about this moment..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                maxLength={150}
                            />
                        </div>
                        <button type="submit" className={`submit-memory-btn ${uploading ? 'is-uploading' : ''}`} disabled={uploading || !imageFile}>
                            {uploading ? (
                                <>
                                    <Loader2 className="spinner" size={20} />
                                    <span>Uploading...</span>
                                </>
                            ) : "Post Memory"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Full Screen Comments Modal */}
            {isCommentModalOpen && selectedMemory && (
                <div className="fullscreen-comment-overlay">
                    <div className="fullscreen-comment-view">
                        <div className="fullscreen-header">
                            <div className="poster-info">
                                <h3>{selectedMemory.uploader_name}</h3>
                                <span className="post-date">{new Date(selectedMemory.created_at).toLocaleDateString()}</span>
                            </div>
                            <button className="close-fullscreen-btn" onClick={() => setIsCommentModalOpen(false)}>
                                <X size={28} />
                            </button>
                        </div>

                        <div className="fullscreen-content">
                            <div className="memory-context-box">
                                <img src={selectedMemory.image_url} alt="Memory" className="context-image" />
                                <div className="context-text">
                                    <p className="context-caption">"{selectedMemory.caption}"</p>
                                </div>
                            </div>

                            <div className="comments-section-label">Discussion ({selectedMemory.memory_comments?.length || 0})</div>

                            <div className="fullscreen-comments-list">
                                {selectedMemory.memory_comments?.length > 0 ? (
                                    selectedMemory.memory_comments.map(c => (
                                        <div key={c.id} className="comment-bubble">
                                            <div className="comment-bubble-header">
                                                <strong>{c.user_name}</strong>
                                                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p>{c.comment_text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-comments-view">
                                        <MessageCircle size={32} opacity={0.3} />
                                        <p>No comments yet. Be the first to start the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form className="fullscreen-comment-input" onSubmit={postComment}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment}
                                className="comment-submit-btn"
                                onPointerDown={(e) => {
                                    // CRITICAL: Prevent input blur before submit
                                    if (newComment) e.preventDefault();
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Back to Top Button */}
            <button
                className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <ChevronUp size={28} />
            </button>

            {/* Link Copied Toast */}
            <div className={`copied-toast ${showCopied ? 'show' : ''}`}>
                Link copied to clipboard!
            </div>
        </div>
    );
};

export default Memories;
