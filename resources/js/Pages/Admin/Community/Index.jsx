// resources/js/Pages/Admin/Community/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
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
    Inbox,
    Loader2,
    AlertTriangle,
    ChevronRight,
} from 'lucide-react';

const INDEX_URL = '/admin/community';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none ${focusRing}`;

const STATUS = {
    published: {
        label: 'Published',
        icon: CheckCircle2,
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    },
    pending: {
        label: 'Pending',
        icon: Clock,
        badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
    flagged: {
        label: 'Flagged',
        icon: Flag,
        badge: 'bg-red-50 text-red-700 ring-red-200',
    },
};

/** True at Tailwind's `lg` breakpoint and above. */
function useIsDesktop() {
    const query = '(min-width: 1024px)';
    const [matches, setMatches] = useState(() =>
        typeof window === 'undefined' ? true : window.matchMedia(query).matches
    );

    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    return matches;
}

/* ======================================================================== */
/*  PAGE                                                                     */
/* ======================================================================== */

export default function Index({ posts, filters = {}, stats = {} }) {
    const isDesktop = useIsDesktop();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedId, setSelectedId] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const rows = posts.data ?? [];
    const selected = rows.find((p) => p.id === selectedId) ?? (isDesktop ? rows[0] : undefined);
    const hasFilters = Boolean(filters.search || filters.status);

    const tabs = [
        { value: '', label: 'All', count: stats.total },
        { value: 'pending', label: 'Pending review', count: stats.pending, tone: 'amber' },
        { value: 'flagged', label: 'Flagged', count: stats.flagged, tone: 'red' },
        { value: 'published', label: 'Published', count: stats.published },
    ];

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

    /** The post to land on after `post` leaves the list (next one, else previous). */
    const neighbourOf = (post) => {
        const i = rows.findIndex((p) => p.id === post.id);
        return rows[i + 1]?.id ?? rows[i - 1]?.id ?? null;
    };

    const updateStatus = (post, status) => {
        if (!post || post.status === status || updatingId) return;

        // With a status filter active, the post leaves the queue once its status changes.
        const leavesList = Boolean(filters.status) && filters.status !== status;
        const nextId = leavesList ? neighbourOf(post) : post.id;

        setUpdatingId(post.id);
        router.patch(
            `${INDEX_URL}/${post.id}/status`,
            { status },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedId(nextId);
                    if (leavesList) setSheetOpen(false);
                },
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const nextId = neighbourOf(confirmDelete);
        setDeleting(true);
        router.delete(`${INDEX_URL}/${confirmDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmDelete(null);
                setSelectedId(nextId);
                setSheetOpen(false);
            },
            onFinish: () => setDeleting(false),
        });
    };

    const selectPost = (post) => {
        setSelectedId(post.id);
        if (!isDesktop) setSheetOpen(true);
    };

    // Close the mobile sheet if its post is no longer in the list.
    useEffect(() => {
        if (sheetOpen && !rows.some((p) => p.id === selectedId)) setSheetOpen(false);
    }, [rows, selectedId, sheetOpen]);

    // Keyboard shortcuts on desktop: J/K move, A approves, F flags.
    useEffect(() => {
        if (!isDesktop) return undefined;

        const onKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey || confirmDelete) return;
            const el = e.target;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable) return;

            const index = rows.findIndex((p) => p.id === selected?.id);
            const key = e.key.toLowerCase();

            if (key === 'j' || key === 'k') {
                const next = rows[key === 'j' ? Math.min(index + 1, rows.length - 1) : Math.max(index - 1, 0)];
                if (next) {
                    setSelectedId(next.id);
                    document.getElementById(`post-${next.id}`)?.scrollIntoView({ block: 'nearest' });
                }
            } else if (key === 'a') {
                updateStatus(selected, 'published');
            } else if (key === 'f') {
                updateStatus(selected, 'flagged');
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    });

    return (
        <AdminLayout title="Community">
            <Head title="Community" />
            <ModalStyles />

            <p className="max-w-2xl text-sm text-gray-500">
                Review what members post and decide what stays visible.
            </p>

            {/* Status tabs + search */}
            <div className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
                    <div
                        role="group"
                        aria-label="Filter by status"
                        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0"
                    >
                        {tabs.map((tab) => {
                            const active = (filters.status || '') === tab.value;
                            const highlight = tab.count > 0 && tab.tone;
                            return (
                                <button
                                    key={tab.value || 'all'}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => applyFilters({ status: tab.value || undefined })}
                                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                                        active
                                            ? 'bg-[#0A599E]/10 text-[#0A599E]'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                                            highlight && tab.tone === 'red'
                                                ? 'bg-red-100 text-red-700'
                                                : highlight && tab.tone === 'amber'
                                                ? 'bg-amber-100 text-amber-700'
                                                : active
                                                ? 'bg-[#0A599E]/15 text-[#0A599E]'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {tab.count ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={submitSearch} className="relative w-full lg:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search posts or authors"
                            aria-label="Search posts or authors"
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
                </div>
            </div>

            {/* Queue + detail */}
            <div
                className={`mt-5 grid items-start gap-5 transition-opacity motion-reduce:transition-none lg:grid-cols-5 ${
                    loading ? 'pointer-events-none opacity-60' : 'opacity-100'
                }`}
                aria-busy={loading}
            >
                {/* Queue */}
                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                    {rows.length === 0 ? (
                        <EmptyState hasFilters={hasFilters} onClear={clearAll} />
                    ) : (
                        <>
                            <ul className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto">
                                {rows.map((post) => (
                                    <PostRow
                                        key={post.id}
                                        post={post}
                                        active={isDesktop && selected?.id === post.id}
                                        onSelect={() => selectPost(post)}
                                    />
                                ))}
                            </ul>

                            {posts.links?.length > 3 && (
                                <nav
                                    aria-label="Pagination"
                                    className="flex flex-wrap items-center justify-center gap-1 border-t border-gray-200 bg-gray-50 px-3 py-3"
                                >
                                    {posts.links.map((link, index) => {
                                        const classes = `min-w-9 rounded-lg px-3 py-1.5 text-center text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing}`;

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
                                                        : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                                                }`}
                                            >
                                                {pageLabel(link.label)}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            )}
                        </>
                    )}
                </section>

                {/* Detail (desktop) */}
                <section className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-3 lg:block lg:sticky lg:top-24">
                    {selected ? (
                        <PostDetail
                            post={selected}
                            busy={updatingId === selected.id}
                            onStatus={(status) => updateStatus(selected, status)}
                            onDelete={() => setConfirmDelete(selected)}
                            showShortcuts
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                            <Inbox className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
                            <p className="mt-3 text-sm font-medium text-gray-700">Select a post to review it</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Detail (mobile sheet) */}
            {!isDesktop && sheetOpen && selected && (
                <Modal onClose={() => setSheetOpen(false)} labelledBy="post-detail-title" maxWidth="max-w-lg">
                    <PostDetail
                        post={selected}
                        busy={updatingId === selected.id}
                        onStatus={(status) => updateStatus(selected, status)}
                        onDelete={() => setConfirmDelete(selected)}
                        onClose={() => setSheetOpen(false)}
                    />
                </Modal>
            )}

            {/* Delete confirmation */}
            {confirmDelete && (
                <Modal onClose={() => setConfirmDelete(null)} labelledBy="delete-post-title">
                    <div className="px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-50 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 id="delete-post-title" className="text-base font-semibold text-gray-900">
                                    Delete this post?
                                </h2>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    The post and all its comments will be permanently removed. This can’t be undone.
                                </p>
                            </div>
                        </div>

                        <blockquote className="mt-4 line-clamp-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                            <span className="mb-1 block text-xs font-semibold text-gray-500">
                                {confirmDelete.user?.name}
                            </span>
                            {confirmDelete.content}
                        </blockquote>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <button type="button" onClick={() => setConfirmDelete(null)} className={btnSecondary}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`}
                        >
                            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            {deleting ? 'Deleting…' : 'Delete post'}
                        </button>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  QUEUE ROW                                                                */
/* ======================================================================== */

function PostRow({ post, active, onSelect }) {
    return (
        <li>
            <button
                id={`post-${post.id}`}
                type="button"
                onClick={onSelect}
                aria-current={active ? 'true' : undefined}
                className={`relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors motion-reduce:transition-none ${focusRing} focus-visible:ring-inset ${
                    active ? 'bg-[#0A599E]/5' : 'hover:bg-gray-50'
                }`}
            >
                {active && (
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-[#0A599E]" aria-hidden="true" />
                )}

                <Avatar name={post.user?.name} />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">{post.user?.name}</p>
                        <span className="shrink-0 text-xs text-gray-400">{post.created_at}</span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.content}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <StatusBadge status={post.status} />
                        <Counts post={post} />
                        {post.image && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                <span className="sr-only">Image attached</span>
                            </span>
                        )}
                    </div>
                </div>

                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 lg:hidden" aria-hidden="true" />
            </button>
        </li>
    );
}

/* ======================================================================== */
/*  DETAIL PANEL                                                             */
/* ======================================================================== */

function PostDetail({ post, busy, onStatus, onDelete, onClose, showShortcuts = false }) {
    const decisions = [
        {
            status: 'published',
            label: 'Approve',
            icon: CheckCircle2,
            className: 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent',
        },
        {
            status: 'flagged',
            label: 'Flag',
            icon: Flag,
            className: 'bg-white text-red-700 border-red-200 hover:bg-red-50',
        },
        {
            status: 'pending',
            label: 'Mark pending',
            icon: Clock,
            className: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        },
    ];

    return (
        <div>
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={post.user?.name} size="lg" />
                    <div className="min-w-0">
                        <h2 id="post-detail-title" className="truncate text-base font-semibold text-gray-900">
                            {post.user?.name}
                        </h2>
                        <p className="text-xs text-gray-500">{post.created_at}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={post.status} />
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className={`rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${focusRing}`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
                <p className="whitespace-pre-line break-words text-[15px] leading-7 text-gray-800">{post.content}</p>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        <Heart className="h-3.5 w-3.5" />
                        {(post.likes_count ?? 0).toLocaleString()} likes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {(post.comments_count ?? 0).toLocaleString()} comments
                    </span>
                    {post.image && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                            <ImageIcon className="h-3.5 w-3.5" />
                            Image attached
                        </span>
                    )}
                </div>
            </div>

            {/* Decision bar */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                <p className="mb-2.5 text-xs font-semibold text-gray-500">Decision</p>

                <div className="flex flex-wrap gap-2">
                    {decisions.map(({ status, label, icon: Icon, className }) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => onStatus(status)}
                            disabled={post.status === status || busy}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none ${focusRing} ${className}`}
                        >
                            {busy && post.status !== status ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Icon className="h-4 w-4" strokeWidth={2} />
                            )}
                            {label}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`${INDEX_URL}/${post.id}`}
                            className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-[#0A599E] hover:underline ${focusRing}`}
                        >
                            <Eye className="h-4 w-4" />
                            Full details and comments
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={onDelete}
                        className={`inline-flex items-center gap-1.5 rounded px-1 text-sm font-medium text-red-600 hover:text-red-700 hover:underline ${focusRing}`}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete post
                    </button>
                </div>

                {showShortcuts && (
                    <p className="mt-4 text-xs text-gray-400">
                        Shortcuts: <Kbd>J</Kbd> next · <Kbd>K</Kbd> previous · <Kbd>A</Kbd> approve · <Kbd>F</Kbd> flag
                    </p>
                )}
            </div>
        </div>
    );
}

/* ======================================================================== */
/*  PIECES                                                                   */
/* ======================================================================== */

function StatusBadge({ status }) {
    const { icon: Icon, badge, label } = STATUS[status] || STATUS.pending;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badge}`}
        >
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            {label}
        </span>
    );
}

function Avatar({ name, size = 'md' }) {
    const sizes = { md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#0A599E]/10 font-semibold text-[#0A599E] ${sizes[size]}`}
            aria-hidden="true"
        >
            {name?.trim().charAt(0).toUpperCase() || '?'}
        </div>
    );
}

function Counts({ post }) {
    return (
        <>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Heart className="h-3.5 w-3.5" strokeWidth={2} />
                {post.likes_count ?? 0}
                <span className="sr-only">likes</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                {post.comments_count ?? 0}
                <span className="sr-only">comments</span>
            </span>
        </>
    );
}

function Kbd({ children }) {
    return (
        <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
            {children}
        </kbd>
    );
}

function EmptyState({ hasFilters, onClear }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                {hasFilters ? <Search className="h-6 w-6" strokeWidth={1.75} /> : <Inbox className="h-6 w-6" strokeWidth={1.75} />}
            </div>
            {hasFilters ? (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No posts match your filters</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Try a different search, or clear the filters to see every post.
                    </p>
                    <button type="button" onClick={onClear} className={`${btnSecondary} mt-5`}>
                        Clear filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No community posts yet</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        New posts from members will show up here for review.
                    </p>
                </>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  MODAL                                                                    */
/* ======================================================================== */

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
            <div className="cm-backdrop absolute inset-0 bg-gray-900/50" onClick={onClose} />
            <div
                className={`cm-modal-panel relative max-h-[92vh] w-full overflow-y-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 ${maxWidth}`}
            >
                {children}
            </div>
        </div>
    );
}

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
            .cm-backdrop { animation: cm-fade-in 150ms ease-out; }
            .cm-modal-panel { animation: cm-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes cm-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes cm-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
                .cm-backdrop, .cm-modal-panel { animation: none; }
            }
        `}</style>
    );
}