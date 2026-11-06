// resources/js/Pages/Admin/Users/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Search,
    Pencil,
    Trash2,
    ShieldCheck,
    UserRound,
    Users as UsersIcon,
    UserPlus,
    BadgeCheck,
    X,
    Mail,
    Copy,
    Check,
    Download,
    Loader2,
    AlertTriangle,
    MessageCircle,
    FileText,
} from 'lucide-react';

const INDEX_URL = '/admin/users';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const number = (value) => (value ?? 0).toLocaleString();

/* ======================================================================== */
/*  PAGE                                                                     */
/* ======================================================================== */

export default function Index({ users, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    const rows = users.data ?? [];
    const total = users.total ?? users.meta?.total ?? rows.length;
    const hasFilters = Boolean(filters.search || filters.role);

    const roleTabs = [
        { value: '', label: 'All', count: stats.total },
        { value: 'admin', label: 'Admins', count: stats.admins },
        { value: 'user', label: 'Users', count: Math.max((stats.total ?? 0) - (stats.admins ?? 0), 0) },
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

    const handleDelete = () => {
        if (!confirmDelete) return;
        setDeleting(true);
        router.delete(`${INDEX_URL}/${confirmDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
            onFinish: () => setDeleting(false),
        });
    };

    const verifiedPct = stats.total ? Math.round(((stats.verified ?? 0) / stats.total) * 100) : 0;

    return (
        <AdminLayout title="Users">
            <Head title="Users" />
            <ModalStyles />

            {/* Intro + actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm text-gray-500">
                    See who has an account, what they’ve contributed, and manage their access.
                </p>
                <button
                    type="button"
                    onClick={() => exportCsv(rows)}
                    disabled={rows.length === 0}
                    className={`${btnSecondary} w-full sm:w-auto`}
                >
                    <Download className="h-4 w-4" strokeWidth={2} />
                    Export this page
                </button>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <StatCard icon={UsersIcon} label="Total users" value={number(stats.total)} />
                <StatCard icon={ShieldCheck} label="Admins" value={number(stats.admins)} tone="brand" />
                <StatCard icon={UserPlus} label="New this week" value={`+${number(stats.newThisWeek)}`} tone="success" />
                <StatCard
                    icon={BadgeCheck}
                    label="Verified emails"
                    value={number(stats.verified)}
                    hint={stats.total ? `${verifiedPct}% of users` : undefined}
                />
            </div>

            {/* Results card */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Toolbar */}
                <div className="space-y-3 border-b border-gray-200 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <form onSubmit={submitSearch} className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email"
                                aria-label="Search by name or email"
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

                        <div role="group" aria-label="Filter by role" className="inline-flex self-start rounded-lg bg-gray-100 p-1">
                            {roleTabs.map((tab) => {
                                const active = (filters.role || '') === tab.value;
                                return (
                                    <button
                                        key={tab.value || 'all'}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => applyFilters({ role: tab.value || undefined })}
                                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                                            active
                                                ? 'bg-white text-[#0A599E] shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                        <span className="text-xs tabular-nums text-gray-400">{tab.count ?? 0}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Count + active filters */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <p className="text-gray-500" aria-live="polite">
                            <span className="font-semibold text-gray-700">{number(total)}</span>{' '}
                            {total === 1 ? 'user' : 'users'}
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
                        {filters.role && (
                            <FilterChip
                                label={`Role: ${filters.role === 'admin' ? 'Admin' : 'User'}`}
                                onRemove={() => applyFilters({ role: undefined })}
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
                    ) : (
                        <>
                            {/* Mobile list */}
                            <ul className="divide-y divide-gray-100 md:hidden">
                                {rows.map((user) => (
                                    <li key={user.id} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar name={user.name} admin={user.role === 'admin'} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {user.name}
                                                        {user.is_self && (
                                                            <span className="ml-1.5 text-xs font-normal text-gray-500">(you)</span>
                                                        )}
                                                    </p>
                                                    <RoleBadge role={user.role} />
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                                    <Activity user={user} />
                                                    <span>Joined {user.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-end gap-1">
                                            <UserActions user={user} onDelete={setConfirmDelete} />
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b border-gray-200">
                                            <Th>User</Th>
                                            <Th>Role</Th>
                                            <Th>Activity</Th>
                                            <Th className="hidden lg:table-cell">Joined</Th>
                                            <Th className="text-right">Actions</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rows.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-gray-50/70 motion-reduce:transition-none"
                                            >
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar name={user.name} admin={user.role === 'admin'} />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                                {user.name}
                                                                {user.is_self && (
                                                                    <span className="ml-1.5 text-xs font-normal text-gray-500">
                                                                        (you)
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                                                                <Mail className="h-3 w-3 shrink-0" strokeWidth={2} />
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                                                        <Activity user={user} />
                                                    </div>
                                                </td>
                                                <td className="hidden px-5 py-3 text-sm text-gray-500 lg:table-cell">
                                                    {user.created_at}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <UserActions user={user} onDelete={setConfirmDelete} />
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
            {users.links?.length > 3 && (
                <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-center gap-1">
                    {users.links.map((link, index) => {
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

            {confirmDelete && (
                <DeleteModal
                    key={confirmDelete.id}
                    user={confirmDelete}
                    deleting={deleting}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  ROW PIECES                                                               */
/* ======================================================================== */

function UserActions({ user, onDelete }) {
    return (
        <>
            <CopyButton value={user.email} label={`Copy email for ${user.name}`} />

            <Link
                href={`${INDEX_URL}/${user.id}/edit`}
                aria-label={`Edit ${user.name}`}
                title="Edit"
                className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#0A599E]/10 hover:text-[#0A599E] motion-reduce:transition-none ${focusRing}`}
            >
                <Pencil className="h-4 w-4" strokeWidth={2} />
            </Link>

            <button
                type="button"
                onClick={() => onDelete(user)}
                disabled={user.is_self}
                aria-label={user.is_self ? 'You can’t delete your own account' : `Delete ${user.name}`}
                title={user.is_self ? 'You can’t delete your own account' : 'Delete'}
                className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none ${focusRing}`}
            >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
        </>
    );
}

function Activity({ user }) {
    return (
        <>
            <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                <span className="tabular-nums">{number(user.community_posts_count)}</span> posts
            </span>
            <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                <span className="tabular-nums">{number(user.comments_count)}</span> comments
            </span>
        </>
    );
}

function RoleBadge({ role }) {
    return role === 'admin' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#0A599E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0A599E] ring-1 ring-inset ring-[#0A599E]/20">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
            Admin
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
            <UserRound className="h-3 w-3" strokeWidth={2.5} />
            User
        </span>
    );
}

function Avatar({ name, admin = false }) {
    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                admin ? 'bg-[#0A599E] text-white' : 'bg-gray-100 text-gray-600'
            }`}
            aria-hidden="true"
        >
            {name?.trim().charAt(0).toUpperCase() || '?'}
        </div>
    );
}

function CopyButton({ value, label }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard unavailable (e.g. insecure context): ignore */
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Email copied' : label}
            title={copied ? 'Copied' : 'Copy email'}
            className={`rounded-lg p-2 transition-colors motion-reduce:transition-none ${focusRing} ${
                copied ? 'text-emerald-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
        </button>
    );
}

/* ======================================================================== */
/*  GENERIC PIECES                                                           */
/* ======================================================================== */

function StatCard({ icon: Icon, label, value, hint, tone = 'neutral' }) {
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
            {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
        </div>
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
                <UsersIcon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            {hasFilters ? (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No users match your filters</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Try a different name or email, or clear the filters to see everyone.
                    </p>
                    <button type="button" onClick={onClear} className={`${btnSecondary} mt-5`}>
                        Clear filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No users yet</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">Accounts will appear here as people sign up.</p>
                </>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  DELETE MODAL                                                             */
/* ======================================================================== */

function DeleteModal({ user, deleting, onCancel, onConfirm }) {
    const [understood, setUnderstood] = useState(false);

    // Keep the latest onCancel in a ref so the listener is only attached once.
    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    useEffect(() => {
        const onKeyDown = (e) => e.key === 'Escape' && onCancelRef.current();
        const previousOverflow = document.body.style.overflow;
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const posts = user.community_posts_count ?? 0;
    const comments = user.comments_count ?? 0;
    const isAdmin = user.role === 'admin';

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
        >
            <div className="us-backdrop absolute inset-0 bg-gray-900/50" onClick={onCancel} />
            <div className="us-modal-panel relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                <div className="px-6 py-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-50 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 id="delete-user-title" className="text-base font-semibold text-gray-900">
                                Delete {user.name}?
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500">
                                This permanently removes the account and everything they’ve posted. This can’t be undone.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <Avatar name={user.name} admin={isAdmin} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                        <RoleBadge role={user.role} />
                    </div>

                    {(posts > 0 || comments > 0 || isAdmin) && (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            {isAdmin && <p className="font-semibold">This user is an administrator.</p>}
                            {(posts > 0 || comments > 0) && (
                                <p className={isAdmin ? 'mt-1' : ''}>
                                    Also deletes {number(posts)} {posts === 1 ? 'post' : 'posts'} and {number(comments)}{' '}
                                    {comments === 1 ? 'comment' : 'comments'}.
                                </p>
                            )}
                        </div>
                    )}

                    <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={understood}
                            onChange={(e) => setUnderstood(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        I understand this can’t be undone
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button type="button" onClick={onCancel} className={btnSecondary}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!understood || deleting}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`}
                    >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        {deleting ? 'Deleting…' : 'Delete user'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ======================================================================== */
/*  HELPERS                                                                  */
/* ======================================================================== */

/** Downloads the users currently on screen as a CSV file. */
function exportCsv(rows) {
    if (!rows.length) return;

    // Prefix risky leading characters so spreadsheets don't run cells as formulas.
    const cell = (value) => {
        let text = String(value ?? '');
        if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
        return `"${text.replace(/"/g, '""')}"`;
    };

    const header = ['Name', 'Email', 'Role', 'Posts', 'Comments', 'Joined'];
    const lines = rows.map((u) =>
        [u.name, u.email, u.role, u.community_posts_count ?? 0, u.comments_count ?? 0, u.created_at]
            .map(cell)
            .join(',')
    );

    const csv = `\uFEFF${[header.map(cell).join(','), ...lines].join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));

    const link = document.createElement('a');
    link.href = url;
    link.download = `trendpulse-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            .us-backdrop { animation: us-fade-in 150ms ease-out; }
            .us-modal-panel { animation: us-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes us-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes us-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
                .us-backdrop, .us-modal-panel { animation: none; }
            }
        `}</style>
    );
}