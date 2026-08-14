// resources/js/Components/CommunityPost.jsx

import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function ThumbsUpIcon({ filled }) {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-1.6l1.3-6.5a2 2 0 0 0-2-2.4H14l.7-4.2a1.8 1.8 0 0 0-3.2-1.4L7 11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ThumbsDownIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 2v11M22 11V4a2 2 0 0 0-2-2H7.5a2 2 0 0 0-2 1.6L4.2 10a2 2 0 0 0 2 2.4H10l-.7 4.2a1.8 1.8 0 0 0 3.2 1.4L17 13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CommentBubbleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.3-3.6-.8L3 21l1.4-4.2a8.5 8.5 0 1 1 16.6-4.8Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ShareIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DotsIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
        </svg>
    );
}

function Avatar({ user, className = 'h-10 w-10' }) {
    return (
        <div className={`${className} shrink-0 overflow-hidden rounded-full bg-gray-200`}>
            {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                    {user.name?.charAt(0) || '?'}
                </div>
            )}
        </div>
    );
}

function CommentItem({ comment, postId, isAuthenticated, depth = 0 }) {
    const [liked, setLiked] = useState(comment.liked_by_user);
    const [likesCount, setLikesCount] = useState(comment.likes_count);
    const [replying, setReplying] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
        parent_id: comment.id,
    });

    const toggleLike = () => {
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }

        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

        router.post(`/community/comments/${comment.id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const submitReply = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        post(`/community/${postId}/comments`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setReplies((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        content: data.content,
                        created_at: 'just now',
                        user: { name: 'You', avatar: null },
                        likes_count: 0,
                        liked_by_user: false,
                        replies: [],
                    },
                ]);
                reset('content');
                setReplying(false);
            },
        });
    };

    return (
        <div className={depth > 0 ? 'ml-10 mt-3' : ''}>

            <div className="flex gap-3">

                <Avatar user={comment.user} className={depth > 0 ? 'h-7 w-7' : 'h-9 w-9'} />

                <div className="min-w-0 flex-1">

                    <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-gray-900">
                            {comment.user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {comment.created_at}
                        </span>
                    </div>

                    <p className="mt-0.5 text-sm leading-5 text-gray-800">
                        {comment.content}
                    </p>

                    <div className="mt-1.5 flex items-center gap-4">

                        <button
                            type="button"
                            onClick={toggleLike}
                            className={`flex items-center gap-1.5 transition ${
                                liked ? 'text-black' : 'text-gray-400 hover:text-black'
                            }`}
                        >
                            <ThumbsUpIcon filled={liked} />
                            <span className="text-xs font-medium">
                                {likesCount > 0 ? likesCount : ''}
                            </span>
                        </button>

                        {depth === 0 && isAuthenticated && (
                            <button
                                type="button"
                                onClick={() => setReplying((prev) => !prev)}
                                className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-black"
                            >
                                Reply
                            </button>
                        )}

                    </div>

                    {replying && (
                        <form onSubmit={submitReply} className="mt-2 flex items-center gap-2 border-b border-gray-200 pb-1">
                            <input
                                type="text"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder={`Reply to ${comment.user.name}...`}
                                autoFocus
                                className="flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                disabled={processing || !data.content.trim()}
                                className="text-xs font-bold uppercase text-blue-600 disabled:text-gray-300"
                            >
                                Reply
                            </button>
                        </form>
                    )}

                    {replies.length > 0 && (
                        <div className="space-y-3">
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    isAuthenticated={isAuthenticated}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default function CommunityPost({ post, isAuthenticated }) {
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(post.liked_by_user);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [comments, setComments] = useState(post.recent_comments || []);
    const [imageExpanded, setImageExpanded] = useState(false);

    const { data, setData, post: submitComment, processing, reset } = useForm({
        content: '',
        parent_id: null,
    });

    const toggleLike = () => {
        if (!isAuthenticated) {
            router.visit('/login');
            return;
        }

        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

        router.post(`/community/${post.id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const submitCommentForm = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        submitComment(`/community/${post.id}/comments`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setComments((prev) => [
                    {
                        id: Date.now(),
                        content: data.content,
                        created_at: 'just now',
                        user: { name: 'You', avatar: null },
                        likes_count: 0,
                        liked_by_user: false,
                        replies: [],
                    },
                    ...prev,
                ]);
                reset('content');
            },
        });
    };

    return (
        <div className="border-b border-gray-200 py-6 first:pt-0">

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">
                    <Avatar user={post.user} />

                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            {post.user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {post.created_at}
                        </p>
                    </div>
                </div>

                <button type="button" className="text-gray-400 hover:text-black">
                    <DotsIcon />
                </button>

            </div>

            <p className="mt-3 whitespace-pre-line text-[15px] leading-6 text-gray-900">
                {post.content}
            </p>

            {post.image && (
                <div
                    className={`mt-3 flex justify-center overflow-hidden rounded-2xl border border-gray-200 bg-black/5 ${
                        imageExpanded ? '' : 'max-h-[480px]'
                    }`}
                >
                    <img
                        src={post.image}
                        alt=""
                        onClick={() => setImageExpanded((prev) => !prev)}
                        className="w-auto max-w-full cursor-pointer object-contain"
                    />
                </div>
            )}

            <div className="mt-4 flex items-center gap-5">

                <div className="flex items-center overflow-hidden rounded-full bg-gray-100">

                    <button
                        type="button"
                        onClick={toggleLike}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition ${
                            liked ? 'text-black' : 'text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        <ThumbsUpIcon filled={liked} />
                        {likesCount > 0 && likesCount}
                    </button>

                    <div className="h-5 w-px bg-gray-300" />

                    <button
                        type="button"
                        className="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-200"
                        title="Dislike"
                    >
                        <ThumbsDownIcon />
                    </button>

                </div>

                <button
                    type="button"
                    onClick={() => setShowComments((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
                >
                    <CommentBubbleIcon />
                    {post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}
                </button>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
                >
                    <ShareIcon />
                </button>

            </div>

            {showComments && (
                <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">

                    {isAuthenticated && (
                        <form onSubmit={submitCommentForm} className="flex items-center gap-3 border-b border-gray-200 pb-2">
                            <Avatar user={{ name: 'You', avatar: null }} className="h-8 w-8" />
                            <input
                                type="text"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
                            />
                            {data.content.trim() && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="text-xs font-bold uppercase text-blue-600 disabled:text-gray-300"
                                >
                                    Comment
                                </button>
                            )}
                        </form>
                    )}

                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                isAuthenticated={isAuthenticated}
                            />
                        ))
                    ) : (
                        <p className="py-2 text-sm text-gray-400">No comments yet — be the first.</p>
                    )}

                </div>
            )}

        </div>
    );
}