// resources/js/Pages/Admin/People/Show.jsx

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
    Flame,
    CheckCircle2,
    FileClock,
    Calendar,
    Clock,
    TrendingUp,
    Users,
    Heart,
    FolderOpen,
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
            <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
    );
}

export default function Show({ story, relatedStories }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
        router.delete(`/admin/people/${story.slug}`);
    };

    return (
        <AdminLayout title="Story Details">

            <div className="mx-auto max-w-4xl">

                <Link
                    href="/admin/people"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to stories
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge published={story.is_published} />
                            {story.is_featured && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
                                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                    Featured
                                </span>
                            )}
                            {story.is_popular && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">
                                    <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                                    Popular
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                            {story.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Heart className="h-3.5 w-3.5" strokeWidth={2} />
                                {story.person_name}
                                {story.relationship_status && ` · ${story.relationship_status}`}
                            </span>
                            {story.category && (
                                <span className="flex items-center gap-1.5">
                                    <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
                                    {story.category}
                                </span>
                            )}
                            {story.published_at && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                                    {story.published_at}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                        
                        <a   href={`/people/${story.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                            <ExternalLink className="h-4 w-4" strokeWidth={2} />
                            <span className="hidden sm:inline">View live</span>
                        </a>

                        <Link
                            href={`/admin/people/${story.slug}/edit`}
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

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard icon={Eye} label="Total Views" value={story.views.toLocaleString()} />
                    <StatCard icon={TrendingUp} label="Last 7 Days" value={story.views_last_7_days.toLocaleString()} />
                    <StatCard icon={TrendingUp} label="Last 30 Days" value={story.views_last_30_days.toLocaleString()} />
                    <StatCard icon={Clock} label="Last Updated" value={story.updated_at} />
                </div>

                {story.featured_image ? (
                    <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
                        <img
                            src={story.featured_image}
                            alt={story.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="mt-8 flex aspect-[16/9] items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                        <Users className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                )}

                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">

                    {story.excerpt && (
                        <p className="text-lg font-medium leading-7 text-gray-500">
                            {story.excerpt}
                        </p>
                    )}

                    <div className="mt-6 whitespace-pre-line border-t border-gray-100 pt-6 text-[15px] leading-7 text-gray-700">
                        {story.story}
                    </div>

                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-700">Metadata</h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Slug</dt>
                            <dd className="mt-1 font-mono text-sm text-gray-700">{story.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Person</dt>
                            <dd className="mt-1 text-sm text-gray-700">{story.person_name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Created</dt>
                            <dd className="mt-1 text-sm text-gray-700">{story.created_at}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-400">Story ID</dt>
                            <dd className="mt-1 text-sm text-gray-700">#{story.id}</dd>
                        </div>
                    </dl>
                </div>

                {relatedStories.length > 0 && (
                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-bold text-gray-700">
                            Other stories in this category
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {relatedStories.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/admin/people/${item.slug}`}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:bg-gray-50"
                                >
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        {item.featured_image ? (
                                            <img src={item.featured_image} alt={item.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-300">
                                                <Users className="h-4 w-4" strokeWidth={1.5} />
                                            </div>
                                        )}
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
                        <h3 className="text-lg font-black">Delete story?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            "{story.title}" will be permanently removed. This can't be undone.
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