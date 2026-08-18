// resources/js/Pages/Admin/Community/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Eye,
    Trash2,
    MessageCircle,
    Heart,
    CheckCircle2,
    Clock,
    Flag,
    X,
    ImageIcon,
} from 'lucide-react';

function StatusBadge({ status }) {
    const config = {
        published: { icon: CheckCircle2, className: 'bg-green-100 text-green-700', label: 'Published' },
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

export default function Index({ posts, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const applyFilters = (next) => {
        router.get('/admin/community', { ...filters, ...next }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const updateStatus = (post, status) => {
        router.patch(`/admin/community/${post.id}/status`, { status }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDelete = (id) => {
        router.delete(`/admin/community/${id}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
        });
    };

    return (
        <AdminLayout title="Community">

            <div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-red-600">
                        MODERATION
                    </p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight">
                        Community Posts
                    </h1>
                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Total Posts</p>
                        <p className="mt-1 text-2xl font-black">{stats.total}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Published</p>
                        <p className="mt-1 text-2xl font-black text-green-600">{stats.published}</p>
                    </div>

                    <div className="rounded-2xl border border-yellow-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Pending Review</p>
                        <p className="mt-1 text-2xl font-black text-yellow-600">{stats.pending}</p>
                    </div>

                    <div className={`rounded-2xl border bg-white p-5 ${stats.flagged > 0 ? 'border-red-200' : 'border-gray-100'}`}>
                        <p className="text-xs font-medium text-gray-400">Flagged</p>
                        <p className="mt-1 text-2xl font-black text-red-600">{stats.flagged}</p>
                    </div>

                </div>

                <div className="mb-5 flex flex-wrap items-center gap-3">

                    <form onSubmit={submitSearch} className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
                        <Search className="h-4 w-4 text-gray-400" strokeWidth={2} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search posts or authors..."
                            className="w-full border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                        />
                    </form>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilters({ status: e.target.value || undefined })}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="flagged">Flagged</option>
                    </select>

                    {(filters.search || filters.status) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/community', {}, { preserveState: true, preserveScroll: true });
                            }}
                            className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-black"
                        >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                            Clear
                        </button>
                    )}

                </div>

                <div className="space-y-3">

                    {posts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 text-center">
                            <MessageCircle className="h-10 w-10 text-gray-200" strokeWidth={1.5} />
                            <p className="mt-3 text-sm font-bold text-gray-500">No posts found</p>
                        </div>
                    ) : (
                        posts.data.map((post) => (
                            <div key={post.id} className="rounded-2xl border border-gray-100 bg-white p-5">

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex min-w-0 items-start gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                            {post.user.name?.charAt(0).toUpperCase() || '?'}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-bold text-gray-800">{post.user.name}</p>
                                                <StatusBadge status={post.status} />
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-400">{post.created_at}</p>

                                            <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                                                {post.content}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                                {post.image && (
                                                    <span className="flex items-center gap-1">
                                                        <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                                        Image attached
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3.5 w-3.5" strokeWidth={2} />
                                                    {post.likes_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                                                    {post.comments_count}
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <Link
                                            href={`/admin/community/${post.id}`}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black"
                                            title="View details"
                                        >
                                            <Eye className="h-4 w-4" strokeWidth={2} />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDelete(post)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </div>

                                </div>

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => updateStatus(post, 'published')}
                                        disabled={post.status === 'published'}
                                        className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100 disabled:pointer-events-none disabled:opacity-40"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateStatus(post, 'flagged')}
                                        disabled={post.status === 'flagged'}
                                        className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-40"
                                    >
                                        Flag
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateStatus(post, 'pending')}
                                        disabled={post.status === 'pending'}
                                        className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 hover:bg-yellow-100 disabled:pointer-events-none disabled:opacity-40"
                                    >
                                        Mark Pending
                                    </button>

                                </div>

                            </div>
                        ))
                    )}

                </div>

                {posts.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {posts.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active ? 'bg-black text-white' : 'bg-gray-100'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

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
                                onClick={() => setConfirmDelete(null)}
                                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(confirmDelete.id)}
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