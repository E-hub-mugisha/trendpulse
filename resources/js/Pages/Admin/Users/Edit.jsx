// resources/js/Pages/Admin/Users/Edit.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, ShieldCheck, UserRound, Mail, Calendar, MessageCircle, MessagesSquare } from 'lucide-react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout title="Edit User">

            <div className="mx-auto max-w-2xl">

                <Link
                    href="/admin/users"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to users
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            {user.name}
                        </h1>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

                    <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                            <p className="text-xs font-medium">Posts</p>
                        </div>
                        <p className="mt-1 text-xl font-black">{user.community_posts_count}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <MessagesSquare className="h-3.5 w-3.5" strokeWidth={2} />
                            <p className="text-xs font-medium">Comments</p>
                        </div>
                        <p className="mt-1 text-xl font-black">{user.comments_count}</p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                            <p className="text-xs font-medium">Joined</p>
                        </div>
                        <p className="mt-1 text-sm font-bold">{user.created_at}</p>
                    </div>

                </div>

                <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Email
                        </label>
                        <div className="relative mt-2">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="block w-full rounded-xl border-0 bg-gray-100 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        {user.email_verified_at ? (
                            <p className="mt-1.5 text-xs text-green-600">Verified on {user.email_verified_at}</p>
                        ) : (
                            <p className="mt-1.5 text-xs text-gray-400">Not verified</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Role
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() => setData('role', 'user')}
                                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                                    data.role === 'user'
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                <UserRound className="h-4 w-4" strokeWidth={2} />
                                User
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('role', 'admin')}
                                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                                    data.role === 'admin'
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                                Admin
                            </button>

                        </div>
                        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                    </div>

                    <div className="grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/admin/users"
                            className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                        >
                            <Save className="h-4 w-4" strokeWidth={2} />
                            {processing ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}