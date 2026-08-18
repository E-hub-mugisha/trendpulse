// resources/js/Pages/Admin/Users/Index.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Pencil,
    Trash2,
    ShieldCheck,
    UserRound,
    CheckCircle2,
    Users as UsersIcon,
    X,
    Mail,
} from 'lucide-react';

function RoleBadge({ role }) {
    return role === 'admin' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-bold text-white">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
            Admin
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
            <UserRound className="h-3 w-3" strokeWidth={2.5} />
            User
        </span>
    );
}

export default function Index({ users, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const applyFilters = (next) => {
        router.get('/admin/users', { ...filters, ...next }, {
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
        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
        });
    };

    return (
        <AdminLayout title="Users">

            <div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-red-600">
                        COMMUNITY
                    </p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight">
                        Users
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
                        <p className="text-xs font-medium text-gray-400">Total Users</p>
                        <p className="mt-1 text-2xl font-black">{stats.total}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Admins</p>
                        <p className="mt-1 text-2xl font-black">{stats.admins}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">New This Week</p>
                        <p className="mt-1 text-2xl font-black text-green-600">+{stats.newThisWeek}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-xs font-medium text-gray-400">Verified Emails</p>
                        <p className="mt-1 text-2xl font-black">{stats.verified}</p>
                    </div>

                </div>

                <div className="mb-5 flex flex-wrap items-center gap-3">

                    <form onSubmit={submitSearch} className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
                        <Search className="h-4 w-4 text-gray-400" strokeWidth={2} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                        />
                    </form>

                    <select
                        value={filters.role || ''}
                        onChange={(e) => applyFilters({ role: e.target.value || undefined })}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    {(filters.search || filters.role) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/users', {}, { preserveState: true, preserveScroll: true });
                            }}
                            className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-black"
                        >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                            Clear
                        </button>
                    )}

                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">

                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <UsersIcon className="h-10 w-10 text-gray-200" strokeWidth={1.5} />
                            <p className="mt-3 text-sm font-bold text-gray-500">No users found</p>
                            <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">User</th>
                                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Role</th>
                                    <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 md:table-cell">Activity</th>
                                    <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 lg:table-cell">Joined</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40">

                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-gray-800">
                                                        {user.name}
                                                        {user.is_self && (
                                                            <span className="ml-1.5 text-xs font-normal text-gray-400">(you)</span>
                                                        )}
                                                    </p>
                                                    <p className="flex items-center gap-1 truncate text-xs text-gray-400">
                                                        <Mail className="h-3 w-3" strokeWidth={2} />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            <RoleBadge role={user.role} />
                                        </td>

                                        <td className="hidden px-5 py-3 text-sm text-gray-500 md:table-cell">
                                            {user.community_posts_count} posts · {user.comments_count} comments
                                        </td>

                                        <td className="hidden px-5 py-3 text-sm text-gray-400 lg:table-cell">
                                            {user.created_at}
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-1">

                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" strokeWidth={2} />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDelete(user)}
                                                    disabled={user.is_self}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30"
                                                    title={user.is_self ? "You can't delete your own account" : 'Delete'}
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

                {users.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {users.links.map((link, index) => (
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
                        <h3 className="text-lg font-black">Delete user?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            "{confirmDelete.name}" and all of their content will be permanently removed. This can't be undone.
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