import { useState, useEffect, useRef, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Index({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const searchTimeout = useRef(null);
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            router.get(route('admin.categories.index'), { search: search || undefined }, {
                preserveState: true,
                replace: true,
            });
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
            { ...category, is_active: !category.is_active },
            { preserveScroll: true }
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('admin.categories.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const stats = useMemo(() => {
        const all = categories.data ?? [];
        const active = all.filter((c) => c.is_active).length;
        const items = all.reduce(
            (sum, c) =>
                sum +
                (c.youtube_videos_count ?? 0) +
                (c.entertainment_posts_count ?? 0) +
                (c.people_stories_count ?? 0),
            0
        );
        return {
            total: categories.meta?.total ?? categories.total ?? all.length,
            active,
            inactive: all.length - active,
            items,
        };
    }, [categories]);

    const isEmpty = (categories.data ?? []).length === 0;
    const isFiltered = search.trim() !== '';

    return (
        <AdminLayout>
            <Head title="Categories" />
            <CategoryStyles />

            <div className="cat-page mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <div className="cat-header-icon flex h-11 w-11 flex-none items-center justify-center rounded-2xl sm:h-12 sm:w-12">
                            <TagIcon className="h-5.5 w-5.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="cat-header-badge rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                    Content
                                </span>
                            </div>
                            <h1 className="cat-header-title mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                Categories
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                                Organize videos, entertainment posts, and people stories into browsable collections.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="cat-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 sm:w-auto sm:py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A599E]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[#0A599E]/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <PlusIcon className="h-4 w-4" />
                        New Category
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={<GridIcon className="h-4 w-4" />}
                        label="Total Categories"
                        value={stats.total}
                        variant="default"
                    />
                    <StatCard
                        icon={<CheckCircleIcon className="h-4 w-4" />}
                        label="Active"
                        value={stats.active}
                        variant="success"
                        proportion={stats.total ? stats.active / stats.total : 0}
                    />
                    <StatCard
                        icon={<PauseCircleIcon className="h-4 w-4" />}
                        label="Inactive"
                        value={stats.inactive}
                        variant="muted"
                        proportion={stats.total ? stats.inactive / stats.total : 0}
                    />
                    <StatCard
                        icon={<BookmarkIcon className="h-4 w-4" />}
                        label="Items Tagged"
                        value={stats.items}
                        variant="accent"
                    />
                </div>

                {/* Toolbar */}
                <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="cat-search-input w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm backdrop-blur-sm placeholder:text-slate-400 transition-all duration-200 focus:border-[#0A599E] focus:bg-white focus:shadow-md focus:shadow-indigo-500/5 focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Clear search"
                            >
                                <XIcon className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    {!isEmpty && (
                        <span className="hidden text-[13px] font-medium text-slate-400 sm:flex sm:items-center sm:gap-1.5">
                            <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                            Showing <strong className="font-semibold text-slate-600">{categories.data.length}</strong> of {stats.total}
                        </span>
                    )}
                </div>

                {/* Table Container */}
                <div className="cat-table-shell mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
                    {isEmpty ? (
                        <EmptyState isFiltered={isFiltered} search={search} onCreate={openCreateModal} onClear={() => setSearch('')} />
                    ) : (
                        <><div className="sm:hidden divide-y divide-slate-100">
                                {categories.data.map((category) => (
                                    <div key={category.id} className="p-4 active:bg-slate-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <CategoryAvatar name={category.name} />
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-bold text-slate-900">{category.name}</div>
                                                    {category.description && (
                                                        <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{category.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => toggleActive(category)}
                                                className={`inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${category.is_active
                                                        ? 'bg-[#0A599E]/10 text-[#0A599E]'
                                                        : 'bg-slate-100 text-slate-500'}`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${category.is_active ? 'bg-[#0A599E]' : 'bg-slate-400'}`} />
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <div className="rounded-xl bg-slate-50 p-2.5">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slug</div>
                                                <code className="mt-1 block truncate text-[11px] font-medium text-slate-700">{category.slug}</code>
                                            </div>
                                            <div className="rounded-xl bg-slate-50 p-2.5">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Usage</div>
                                                <div className="mt-1 text-xs font-semibold text-slate-700">
                                                    {(category.youtube_videos_count ?? 0) + (category.entertainment_posts_count ?? 0) + (category.people_stories_count ?? 0)} items
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-end gap-2">
                                            <button type="button" onClick={() => openEditModal(category)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#0A599E]/30 hover:bg-[#0A599E]/5 hover:text-[#0A599E]">
                                                <EditIcon className="h-3.5 w-3.5" /> Edit
                                            </button>
                                            <button type="button" onClick={() => setDeleteTarget(category)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                                                <TrashIcon className="h-3.5 w-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div><div className="hidden overflow-x-auto sm:block">
                                    <table className="min-w-[760px] w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                                <Th>Category</Th>
                                                <Th>Usage</Th>
                                                <Th>Status</Th>
                                                <Th className="text-right">Actions</Th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {categories.data.map((category) => (
                                                <tr key={category.id} className="cat-row group transition-colors duration-150 hover:bg-[#0A599E]/5/40">
                                                    <td className="px-3 py-3.5 sm:px-5 sm:py-4">
                                                        <div className="flex items-center gap-3.5">
                                                            <CategoryAvatar name={category.name} />
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-semibold text-slate-800">
                                                                    {category.name}
                                                                </div>
                                                                {category.description && (
                                                                    <div className="mt-0.5 max-w-[260px] truncate text-xs leading-relaxed text-slate-400">
                                                                        {category.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3.5 sm:px-5 sm:py-4">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <UsageBadge label="Videos" count={category.youtube_videos_count} color="indigo" />
                                                            <UsageBadge label="Posts" count={category.entertainment_posts_count} color="violet" />
                                                            <UsageBadge label="Stories" count={category.people_stories_count} color="amber" />
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3.5 sm:px-5 sm:py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleActive(category)}
                                                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${category.is_active
                                                                    ? 'bg-[#0A599E]/10 text-[#0A599E] ring-1 ring-emerald-200/60 hover:bg-emerald-100'
                                                                    : 'bg-slate-50 text-slate-500 ring-1 ring-slate-200/60 hover:bg-slate-100'}`}
                                                        >
                                                            <span className={`h-1.5 w-1.5 rounded-full ${category.is_active ? 'bg-[#0A599E]/100' : 'bg-slate-400'}`} />
                                                            {category.is_active ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </td>
                                                    <td className="px-3 py-3.5 sm:px-5 sm:py-4">
                                                        <div className="flex justify-start gap-1.5 sm:justify-end sm:opacity-0 sm:transition-all sm:duration-200 sm:group-hover:opacity-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal(category)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:bg-[#0A599E]/5 hover:text-[#0A599E]"
                                                            >
                                                                <EditIcon className="h-3.5 w-3.5" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget(category)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                <TrashIcon className="h-3.5 w-3.5" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div></>
                    )}
                </div>

                {/* Pagination */}
                {categories.links?.length > 3 && (
                    <div className="mt-5 flex flex-wrap items-center gap-1.5">
                        {categories.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                                    link.active
                                        ? 'cat-page-active text-white shadow-md shadow-indigo-500/25'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        : 'cursor-not-allowed text-slate-300'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CategoryModal open={modalOpen} onClose={closeModal} category={editingCategory} />
            <ConfirmDeleteModal category={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  EMPTY STATE                                                              */
/* ======================================================================== */

function EmptyState({ isFiltered, search, onCreate, onClear }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="cat-empty-icon flex h-16 w-16 items-center justify-center rounded-2xl">
                <TagIcon className="h-7 w-7" />
            </div>
            {isFiltered ? (
                <>
                    <h3 className="mt-5 text-base font-semibold text-slate-800">No results for “{search}”</h3>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
                        Try adjusting your search terms or clear the filter to see all categories.
                    </p>
                    <button
                        type="button"
                        onClick={onClear}
                        className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:border-slate-300"
                    >
                        Clear search
                    </button>
                </>
            ) : (
                <>
                    <h3 className="mt-5 text-base font-semibold text-slate-800">No categories yet</h3>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
                        Create your first category to start organizing your video, post, and story content.
                    </p>
                    <button
                        type="button"
                        onClick={onCreate}
                        className="cat-btn-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A599E]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[#0A599E]/30"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Create your first category
                    </button>
                </>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  CREATE / EDIT MODAL                                                       */
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
        const onSuccess = () => { onClose(); reset(); };
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
                <div className="flex items-center gap-3.5 border-b border-slate-100 px-6 py-5">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#0A599E]/10 ring-1 ring-[#0A599E]/15">
                        <TagIcon className="h-4.5 w-4.5 text-[#0A599E]" />
                    </div>
                    <div>
                        <h2 id="category-modal-title" className="text-base font-semibold text-slate-900">
                            {isEditing ? 'Edit Category' : 'New Category'}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            {isEditing ? `Updating “${category.name}”` : 'Add a new category to tag content'}
                        </p>
                    </div>
                </div>

                <div className="space-y-5 px-6 py-6">
                    <Field label="Name" error={errors.name} htmlFor="name">
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className={inputClass(errors.name)}
                            placeholder="e.g. Music Videos"
                            autoFocus
                        />
                    </Field>

                    <Field label="Slug" error={errors.slug} htmlFor="slug" hint="Auto-generated from the name. Used in URLs.">
                        <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-indigo-500/5 focus-within:ring-1 focus-within:ring-indigo-400">
                            <span className="flex select-none items-center border-r border-slate-200 bg-slate-100/80 px-3.5 font-mono text-[11px] font-medium tracking-wide text-slate-400">
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
                                className="w-full border-0 bg-transparent px-3.5 py-2.5 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                placeholder="music-videos"
                            />
                        </div>
                        {errors.slug && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.slug}</p>}
                    </Field>

                    <Field label="Description" error={errors.description} htmlFor="description">
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={inputClass(errors.description)}
                            placeholder="Optional short description for editors"
                        />
                    </Field>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 transition-all duration-150 hover:bg-slate-50 hover:border-slate-300">
                        <div>
                            <span className="block text-sm font-semibold text-slate-700">Active</span>
                            <span className="mt-0.5 block text-xs text-slate-400">Visible for tagging new content</span>
                        </div>
                        <Toggle checked={data.is_active} onChange={(v) => setData('is_active', v)} />
                    </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-white hover:border-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="cat-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A599E]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[#0A599E]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                        {processing && <Spinner />}
                        {processing ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* ======================================================================== */
/*  DELETE CONFIRMATION MODAL                                                */
/* ======================================================================== */

function ConfirmDeleteModal({ category, onCancel, onConfirm }) {
    if (!category) return null;

    const usage = [
        { label: 'Videos', count: category.youtube_videos_count ?? 0 },
        { label: 'Posts', count: category.entertainment_posts_count ?? 0 },
        { label: 'Stories', count: category.people_stories_count ?? 0 },
    ].filter((u) => u.count > 0);

    return (
        <Modal onClose={onCancel} labelledBy="delete-modal-title" maxWidth="max-w-sm">
            <div className="px-6 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
                    <TrashIcon className="h-5 w-5 text-red-500" />
                </div>
                <h2 id="delete-modal-title" className="mt-4 text-base font-semibold text-slate-900">
                    Delete “{category.name}”?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    This action cannot be undone. The category will be permanently removed.
                </p>

                {usage.length > 0 && (
                    <div className="mt-4 rounded-xl border border-amber-200/80 bg-[#0A599E]/10/80 px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                            <WarningIcon className="h-3.5 w-3.5" />
                            Attached to existing content
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {usage.map((u) => (
                                <span
                                    key={u.label}
                                    className="rounded-lg bg-white/80 px-2 py-0.5 text-xs font-medium text-[#0A599E] ring-1 ring-inset ring-amber-200/60"
                                >
                                    {u.label}: {u.count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-white hover:border-slate-300"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30"
                >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>
        </Modal>
    );
}

/* ======================================================================== */
/*  MODAL SHELL                                                              */
/* ======================================================================== */

function Modal({ children, onClose, labelledBy, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        const onKeyDown = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
            <div className="cat-backdrop absolute inset-0" onClick={onClose} />
            <div className={`cat-modal-panel relative max-h-[92vh] w-full overflow-y-auto ${maxWidth} rounded-2xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/[0.04]`}>
                {children}
            </div>
        </div>
    );
}

/* ======================================================================== */
/*  PRESENTATIONAL HELPERS                                                   */
/* ======================================================================== */

function StatCard({ icon, label, value, variant = 'default', proportion }) {
    const variants = {
        default:  { iconBg: 'bg-slate-100', iconColor: 'text-slate-600', valueColor: 'text-slate-900', barClass: 'bg-[#0A599E]/100' },
        success:  { iconBg: 'bg-[#0A599E]/10', iconColor: 'text-[#0A599E]', valueColor: 'text-[#0A599E]', barClass: 'bg-[#0A599E]/100' },
        muted:    { iconBg: 'bg-slate-50', iconColor: 'text-slate-400', valueColor: 'text-slate-500', barClass: 'bg-[#0A599E]' },
        accent:   { iconBg: 'bg-[#0A599E]/10', iconColor: 'text-[#0A599E]', valueColor: 'text-[#0A599E]', barClass: 'bg-[#0A599E]/100' },
    };
    const v = variants[variant];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/50 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/40 hover:border-slate-300/80">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${v.iconBg} ${v.iconColor} transition-transform duration-200 group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
            <div className={`mt-2 text-xl font-bold sm:text-2xl tabular-nums tracking-tight ${v.valueColor}`}>{value}</div>
            {typeof proportion === 'number' && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${v.barClass}`}
                        style={{ width: `${Math.round(proportion * 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
}

function CategoryAvatar({ name }) {
    const palette = [
        ['#EAF3F9', '#0A599E'],
        ['#EAF3F9', '#0A599E'],
        ['#F1F5F7', '#111827'],
        ['#F1F5F7', '#111827'],
        ['#F1F5F7', '#111827'],
        ['#DCEBF5', '#0A599E'],
    ];
    const hash = [...(name || '?')].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const [bg, fg] = palette[hash % palette.length];
    const initial = (name || '?').trim().charAt(0).toUpperCase();

    return (
        <div
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-xs font-bold shadow-sm"
            style={{ backgroundColor: bg, color: fg }}
        >
            {initial}
        </div>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`cat-toggle relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors duration-200 ${checked ? 'bg-[#0A599E]' : 'bg-slate-200'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
                }`}
            />
        </button>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

function Th({ children, className = '' }) {
    return (
        <th className={`px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 ${className}`}>
            {children}
        </th>
    );
}

function UsageBadge({ label, count = 0, color = 'slate' }) {
    const colors = {
        indigo: 'bg-[#0A599E]/10 text-[#0A599E] ring-1 ring-[#0A599E]/15',
        violet: 'bg-[#0A599E]/10 text-[#0A599E] ring-1 ring-[#0A599E]/15',
        amber:  'bg-[#0A599E]/10 text-[#0A599E] ring-1 ring-[#0A599E]/15',
    };
    const empty = count === 0;
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            empty ? 'text-slate-400' : colors[color]
        }`}
        >
            {label}: {count}
        </span>
    );
}

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
            {children}
            {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
            {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

function inputClass(error) {
    return `cat-input w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 ${
        error ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-slate-200'
    }`;
}

function slugify(value, { keepTyping = false } = {}) {
    let slug = value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
    slug = keepTyping
        ? slug.replace(/\s+/g, '-')
        : slug.replace(/\s+/g, '-').replace(/-+/g, '-');
    return slug;
}

/* ======================================================================== */
/*  SCOPED STYLES                                                            */
/* ======================================================================== */

function CategoryStyles() {
    return (
        <style>{`
            /* ── Design Tokens ── */
            .cat-page {
                --cat-primary: #0A599E;
                --cat-primary-light: #3B82C4;
                --cat-primary-soft: #EAF3F9;
                --cat-primary-dark: #073F70;
                --cat-danger: #DC2626;
                --cat-surface: #FFFFFF;
                --cat-border: #E2E8F0;
            }

            /* ── Header ── */
            .cat-header-icon {
                background: linear-gradient(135deg, var(--cat-primary-soft) 0%, #DCEBF5 100%);
                color: var(--cat-primary);
                box-shadow: 0 4px 12px -2px rgba(10, 89, 158, 0.15);
            }
            .cat-header-badge {
                background: var(--cat-primary-soft);
                color: var(--cat-primary);
            }

            /* ── Buttons ── */
            .cat-btn-primary {
                background: linear-gradient(135deg, #0A599E 0%, #073F70 100%);
            }
            .cat-btn-primary:focus-visible {
                outline: 2px solid var(--cat-primary);
                outline-offset: 2px;
            }

            /* ── Search ── */
            .cat-search-input:focus {
                box-shadow: 0 0 0 3px rgba(10, 89, 158, 0.08);
            }

            /* ── Inputs ── */
            .cat-input:focus {
                outline: none;
                border-color: var(--cat-primary);
                box-shadow: 0 0 0 3px rgba(10, 89, 158, 0.08);
            }

            /* ── Table ── */
            .cat-table-shell {
                transition: box-shadow 200ms ease;
            }
            .cat-table-shell:hover {
                box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
            }

            /* ── Empty State Icon ── */
            .cat-empty-icon {
                background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
                color: #94A3B8;
            }

            /* ── Pagination ── */
            .cat-page-active {
                background: #0A599E;
            }

            /* ── Modal ── */
            .cat-backdrop {
                background: rgba(15, 23, 42, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                animation: cat-fade-in 200ms ease-out;
            }
            .cat-modal-panel {
                animation: cat-modal-in 250ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes cat-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes cat-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* ── Toggle ── */
            .cat-toggle:focus-visible {
                outline: 2px solid var(--cat-primary);
                outline-offset: 2px;
            }

            /* ── Reduced Motion ── */
            @media (prefers-reduced-motion: reduce) {
                .cat-btn-primary, .cat-row, .cat-toggle { transition: none; }
                .cat-backdrop, .cat-modal-panel { animation: none; }
            }
        `}</style>
    );
}

/* ======================================================================== */
/*  ICONS (Heroicons-style, 20x20 viewbox)                                   */
/* ======================================================================== */

function PlusIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
    );
}

function SearchIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M17 17l-4-4" strokeLinecap="round" />
        </svg>
    );
}

function XIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
        </svg>
    );
}

function TagIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M3 3h7.586a1 1 0 01.707.293l6.414 6.414a1 1 0 010 1.414l-6.879 6.879a1 1 0 01-1.414 0L2.999 12.586A1 1 0 012.706 11.9L2.7 5A1.2 1.2 0 014 3z" strokeLinejoin="round" />
            <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

function EditIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function TrashIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M4.5 5.5h11M8.5 5.5V4.5a1 1 0 011-1h1a1 1 0 011 1v1m-5.5 0v10a1 1 0 001 1h6a1 1 0 001-1v-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function GridIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <rect x="3" y="3" width="5.5" height="5.5" rx="1.5" />
            <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5" />
            <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5" />
            <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5" />
        </svg>
    );
}

function CheckCircleIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PauseCircleIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M8 7.5v5M12 7.5v5" strokeLinecap="round" />
        </svg>
    );
}

function BookmarkIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M5 4h10a1 1 0 011 1v11l-6-3-6 3V5a1 1 0 011-1z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function WarningIcon({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M10 4.5L3 16h14L10 4.5z" strokeLinejoin="round" />
            <path d="M10 8.5v3" strokeLinecap="round" />
            <circle cx="10" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
    );
}