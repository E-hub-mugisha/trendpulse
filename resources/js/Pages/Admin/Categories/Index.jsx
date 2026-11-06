// resources/js/Pages/Admin/Categories/Index.jsx

import { useState, useEffect, useRef, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    X,
    Tag,
    Pencil,
    Trash2,
    LayoutGrid,
    CheckCircle2,
    PauseCircle,
    Bookmark,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

const BRAND = '#0A599E';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A599E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#084A85] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none ${focusRing}`;

const itemCount = (c) =>
    (c.youtube_videos_count ?? 0) + (c.entertainment_posts_count ?? 0) + (c.people_stories_count ?? 0);

export default function Index({ categories, filters, stats: serverStats }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Debounced server-side search. Skips the request when nothing changed
    // (e.g. on first render), so the page doesn't reload itself on mount.
    const searchTimeout = useRef(null);
    useEffect(() => {
        if (search === (filters?.search ?? '')) return undefined;

        searchTimeout.current = setTimeout(() => {
            router.get(
                route('admin.categories.index'),
                { search: search || undefined },
                { preserveState: true, replace: true }
            );
        }, 350);

        return () => clearTimeout(searchTimeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const openCreateModal = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    const toggleActive = (category) => {
        router.patch(
            route('admin.categories.update', category.id),
            {
                name: category.name,
                slug: category.slug,
                description: category.description,
                is_active: !category.is_active,
            },
            { preserveScroll: true }
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(route('admin.categories.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    const rows = categories.data ?? [];

    // Prefer totals from the server (a `stats` prop). The fallback below only
    // sees the current page, so Active/Inactive can be understated when paginated.
    const stats = useMemo(() => {
        if (serverStats) return serverStats;
        const active = rows.filter((c) => c.is_active).length;
        return {
            total: categories.meta?.total ?? categories.total ?? rows.length,
            active,
            inactive: rows.length - active,
            items: rows.reduce((sum, c) => sum + itemCount(c), 0),
        };
    }, [categories, rows, serverStats]);

    const isEmpty = rows.length === 0;
    const isFiltered = search.trim() !== '';

    return (
        <AdminLayout title="Categories">
            <Head title="Categories" />
            <ModalStyles />

            {/* Intro + primary action */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm text-gray-500">
                    Organize videos, entertainment posts and people stories into collections visitors can browse.
                </p>
                <button type="button" onClick={openCreateModal} className={`${btnPrimary} w-full sm:w-auto`}>
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                    New category
                </button>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard icon={LayoutGrid} label="Total categories" value={stats.total} />
                <StatCard icon={CheckCircle2} label="Active" value={stats.active} tone="success" />
                <StatCard icon={PauseCircle} label="Inactive" value={stats.inactive} />
                <StatCard icon={Bookmark} label="Items tagged" value={stats.items} tone="brand" />
            </div>

            {/* Table card */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories"
                            aria-label="Search categories"
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
                    </div>

                    {!isEmpty && (
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{rows.length}</span> of{' '}
                            {stats.total}
                        </p>
                    )}
                </div>

                {isEmpty ? (
                    <EmptyState
                        isFiltered={isFiltered}
                        search={search}
                        onCreate={openCreateModal}
                        onClear={() => setSearch('')}
                    />
                ) : (
                    <>
                        {/* Mobile list */}
                        <ul className="divide-y divide-gray-100 sm:hidden">
                            {rows.map((category) => (
                                <li key={category.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <CategoryAvatar name={category.name} />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-gray-900">
                                                    {category.name}
                                                </p>
                                                <code className="block truncate text-xs text-gray-500">
                                                    /{category.slug}
                                                </code>
                                            </div>
                                        </div>
                                        <StatusToggle category={category} onToggle={toggleActive} />
                                    </div>

                                    {category.description && (
                                        <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                                            {category.description}
                                        </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        <UsageBadge label="videos" count={category.youtube_videos_count} />
                                        <UsageBadge label="posts" count={category.entertainment_posts_count} />
                                        <UsageBadge label="stories" count={category.people_stories_count} />
                                    </div>

                                    <div className="mt-3 flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(category)}
                                            className={`${btnSecondary} !px-3 !py-1.5 !text-xs`}
                                        >
                                            <Pencil className="h-3.5 w-3.5" /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(category)}
                                            className={`${btnSecondary} !px-3 !py-1.5 !text-xs !text-red-600 hover:!bg-red-50`}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full min-w-[720px] text-left">
                                <thead className="bg-gray-50">
                                    <tr className="border-b border-gray-200">
                                        <Th>Category</Th>
                                        <Th>Usage</Th>
                                        <Th>Status</Th>
                                        <Th className="text-right">Actions</Th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.map((category) => (
                                        <tr key={category.id} className="transition-colors hover:bg-gray-50/70 motion-reduce:transition-none">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <CategoryAvatar name={category.name} />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {category.name}
                                                        </p>
                                                        <p className="mt-0.5 max-w-[280px] truncate text-xs text-gray-500">
                                                            {category.description || `/${category.slug}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    <UsageBadge label="videos" count={category.youtube_videos_count} />
                                                    <UsageBadge label="posts" count={category.entertainment_posts_count} />
                                                    <UsageBadge label="stories" count={category.people_stories_count} />
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusToggle category={category} onToggle={toggleActive} />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex justify-end gap-1">
                                                    <IconButton
                                                        label={`Edit ${category.name}`}
                                                        onClick={() => openEditModal(category)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </IconButton>
                                                    <IconButton
                                                        label={`Delete ${category.name}`}
                                                        danger
                                                        onClick={() => setDeleteTarget(category)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </IconButton>
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

            {/* Pagination */}
            {categories.links?.length > 3 && (
                <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center gap-1">
                    {categories.links.map((link, i) => (
                        <button
                            key={i}
                            type="button"
                            disabled={!link.url}
                            aria-current={link.active ? 'page' : undefined}
                            onClick={() =>
                                link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })
                            }
                            className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                                link.active
                                    ? 'bg-[#0A599E] text-white'
                                    : link.url
                                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    : 'cursor-not-allowed text-gray-300'
                            }`}
                        >
                            {pageLabel(link.label)}
                        </button>
                    ))}
                </nav>
            )}

            <CategoryModal open={modalOpen} onClose={closeModal} category={editingCategory} />
            <ConfirmDeleteModal
                category={deleteTarget}
                deleting={deleting}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  EMPTY STATE                                                              */
/* ======================================================================== */

function EmptyState({ isFiltered, search, onCreate, onClear }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                <Tag className="h-6 w-6" />
            </div>

            {isFiltered ? (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No results for “{search}”</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Check the spelling or clear the search to see all categories.
                    </p>
                    <button type="button" onClick={onClear} className={`${btnSecondary} mt-5`}>
                        Clear search
                    </button>
                </>
            ) : (
                <>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">No categories yet</h3>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                        Create a category to start grouping your videos, posts and stories.
                    </p>
                    <button type="button" onClick={onCreate} className={`${btnPrimary} mt-5`}>
                        <Plus className="h-4 w-4" strokeWidth={2.25} />
                        Create category
                    </button>
                </>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  CREATE / EDIT MODAL                                                      */
/* ======================================================================== */

function CategoryModal({ open, onClose, category }) {
    const isEditing = !!category;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });
    const [slugTouched, setSlugTouched] = useState(false);

    useEffect(() => {
        if (!open) return;
        clearErrors();
        setSlugTouched(isEditing);
        setData({
            name: category?.name ?? '',
            slug: category?.slug ?? '',
            description: category?.description ?? '',
            is_active: category ? !!category.is_active : true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category]);

    const handleNameChange = (value) => {
        setData((prev) => ({
            ...prev,
            name: value,
            slug: slugTouched ? prev.slug : slugify(value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const onSuccess = () => {
            onClose();
            reset();
        };
        if (isEditing) {
            put(route('admin.categories.update', category.id), { preserveScroll: true, onSuccess });
        } else {
            post(route('admin.categories.store'), { preserveScroll: true, onSuccess });
        }
    };

    if (!open) return null;

    return (
        <Modal onClose={onClose} labelledBy="category-modal-title">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[#0A599E]/10 text-[#0A599E]">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 id="category-modal-title" className="text-base font-semibold text-gray-900">
                                {isEditing ? 'Edit category' : 'New category'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {isEditing ? `Updating “${category.name}”` : 'Add a category to tag content with'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className={`rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${focusRing}`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 px-6 py-5">
                    <Field label="Name" error={errors.name} htmlFor="name">
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className={inputClass(errors.name)}
                            placeholder="e.g. Music videos"
                            autoFocus
                        />
                    </Field>

                    <Field
                        label="Slug"
                        error={errors.slug}
                        htmlFor="slug"
                        hint="Generated from the name. Used in the category URL."
                    >
                        <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-[#0A599E] focus-within:ring-2 focus-within:ring-[#0A599E]/20">
                            <span className="flex select-none items-center border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                                /category/
                            </span>
                            <input
                                id="slug"
                                type="text"
                                value={data.slug}
                                onChange={(e) => {
                                    setSlugTouched(true);
                                    setData('slug', slugify(e.target.value, { keepTyping: true }));
                                }}
                                className="w-full border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                placeholder="music-videos"
                            />
                        </div>
                    </Field>

                    <Field label="Description" error={errors.description} htmlFor="description" hint="Optional. Only editors see this.">
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description ?? ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className={inputClass(errors.description)}
                            placeholder="What belongs in this category?"
                        />
                    </Field>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                        <div>
                            <p id="active-label" className="text-sm font-semibold text-gray-900">
                                Active
                            </p>
                            <p className="text-xs text-gray-500">Available when tagging new content</p>
                        </div>
                        <Toggle
                            checked={data.is_active}
                            onChange={(v) => setData('is_active', v)}
                            labelledBy="active-label"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button type="button" onClick={onClose} className={btnSecondary}>
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className={btnPrimary}>
                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {processing ? 'Saving…' : isEditing ? 'Save changes' : 'Create category'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* ======================================================================== */
/*  DELETE CONFIRMATION MODAL                                                */
/* ======================================================================== */

function ConfirmDeleteModal({ category, deleting, onCancel, onConfirm }) {
    if (!category) return null;

    const usage = [
        { label: 'Videos', count: category.youtube_videos_count ?? 0 },
        { label: 'Posts', count: category.entertainment_posts_count ?? 0 },
        { label: 'Stories', count: category.people_stories_count ?? 0 },
    ].filter((u) => u.count > 0);

    return (
        <Modal onClose={onCancel} labelledBy="delete-modal-title" maxWidth="max-w-sm">
            <div className="px-6 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Trash2 className="h-5 w-5" />
                </div>
                <h2 id="delete-modal-title" className="mt-4 text-base font-semibold text-gray-900">
                    Delete “{category.name}”?
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">
                    This permanently removes the category and can’t be undone.
                </p>

                {usage.length > 0 && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Used by existing content
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {usage.map((u) => (
                                <span
                                    key={u.label}
                                    className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200"
                                >
                                    {u.label}: {u.count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
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
                    {deleting ? 'Deleting…' : 'Delete category'}
                </button>
            </div>
        </Modal>
    );
}

/* ======================================================================== */
/*  MODAL SHELL                                                              */
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
            <div className="cat-backdrop absolute inset-0 bg-gray-900/50" onClick={onClose} />
            <div
                className={`cat-modal-panel relative max-h-[92vh] w-full overflow-y-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 ${maxWidth}`}
            >
                {children}
            </div>
        </div>
    );
}

/* ======================================================================== */
/*  PRESENTATIONAL HELPERS                                                   */
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

function CategoryAvatar({ name }) {
    return (
        <div
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-sm font-bold"
            style={{ backgroundColor: `${BRAND}1A`, color: BRAND }}
            aria-hidden="true"
        >
            {(name || '?').trim().charAt(0).toUpperCase()}
        </div>
    );
}

function StatusToggle({ category, onToggle }) {
    return (
        <div className="flex items-center gap-2.5">
            <Toggle
                checked={!!category.is_active}
                onChange={() => onToggle(category)}
                label={`${category.is_active ? 'Deactivate' : 'Activate'} ${category.name}`}
            />
            <span className={`text-xs font-medium ${category.is_active ? 'text-emerald-700' : 'text-gray-500'}`}>
                {category.is_active ? 'Active' : 'Inactive'}
            </span>
        </div>
    );
}

function Toggle({ checked, onChange, label, labelledBy }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            aria-labelledby={labelledBy}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors motion-reduce:transition-none ${focusRing} ${
                checked ? 'bg-[#0A599E]' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${
                    checked ? 'translate-x-[24px]' : 'translate-x-[4px]'
                }`}
            />
        </button>
    );
}

function IconButton({ label, onClick, danger = false, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={`rounded-lg p-2 text-gray-500 transition-colors motion-reduce:transition-none ${focusRing} ${
                danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-[#0A599E]/10 hover:text-[#0A599E]'
            }`}
        >
            {children}
        </button>
    );
}

function Th({ children, className = '' }) {
    return (
        <th scope="col" className={`px-5 py-3 text-xs font-semibold text-gray-500 ${className}`}>
            {children}
        </th>
    );
}

function UsageBadge({ label, count = 0 }) {
    const empty = !count;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ${
                empty ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-700'
            }`}
        >
            <span className="font-semibold tabular-nums">{count ?? 0}</span> {label}
        </span>
    );
}

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

function inputClass(error) {
    return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-[#0A599E] focus:ring-[#0A599E]/20'
    }`;
}

function pageLabel(label) {
    return label
        .replace('&laquo;', '«')
        .replace('&raquo;', '»')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function slugify(value, { keepTyping = false } = {}) {
    let slug = value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
    slug = keepTyping ? slug.replace(/\s+/g, '-') : slug.replace(/\s+/g, '-').replace(/-+/g, '-');
    return slug;
}

/* ======================================================================== */
/*  MODAL ANIMATION (only thing Tailwind can't express out of the box)       */
/* ======================================================================== */

function ModalStyles() {
    return (
        <style>{`
            .cat-backdrop { animation: cat-fade-in 150ms ease-out; }
            .cat-modal-panel { animation: cat-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes cat-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes cat-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
                .cat-backdrop, .cat-modal-panel { animation: none; }
            }
        `}</style>
    );
}