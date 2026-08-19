// resources/js/Layouts/AdminLayout.jsx

import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutGrid,
    PlayCircle,
    Newspaper,
    Users,
    PenSquare,
    MessageCircle,
    UserCircle,
    Search,
    Bell,
    Menu,
    X,
    ArrowLeft,
    ChevronDown,
    LogOut,
    Settings,
} from 'lucide-react';

const MENU = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid, exact: true },
    { label: 'YouTube', href: '/admin/youtube', icon: PlayCircle },
    { label: 'Entertainment', href: '/admin/entertainment', icon: Newspaper },
    { label: 'People', href: '/admin/people', icon: Users },
    { label: 'Community', href: '/admin/community', icon: MessageCircle },
    { label: 'Users', href: '/admin/users', icon: UserCircle },
];

function isActive(currentUrl, href, exact) {
    if (exact) return currentUrl === href;
    return currentUrl.startsWith(href);
}

function SidebarContent({ currentUrl, auth, onNavigate }) {
    return (
        <>
            <div className="border-b border-gray-100 p-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
                    <img
                        src="/assets/images/logo.png"
                        alt="TrendPulse"
                        className="h-8 w-8 shrink-0 object-contain"
                    />
                    <span className="text-2xl font-black tracking-tight">
                        Trend<span style={{ color: '#0A599E' }}>Pulse</span>
                    </span>
                </Link>
                <p className="mt-1 text-xs font-medium text-gray-400">
                    Administration
                </p>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {MENU.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(currentUrl, item.href, item.exact);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                active
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                            }`}
                        >
                            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-100 p-4">

                <div className="mb-3 flex items-center gap-3 px-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                            {auth?.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            Administrator
                        </p>
                    </div>

                </div>

                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-black"
                >
                    <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
                    Back to website
                </Link>

            </div>
        </>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const activeItem = MENU.find((item) => isActive(currentUrl, item.href, item.exact));

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">

            <div className="flex flex-1">

                {/* Desktop sidebar */}
                <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
                    <SidebarContent currentUrl={currentUrl} auth={auth} />
                </aside>

                {/* Mobile sidebar drawer */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <aside className="relative flex h-full w-72 flex-col bg-white">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="absolute right-4 top-5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <SidebarContent
                                currentUrl={currentUrl}
                                auth={auth}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </aside>
                    </div>
                )}

                <div className="flex min-h-screen flex-1 flex-col lg:pl-64">

                    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">

                        <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(true)}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <div>
                                    <p className="text-xs font-medium text-gray-400">
                                        Admin
                                    </p>
                                    <h1 className="text-base font-bold leading-tight sm:text-lg">
                                        {title || activeItem?.label || 'Dashboard'}
                                    </h1>
                                </div>

                            </div>

                            <div className="hidden flex-1 max-w-md items-center gap-2 rounded-full bg-gray-100 px-4 py-2 sm:flex">
                                <Search className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                                />
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <Bell className="h-5 w-5" strokeWidth={2} />
                                    <span
                                        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#0A599E' }}
                                    />
                                </button>

                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={() => setProfileOpen((prev) => !prev)}
                                        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                                            {auth?.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" strokeWidth={2} />
                                    </button>

                                    {profileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setProfileOpen(false)}
                                            />
                                            <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-2xl bg-white py-1.5 shadow-lg ring-1 ring-black/5">

                                                <div className="border-b border-gray-100 px-4 py-3">
                                                    <p className="truncate text-sm font-bold">
                                                        {auth?.user?.name}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-400">
                                                        {auth?.user?.email}
                                                    </p>
                                                </div>

                                                <Link
                                                    href="/admin/settings"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Settings className="h-4 w-4" strokeWidth={2} />
                                                    Settings
                                                </Link>

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50"
                                                >
                                                    <LogOut className="h-4 w-4" strokeWidth={2} />
                                                    Sign out
                                                </Link>

                                            </div>
                                        </>
                                    )}

                                </div>

                            </div>

                        </div>

                    </header>

                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>

                    <footer className="border-t border-gray-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-400 sm:flex-row">
                            <p>
                                &copy; {new Date().getFullYear()} TrendPulse. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="/admin/settings" className="hover:text-gray-600">
                                    Settings
                                </Link>
                                <a href="mailto:support@trendpulse.com" className="hover:text-gray-600">
                                    Support
                                </a>
                                <span>v1.0.0</span>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>

        </div>
    );
}