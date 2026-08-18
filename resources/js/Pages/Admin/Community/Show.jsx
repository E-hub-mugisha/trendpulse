// resources/js/Pages/Admin/Community/Show.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Trash2,
    Heart,
    CheckCircle2,
    Clock,
    Flag,
    Mail,
} from 'lucide-react';

function StatusBadge({ status, kind = 'post' }) {
    const approvedLabel = kind === 'post' ? 'Published' : 'Approved';

    const config = {
        published: { icon: CheckCircle2, className: 'bg-green-100 text-green-700', label: approvedLabel },
        approved: { icon: CheckCircle2, className: 'bg-green-100 text-green-700', label: approvedLabel },
        pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
        flagged: { icon: Flag, className: 'bg-red-100 text-red-700', label: 'Flagged' },
    };

    const { icon: Icon, className, label } = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            {label}
        </span>
    );
}

function CommentRow({ comment, depth = 0 }) {
    const updateStatus = (status) => {
        router.patch(`/admin/community/comments/${comment.id}/status`, { status }, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/community/comments/${comment.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className={depth > 0 ? 'ml-10 mt-3' : ''}>

            <div className="rounded-xl border border-gray-100 bg-white p-4">

                <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {comment.user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-bold text-gray-800">{comment.user.name}</p>
                                <StatusBadge status={comment.status} kind="comment" />
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">{comment.created_at}</p>
                            <p className="mt-1.5 text-sm text-gray-700">{comment.content}</p>
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                                <Heart className="h-3 w-3" strokeWidth={2} />
                                {comment.likes_count}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete comment"
                    >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>

                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    <button
                        type="button"
                        onClick={() => updateStatus('approved')}
                        disabled={comment.status === 'approved'}
                        className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 hover:bg-green-100 disabled:pointer-events-none disabled:opacity-40"
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        onClick={() => updateStatus('flagged')}
                        disabled={comment.status === 'flagged'}
                        className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-40"
                    >
                        Flag
                    </button>
                </div>

            </div>

            {comment.replies?.length > 0 && (
                <div className="space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentRow key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}

        </div>
    );
}

export default function Show({ post, comments }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const updatePostStatus = (status) => {
        router.patch(`/admin/community/${post.id}/status`, { status }, {
            preserveScroll: true,
        });
    };

    const handleDeletePost = () => {
        router.delete(`/admin/community/${post.id}`);
    };

    return (
        <AdminLayout title="Post Details">

            <div className="mx-auto max-w-3xl">

                <Link
                    href="/admin/community"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to community
                </Link>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">

                    <div className="flex flex-wrap items-start justify-between gap-4">

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                {post.user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{post.user.name}</p>
                                <p className="flex items-center gap-1 text-xs text-gray-400">
                                    <Mail className="h-3 w-3" strokeWidth={2} />
                                    {post.user.email}
                                </p>
                            </div>
                        </div>

                        <StatusBadge status={post.status} />

                    </div>

                    <p className="mt-5 whitespace-pre-line text-[15px] leading-6 text-gray-800">
                        {post.content}
                    </p>

                    {post.image && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
                            <img src={post.image} alt="" className="w-full object-cover" />
                        </div>
                    )}

                    <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" strokeWidth={2} />
                            {post.likes_count} likes
                        </span>
                        <span>{post.created_at}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5">

                        <button
                            type="button"
                            onClick={() => updatePostStatus('published')}
                            disabled={post.status === 'published'}
                            className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100 disabled:pointer-events-none disabled:opacity-40"
                        >
                            Approve
                        </button>

                        <button
                            type="button"
                            onClick={() => updatePostStatus('flagged')}
                            disabled={post.status === 'flagged'}
                            className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-40"
                        >
                            Flag
                        </button>

                        <button
                            type="button"
                            onClick={() => updatePostStatus('pending')}
                            disabled={post.status === 'pending'}
                            className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 hover:bg-yellow-100 disabled:pointer-events-none disabled:opacity-40"
                        >
                            Mark Pending
                        </button>

                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="ml-auto flex items-center gap-2 rounded-full border border-red-100 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                            Delete
                        </button>

                    </div>

                </div>

                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-black">
                        Comments ({comments.length})
                    </h2>

                    {comments.length > 0 ? (
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <CommentRow key={comment.id} comment={comment} />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-400">
                            No comments on this post yet.
                        </p>
                    )}
                </div>

            </div>

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
                        <h3 className="text-lg font-black">Delete post?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            This post and all its comments will be permanently removed. This can't be undone.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeletePost}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}