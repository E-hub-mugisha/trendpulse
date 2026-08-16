// resources/js/Pages/Admin/Youtube/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Star,
    PlayCircle,
    CheckCircle2,
    FileClock,
    X,
} from 'lucide-react';

function StatusBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
            <FileClock className="h-3 w-3" strokeWidth={2.5} />
            Draft
        </span>
    );
}

export default function Index({ videos, categories, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const applyFilters = (next) => {
        router.get('/admin/youtube', { ...filters, ...next }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleDelete = (id) => {
        router.delete(`/admin/youtube/${id}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
        });
    };

    return (
        <AdminLayout title="YouTube Videos">

            <div>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                    <div>
                        <p className="text-sm font-semibold text-red-600">
                            CONTENT
                        </p>
                        <h1 className="mt-1 text-2xl font-black tracking-tight">
                            YouTube Videos
                        </h1>
                    </div>

                    <Link
                        href="/admin/youtube/create"
                        className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Add Video
                    </Link>

                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Total Videos</p>
                        <p className="mt-1 text-2xl font-black">{stats.total}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Published</p>
                        <p className="mt-1 text-2xl font-black text-green-600">{stats.published}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Drafts</p>
                        <p className="mt-1 text-2xl font-black text-gray-500">{stats.draft}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Total Views</p>
                        <p className="mt-1 text-2xl font-black">{stats.totalViews.toLocaleString()}</p>
                    </div>

                </div>

                {/* Filters */}
                <div className="mb-5 flex flex-wrap items-center gap-3">

                    <form onSubmit={submitSearch} className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
                        <Search className="h-4 w-4 text-gray-400" strokeWidth={2} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search videos..."
                            className="w-full border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                        />
                    </form>

                    <select
                        value={filters.category || ''}
                        onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilters({ status: e.target.value || undefined })}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="featured">Featured</option>
                    </select>

                    {(filters.search || filters.category || filters.status) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/youtube', {}, { preserveState: true, preserveScroll: true });
                            }}
                            className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-black"
                        >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                            Clear
                        </button>
                    )}

                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">

                    {videos.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <PlayCircle className="h-10 w-10 text-gray-200" strokeWidth={1.5} />
                            <p className="mt-3 text-sm font-bold text-gray-500">No videos found</p>
                            <p className="mt-1 text-xs text-gray-400">Try adjusting your filters or add a new video.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Video</th>
                                    <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 sm:table-cell">Category</th>
                                    <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 md:table-cell">Views</th>
                                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 lg:table-cell">Published</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.data.map((video) => (
                                    <tr key={video.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40">

                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    <img
                                                        src={video.thumbnail_url}
                                                        alt={video.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    {video.is_featured && (
                                                        <div className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/70">
                                                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="line-clamp-2 max-w-xs text-sm font-bold text-gray-800">
                                                    {video.title}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="hidden px-5 py-3 text-sm text-gray-500 sm:table-cell">
                                            {video.category || '—'}
                                        </td>

                                        <td className="hidden px-5 py-3 text-sm text-gray-500 md:table-cell">
                                            {video.views.toLocaleString()}
                                        </td>

                                        <td className="px-5 py-3">
                                            <StatusBadge published={video.is_published} />
                                        </td>

                                        <td className="hidden px-5 py-3 text-sm text-gray-400 lg:table-cell">
                                            {video.published_at || '—'}
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-1">

                                                <a
                                                    href={`/entertainment/videos/${video.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" strokeWidth={2} />
                                                </a>

                                                <Link
                                                    href={`/admin/youtube/${video.slug}/edit`}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" strokeWidth={2} />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDelete(video)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>

                {videos.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {videos.links.map((link, index) => (
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

            {/* Delete confirmation modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
                        <h3 className="text-lg font-black">Delete video?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            "{confirmDelete.title}" will be permanently removed. This can't be undone.
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