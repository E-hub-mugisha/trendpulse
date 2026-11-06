// resources/js/Pages/Admin/Youtube/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
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
    LayoutGrid,
    List,
    Loader2,
    AlertTriangle,
    ImageOff,
    Film,
} from 'lucide-react';

const INDEX_URL = '/admin/youtube';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A599E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#084A85] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none ${focusRing}`;

const STATUS_TABS = [
    { value: '', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'featured', label: 'Featured' },
];

const number = (value) => (value ?? 0).toLocaleString();

/* ======================================================================== */
/*  PAGE                                                                     */
/* ======================================================================== */

export default function Index({ videos, categories = [], filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(() => {
        try {
            return localStorage.getItem('tp-admin-youtube-view') === 'grid' ? 'grid' : 'list';
        } catch {
            return 'list';
        }
    });

    const rows = videos.data ?? [];
    const total = videos.total ?? videos.meta?.total ?? rows.length;
    const hasFilters = Boolean(filters.search || filters.category || filters.status);

    const applyFilters = (next) => {
        router.get(
            INDEX_URL,
            { ...filters, page: undefined, ...next },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

    // Debounced search while typing. Skips when nothing changed so the page
    // doesn't reload itself on mount.
    useEffect(() => {
        if (search === (filters.search || '')) return undefined;
        const timer = setTimeout(() => applyFilters({ search: search || undefined }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const clearAll = () => {
        setSearch('');
        router.get(
            INDEX_URL,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

    const changeView = (next) => {
        setView(next);
        try {
            localStorage.setItem('tp-admin-youtube-view', next);
        } catch {
            /* storage unavailable: ignore */
        }
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        setDeleting(true);
        router.delete(`${INDEX_URL}/${confirmDelete.slug}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
            onError: (errors) => console.error('Delete failed:', errors),
            onFinish: () => setDeleting(false),
        });
    };

    const activeCategory = categories.find((c) => String(c.id) === String(filters.category));

    return (
        <AdminLayout title="YouTube Videos">
            <Head title="YouTube Videos" />
            <ModalStyles />

            {/* Intro + primary action */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm text-gray-500">
                    Add, publish and feature the videos that appear across TrendPulse.
                </p>
                <Link href={`${INDEX_URL}/create`} className={`${btnPrimary} w-full sm:w-auto`}>
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                    Add video
                </Link>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <StatCard icon={Film} label="Total videos" value={number(stats.total)} />
                <StatCard icon={CheckCircle2} label="Published" value={number(stats.published)} tone="success" />
                <StatCard icon={FileClock} label="Drafts" value={number(stats.draft)} />
                <StatCard icon={Eye} label="Total views" value={number(stats.totalViews)} tone="brand" />
            </div>

            {/* Results card */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Toolbar */}
                <div className="space-y-3 border-b border-gray-200 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <form onSubmit={submitSearch} className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search videos"
                                aria-label="Search videos"
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0A599E] focus:outline-none focus:ring-2 focus:ring-[#0A599E]/20 [&::-webkit-search-cancel-button]:hidden"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    aria-label="Clear search"
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${focusRing}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </form>

                        <select
                            value={filters.category || ''}
                            onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                            aria-label="Filter by category"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#0A599E] focus:outline-none focus:ring-2 focus:ring-[#0A599E]/20 lg:w-52"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center justify-between gap-3 lg:ml-auto">
                            {/* Status segmented control */}
                            <div
                                role="group"
                                aria-label="Filter by status"
                                className="inline-flex rounded-lg bg-gray-100 p-1"
                            >
                                {STATUS_TABS.map((tab) => {
                                    const active = (filters.status || '') === tab.value;
                                    return (
                                        <button
                                            key={tab.value || 'all'}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => applyFilters({ status: tab.value || undefined })}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                                                active
                                                    ? 'bg-white text-[#0A599E] shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* View toggle */}
                            <div role="group" aria-label="Change layout" className="inline-flex rounded-lg border border-gray-300 p-0.5">
                                <ViewButton
                                    active={view === 'list'}
                                    label="List view"
                                    onClick={() => changeView('list')}
                                    icon={List}
                                />
                                <ViewButton
                                    active={view === 'grid'}
                                    label="Grid view"
                                    onClick={() => changeView('grid')}
                                    icon={LayoutGrid}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active filters + result count */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <p className="text-gray-500" aria-live="polite">
                            <span className="font-semibold text-gray-700">{number(total)}</span>{' '}
                            {total === 1 ? 'video' : 'videos'}
                            {hasFilters && ' match your filters'}
                        </p>

                        {filters.search && (
                            <FilterChip
                                label={`Search: ${filters.search}`}
                                onRemove={() => {
                                    setSearch('');
                                    applyFilters({ search: undefined });
                                }}
                            />
                        )}
                        {activeCategory && (
                            <FilterChip
                                label={`Category: ${activeCategory.name}`}
                                onRemove={() => applyFilters({ category: undefined })}
                            />
                        )}
                        {filters.status && (
                            <FilterChip
                                label={`Status: ${
                                    STATUS_TABS.find((t) => t.value === filters.status)?.label ?? filters.status
                                }`}
                                onRemove={() => applyFilters({ status: undefined })}
                            />
                        )}
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className={`rounded px-1 text-sm font-medium text-[#0A599E] hover:underline ${focusRing}`}
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div
                    className={`transition-opacity motion-reduce:transition-none ${
                        loading ? 'pointer-events-none opacity-60' : 'opacity-100'
                    }`}
                    aria-busy={loading}
                >
                    {rows.length === 0 ? (
                        <EmptyState hasFilters={hasFilters} onClear={clearAll} />
                    ) : view === 'grid' ? (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4">
                            {rows.map((video) => (
                                <VideoCard key={video.id} video={video} onDelete={setConfirmDelete} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Mobile list */}
                            <ul className="divide-y divide-gray-100 md:hidden">
                                {rows.map((video) => (
                                    <li key={video.id} className="flex items-start gap-3 p-4">
                                        <Thumbnail video={video} className="h-16 w-28" />
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                {video.title}
                                            </p>
                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                                                <StatusBadge published={video.is_published} />
                                                <span>{number(video.views)} views</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 -ml-2">
                                                <VideoActions video={video} onDelete={setConfirmDelete} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b border-gray-200">
                                            <Th>Video</Th>
                                            <Th className="hidden lg:table-cell">Category</Th>
                                            <Th>Views</Th>
                                            <Th>Status</Th>
                                            <Th className="hidden xl:table-cell">Published</Th>
                                            <Th className="text-right">Actions</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rows.map((video) => (
                                            <tr
                                                key={video.id}
                                                className="transition-colors hover:bg-gray-50/70 motion-reduce:transition-none"
                                            >
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Thumbnail video={video} className="h-12 w-20" />
                                                        <span className="line-clamp-2 max-w-xs text-sm font-semibold text-gray-900">
                                                            {video.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="hidden px-5 py-3 text-sm text-gray-600 lg:table-cell">
                                                    {video.category || '—'}
                                                </td>
                                                <td className="px-5 py-3 text-sm tabular-nums text-gray-600">
                                                    {number(video.views)}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <StatusBadge published={video.is_published} />
                                                </td>
                                                <td className="hidden px-5 py-3 text-sm text-gray-500 xl:table-cell">
                                                    {video.published_at || '—'}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <VideoActions video={video} onDelete={setConfirmDelete} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {videos.links?.length > 3 && (
                <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-center gap-1">
                    {videos.links.map((link, index) => {
                        const classes = `min-w-9 rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing}`;

                        if (!link.url) {
                            return (
                                <span key={index} className={`${classes} cursor-not-allowed text-gray-300`}>
                                    {pageLabel(link.label)}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                aria-current={link.active ? 'page' : undefined}
                                className={`${classes} ${
                                    link.active
                                        ? 'bg-[#0A599E] text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {pageLabel(link.label)}
                            </Link>
                        );
                    })}
                </nav>
            )}

            <DeleteModal
                video={confirmDelete}
                deleting={deleting}
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  VIDEO PIECES                                                             */
/* ======================================================================== */

function Thumbnail({ video, className = '' }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className={`relative shrink-0 overflow-hidden rounded-lg bg-gray-100 ${className}`}>
            {video.thumbnail_url && !failed ? (
                <img
                    src={video.thumbnail_url}
                    alt=""
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <ImageOff className="h-5 w-5" strokeWidth={1.75} />
                </div>
            )}
            {video.is_featured && (
                <span
                    className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/75"
                    title="Featured"
                >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="sr-only">Featured</span>
                </span>
            )}
        </div>
    );
}

function VideoCard({ video, onDelete }) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md motion-reduce:transition-none">
            <div className="relative">
                <Thumbnail video={video} className="aspect-video w-full !rounded-none" />
                <div className="absolute right-2 top-2">
                    <StatusBadge published={video.is_published} />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{video.title}</h3>
                <p className="mt-1.5 text-xs text-gray-500">
                    {video.category || 'Uncategorised'} · {number(video.views)} views
                </p>
                {video.published_at && (
                    <p className="mt-0.5 text-xs text-gray-400">Published {video.published_at}</p>
                )}

                <div className="mt-auto flex items-center justify-end gap-1 pt-3 -mr-2">
                    <VideoActions video={video} onDelete={onDelete} />
                </div>
            </div>
        </article>
    );
}

function VideoActions({ video, onDelete }) {
    return (
        <>
            <a
                href={`${INDEX_URL}/${video.slug}`}
                aria-label={`View ${video.title}`}
                title="View"
                className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#0A599E]/10 hover:text-[#0A599E] motion-reduce:transition-none ${focusRing}`}
            >
                <Eye className="h-4 w-4" strokeWidth={2} />
            </a>
            <Link
                href={`${INDEX_URL}/${video.slug}/edit`}
                aria-label={`Edit ${video.title}`}
                title="Edit"
                className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#0A599E]/10 hover:text-[#0A599E] motion-reduce:transition-none ${focusRing}`}
            >
                <Pencil className="h-4 w-4" strokeWidth={2} />
            </Link>
            <button
                type="button"
                onClick={() => onDelete(video)}
                aria-label={`Delete ${video.title}`}
                title="Delete"
                className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 motion-reduce:transition-none ${focusRing}`}
            >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
        </>
    );
}

function StatusBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
            <FileClock className="h-3 w-3" strokeWidth={2.5} />
            Draft
        </span>
    );
}

/* ======================================================================== */
/*  GENERIC PIECES                                                           */
/* ======================================================================== */

function StatCard({ icon: Icon, label, value, tone = 'neutral' }) {
    const tones = {
        neutral: 'bg-gray-100 text-gray-600',
        success: 'bg-emerald-50 text-emerald-600',
        brand: 'bg-[#0A599E]/10 text-[#0A599E]',
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-gray-900">{value}</p>
        </div>
    );
}

function ViewButton({ active, label, onClick, icon: Icon }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            aria-pressed={active}
            className={`rounded-md p-1.5 transition-colors motion-reduce:transition-none ${focusRing} ${
                active ? 'bg-[#0A599E]/10 text-[#0A599E]' : 'text-gray-500 hover:text-gray-900'
            }`}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex max-w-[220px] items-center gap-1 rounded-full bg-[#0A599E]/10 py-0.5 pl-2.5 pr-1 text-xs font-medium text-[#0A599E]">
            <span className="truncate">{label}</span>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove filter ${label}`}
                className={`rounded-full p-0.5 hover:bg-[#0A599E]/20 ${focusRing}`}
            >
                <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
        </span>
    );
}

function Th({ children, className = '' }) {
    return (
        <th scope="col" className={`px-5 py-3 text-xs font-semibold text-gray-500 ${className}`}>
            {children}
        </th>
    );
}

function EmptyState({ hasFilters, onClear }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                <PlayCircle className="h-6 w-6" strokeWidth={1.75} />
            </div>
            {hasFilters ? (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No videos match your filters</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Try a different search or category, or clear the filters to see every video.
                    </p>
                    <button type="button" onClick={onClear} className={`${btnSecondary} mt-5`}>
                        Clear filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No videos yet</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Add your first YouTube video to start building your library.
                    </p>
                    <Link href={`${INDEX_URL}/create`} className={`${btnPrimary} mt-5`}>
                        <Plus className="h-4 w-4" strokeWidth={2.25} />
                        Add video
                    </Link>
                </>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  DELETE MODAL                                                             */
/* ======================================================================== */

function DeleteModal({ video, deleting, onCancel, onConfirm }) {
    if (!video) return null;

    return (
        <Modal onClose={onCancel} labelledBy="delete-video-title">
            <div className="px-6 py-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h2 id="delete-video-title" className="text-base font-semibold text-gray-900">
                            Delete this video?
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            This permanently removes the video and can’t be undone.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Thumbnail video={{ ...video, is_featured: false }} className="h-12 w-20" />
                    <p className="line-clamp-2 text-sm font-medium text-gray-800">{video.title}</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button type="button" onClick={onCancel} className={btnSecondary}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={deleting}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`}
                >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    {deleting ? 'Deleting…' : 'Delete video'}
                </button>
            </div>
        </Modal>
    );
}

function Modal({ children, onClose, labelledBy, maxWidth = 'max-w-md' }) {
    // Keep the latest onClose in a ref so the listener is only attached once.
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const onKeyDown = (e) => e.key === 'Escape' && onCloseRef.current();
        const previousOverflow = document.body.style.overflow;
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
        >
            <div className="yt-backdrop absolute inset-0 bg-gray-900/50" onClick={onClose} />
            <div
                className={`yt-modal-panel relative max-h-[92vh] w-full overflow-y-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 ${maxWidth}`}
            >
                {children}
            </div>
        </div>
    );
}

/* ======================================================================== */
/*  HELPERS                                                                  */
/* ======================================================================== */

function pageLabel(label) {
    return label
        .replace('&laquo;', '«')
        .replace('&raquo;', '»')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function ModalStyles() {
    return (
        <style>{`
            .yt-backdrop { animation: yt-fade-in 150ms ease-out; }
            .yt-modal-panel { animation: yt-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes yt-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes yt-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
                .yt-backdrop, .yt-modal-panel { animation: none; }
            }
        `}</style>
    );
}