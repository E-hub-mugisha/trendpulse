import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Reply, X } from 'lucide-react';

const LONG_POST = 280;

function Avatar({ user, size = 'h-10 w-10', tone = 'brand' }) {
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
    if (user?.avatar) {
        return <img src={user.avatar} alt="" className={`${size} shrink-0 rounded-full object-cover`} />;
    }
    return (
        <div className={`${size} flex shrink-0 items-center justify-center rounded-full text-xs font-bold ${tone === 'brand' ? 'bg-[#0A599E] text-white' : 'bg-slate-200 text-slate-600'}`}>
            {initial}
        </div>
    );
}

export default function CommunityPost({ post, isAuthenticated }) {
    const { auth } = usePage().props;
    const authed = isAuthenticated ?? !!auth?.user;

    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [liked, setLiked] = useState(!!post.liked_by_user);
    const [likes, setLikes] = useState(post.likes_count || 0);
    const [burst, setBurst] = useState(0);
    const textareaRef = useRef(null);

    const { data, setData, post: submitComment, processing, errors, reset } = useForm({
        content: '',
        parent_id: null,
    });

    // Keep optimistic like state in sync with server data
    useEffect(() => {
        setLiked(!!post.liked_by_user);
        setLikes(post.likes_count || 0);
    }, [post.liked_by_user, post.likes_count]);

    // Lightbox: Esc to close + scroll lock
    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e) => e.key === 'Escape' && setLightbox(false);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
    }, [lightbox]);

    const goLogin = () => router.visit('/login');

    const handleLike = () => {
        if (!authed) return goLogin();
        const next = !liked;
        setLiked(next);
        setLikes((l) => Math.max(0, l + (next ? 1 : -1)));
        setBurst((b) => b + 1);
        router.post(`/community/${post.id}/like`, {}, {
            preserveScroll: true,
            onError: () => { setLiked(!next); setLikes((l) => Math.max(0, l + (next ? -1 : 1))); },
        });
    };

    const handleCommentLike = (commentId) => {
        if (!authed) return goLogin();
        router.post(`/community/comments/${commentId}/like`, {}, { preserveScroll: true });
    };

    const handleReply = (comment) => {
        setReplyingTo(comment);
        setData({ content: '', parent_id: comment.id });
        setShowComments(true);
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData({ content: '', parent_id: null });
        reset();
    };

    const handleCommentSubmit = (e) => {
        e?.preventDefault();
        if (!data.content.trim() || processing) return;
        submitComment(`/community/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => { reset(); setReplyingTo(null); setShowComments(true); },
        });
    };

    const content = post.content || '';
    const isLong = content.length > LONG_POST;
    const commentCount = post.comments_count || 0;

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
            <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Avatar user={post.user} size="h-11 w-11" />
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">{post.user?.name || 'Anonymous'}</h3>
                        <p className="mt-0.5 text-xs text-slate-400">{post.created_at}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className={`whitespace-pre-wrap text-[15px] leading-7 text-slate-700 ${isLong && !expanded ? 'line-clamp-5' : ''}`}>{content}</p>
                    {isLong && (
                        <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 text-sm font-semibold text-[#0A599E] hover:text-[#07406F]">
                            {expanded ? 'Show less' : 'Read more'}
                        </button>
                    )}

                    {post.image && (
                        <button
                            type="button"
                            onClick={() => setLightbox(true)}
                            aria-label="View image full size"
                            className="mt-4 block w-full overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2"
                        >
                            <img src={post.image} alt="" loading="lazy" className="max-h-[420px] w-full cursor-zoom-in object-cover transition duration-300 hover:scale-[1.02]" />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={handleLike}
                        aria-pressed={liked}
                        aria-label={authed ? (liked ? 'Unlike post' : 'Like post') : 'Log in to like'}
                        title={authed ? undefined : 'Log in to like'}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${
                            liked ? 'bg-[#0A599E]/10 text-[#0A599E]' : 'text-slate-500 hover:bg-slate-100 hover:text-[#0A599E]'
                        }`}
                    >
                        <Heart key={burst} className={`h-[18px] w-[18px] ${liked && burst ? 'animate-[ping_0.01s_ease-out]' : ''}`} fill={liked ? 'currentColor' : 'none'} strokeWidth={2} />
                        <span className="tabular-nums">{likes}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowComments((v) => !v)}
                        aria-expanded={showComments}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${
                            showComments ? 'bg-slate-100 text-[#0A599E]' : 'text-slate-500 hover:bg-slate-100 hover:text-[#0A599E]'
                        }`}
                    >
                        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} />
                        <span className="tabular-nums">{commentCount}</span>
                        <span className="hidden sm:inline">{commentCount === 1 ? 'Comment' : 'Comments'}</span>
                    </button>
                </div>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="tp-slide-up border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
                    {authed ? (
                        <form onSubmit={handleCommentSubmit}>
                            {replyingTo && (
                                <div className="mb-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2">
                                    <span className="text-xs text-slate-600">
                                        Replying to <strong className="text-slate-900">{replyingTo.user?.name}</strong>
                                    </span>
                                    <button type="button" onClick={cancelReply} className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-red-500" aria-label="Cancel reply">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Avatar user={auth?.user} size="h-9 w-9" />
                                <div className="min-w-0 flex-1">
                                    <textarea
                                        ref={textareaRef}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCommentSubmit(e); }}
                                        placeholder={replyingTo ? 'Write a reply…' : 'Write a comment…'}
                                        rows={2}
                                        disabled={processing}
                                        aria-label={replyingTo ? 'Reply' : 'Comment'}
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/20 disabled:opacity-50"
                                    />
                                    {errors.content && <p className="mt-1 text-xs font-medium text-red-500">{errors.content}</p>}

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="hidden text-[11px] text-slate-400 sm:block">Ctrl + Enter to send</span>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.content.trim()}
                                            className="ml-auto rounded-full bg-[#0A599E] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#07406F] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {processing ? 'Posting…' : replyingTo ? 'Reply' : 'Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center text-sm text-slate-500">
                            <Link href="/login" className="font-semibold text-[#0A599E] hover:underline">Log in</Link> or{' '}
                            <Link href="/register" className="font-semibold text-[#0A599E] hover:underline">create an account</Link> to join the conversation.
                        </div>
                    )}

                    <div className="mt-5 space-y-5">
                        {post.recent_comments?.length > 0 ? (
                            post.recent_comments.map((c) => (
                                <CommentItem key={c.id} comment={c} authed={authed} onReply={handleReply} onLike={handleCommentLike} />
                            ))
                        ) : (
                            <p className="py-4 text-center text-sm text-slate-400">No comments yet. {authed && 'Be the first to comment.'}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div className="tp-fade-in fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label="Post image" onClick={() => setLightbox(false)}>
                    <button type="button" onClick={() => setLightbox(false)} aria-label="Close image" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <X className="h-5 w-5" />
                    </button>
                    <img src={post.image} alt="" className="max-h-full max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </article>
    );
}

function CommentItem({ comment, authed, onReply, onLike, depth = 0 }) {
    return (
        <div>
            <div className="flex gap-3">
                <Avatar user={comment.user} size="h-8 w-8" tone="muted" />
                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/70">
                        <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-xs font-bold text-slate-900">{comment.user?.name || 'Anonymous'}</span>
                            <span className="shrink-0 text-[11px] text-slate-400">{comment.created_at}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{comment.content}</p>
                    </div>

                    <div className="mt-1 flex items-center gap-4 px-2">
                        <button
                            type="button"
                            onClick={() => onLike(comment.id)}
                            aria-pressed={!!comment.liked_by_user}
                            title={authed ? undefined : 'Log in to like'}
                            className={`inline-flex items-center gap-1 text-xs font-semibold transition ${comment.liked_by_user ? 'text-[#0A599E]' : 'text-slate-400 hover:text-[#0A599E]'}`}
                        >
                            <Heart className="h-3.5 w-3.5" fill={comment.liked_by_user ? 'currentColor' : 'none'} />
                            Like{comment.likes_count > 0 && ` (${comment.likes_count})`}
                        </button>
                        {authed && (
                            <button type="button" onClick={() => onReply(comment)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-[#0A599E]">
                                <Reply className="h-3.5 w-3.5" /> Reply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {comment.replies?.length > 0 && (
                <div className={`mt-3 space-y-3 border-l-2 border-slate-200 pl-4 ${depth < 2 ? 'ml-4' : 'ml-0'}`}>
                    {comment.replies.map((r) => (
                        <CommentItem key={r.id} comment={r} authed={authed} onReply={onReply} onLike={onLike} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}