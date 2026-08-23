// resources/js/Pages/Admin/YoutubeVideos/Show.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ExternalLink,
    Eye,
    Star,
    CheckCircle2,
    FileClock,
    Calendar,
    Clock,
    FolderOpen,
    Video,
    PlayCircle,
} from 'lucide-react';

function StatusBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500">
            <FileClock className="h-3.5 w-3.5" strokeWidth={2.5} />
            Draft
        </span>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400">
                <Icon className="h-4 w-4" strokeWidth={2} />
                <p className="text-xs font-medium">{label}</p>
            </div>
            <p className="mt-2 truncate text-2xl font-black">{value}</p>
        </div>
    );
}

export default function Show({ video, relatedVideos }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [playing, setPlaying] = useState(false);

    const handleDelete = () => {
        router.delete(`/admin/youtube/${video.slug}`);
    };

    return (
        <AdminLayout title="Video Details">

            <div className="mx-auto max-w-4xl">

                <Link
                    href="/admin/youtube"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to videos
                </Link>

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge published={video.is_published} />
                            {video.is_featured && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
                                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                    Featured
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                            {video.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            {video.category && (
                                <span className="flex items-center gap-1.5">
                                    <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
                                    {video.category.name ?? video.category}
                                </span>
                            )}
                            {video.published_at && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                                    {video.published_at}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                        <a
                            href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                            <ExternalLink className="h-4 w-4" strokeWidth={2} />
                            <span className="hidden sm:inline">View on YouTube</span>
                        </a>

                        <Link
                            href={`/admin/youtube/${video.slug}/edit`}
                            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                            <span className="hidden sm:inline">Edit</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>

                    </div>

                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <StatCard icon={Eye} label="Total Views" value={(video.views ?? 0).toLocaleString()} />
                    <StatCard icon={Video} label="Video ID" value={video.youtube_id} />
                    <StatCard icon={Clock} label="Last Updated" value={video.updated_at} />
                </div>

                {/* Player */}
                <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black">
                    {playing ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPlaying(true)}
                            className="group relative h-full w-full"
                        >
                            <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition group-hover:scale-105">
                                    <PlayCircle className="h-9 w-9" strokeWidth={1.5} />
                                </span>
                            </span>
                        </button>
                    )}
                </div>

                {/* Description */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
                    {video.description ? (
                        <p className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
                            {video.description}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">No description added.</p>
                    )}
                </div>

                {/* Metadata footer */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-700">Metadata</h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Slug</dt>
                            <dd className="mt-1 font-mono text-sm text-gray-700">{video.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">YouTube ID</dt>
                            <dd className="mt-1 font-mono text-sm text-gray-700">{video.youtube_id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Created</dt>
                            <dd className="mt-1 text-sm text-gray-700">{video.created_at}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Video ID</dt>
                            <dd className="mt-1 text-sm text-gray-700">#{video.id}</dd>
                        </div>
                    </dl>
                </div>

                {/* Related videos */}
                {relatedVideos?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-bold text-gray-700">
                            Other videos in this category
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {relatedVideos.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/admin/youtube/${item.slug}`}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:bg-gray-50"
                                >
                                    <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={item.thumbnail_url}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="line-clamp-2 text-sm font-bold text-gray-800">
                                            {item.title}
                                        </p>
                                        {!item.is_published && (
                                            <span className="mt-1 inline-block text-xs font-bold text-gray-400">Draft</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
                        <h3 className="text-lg font-black">Delete video?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            "{video.title}" will be permanently removed. This can't be undone.
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
                                onClick={handleDelete}
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
