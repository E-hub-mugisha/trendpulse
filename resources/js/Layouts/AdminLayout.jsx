// resources/js/Layouts/AdminLayout.jsx

import { Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    LayoutDashboard,
    FolderTree,
    PlayCircle,
    Clapperboard,
    Users,
    MessageCircle,
    UserCog,
    Search,
    Bell,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    LogOut,
    Settings,
    ExternalLink,
    PanelLeftClose,
    PanelLeftOpen,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

const BRAND = '#0A599E';

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

const MENU = [
    {
        heading: 'Overview',
        items: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
        ],
    },
    {
        heading: 'Content',
        items: [
            { label: 'Categories', href: '/admin/categories', icon: FolderTree },
            { label: 'YouTube', href: '/admin/youtube', icon: PlayCircle },
            { label: 'Entertainment', href: '/admin/entertainment', icon: Clapperboard },
            { label: 'People', href: '/admin/people', icon: Users },
        ],
    },
    {
        heading: 'Audience',
        items: [
            { label: 'Community', href: '/admin/community', icon: MessageCircle },
            { label: 'Users', href: '/admin/users', icon: UserCog },
        ],
    },
];

const ALL_ITEMS = MENU.flatMap((group) => group.items);

function isActive(currentUrl, href, exact) {
    const path = currentUrl.split('?')[0];
    if (exact) return path === href;
    return path === href || path.startsWith(`${href}/`);
}

function initials(name = '') {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('') || 'A'
    );
}

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

/** Close a popover on outside click or Escape. */
function useDismiss(open, onClose, ref) {
    useEffect(() => {
        if (!open) return undefined;

        const onPointerDown = (event) => {
            if (ref.current && !ref.current.contains(event.target)) onClose();
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose, ref]);
}

function Avatar({ name, size = 'md' }) {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-9 w-9 text-xs',
    };

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizes[size]}`}
            style={{ backgroundColor: BRAND }}
            aria-hidden="true"
        >
            {initials(name)}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Sidebar                                                                   */
/* -------------------------------------------------------------------------- */

function SidebarContent({ currentUrl, auth, collapsed = false, onNavigate, onToggleCollapse }) {
    return (
        <>
            {/* Brand */}
            <div
                className={`flex h-16 shrink-0 items-center border-b border-gray-200 ${
                    collapsed ? 'justify-center px-2' : 'px-5'
                }`}
            >
                <Link
                    href="/admin/dashboard"
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-lg ${focusRing}`}
                    aria-label="TrendPulse admin home"
                >
                    <img
                        src="/assets/images/logo.png"
                        alt=""
                        className="h-8 w-8 shrink-0 object-contain"
                    />
                    {!collapsed && (
                        <span className="text-xl font-extrabold tracking-tight text-gray-900">
                            Trend<span style={{ color: BRAND }}>Pulse</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav
                aria-label="Admin navigation"
                className={`flex-1 space-y-6 overflow-y-auto py-5 ${collapsed ? 'px-2' : 'px-3'}`}
            >
                {MENU.map((group) => (
                    <div key={group.heading}>
                        {collapsed ? (
                            <div className="mx-auto mb-2 h-px w-6 bg-gray-200" />
                        ) : (
                            <p className="mb-2 px-3 text-xs font-semibold text-gray-400">
                                {group.heading}
                            </p>
                        )}

                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(currentUrl, item.href, item.exact);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            title={collapsed ? item.label : undefined}
                                            aria-label={collapsed ? item.label : undefined}
                                            aria-current={active ? 'page' : undefined}
                                            className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                                                collapsed
                                                    ? 'h-10 justify-center'
                                                    : 'gap-3 px-3 py-2.5'
                                            } ${
                                                active
                                                    ? 'bg-[#0A599E]/10 text-[#0A599E]'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            {active && (
                                                <span
                                                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                                                    style={{ backgroundColor: BRAND }}
                                                />
                                            )}
                                            <Icon
                                                className="h-[18px] w-[18px] shrink-0"
                                                strokeWidth={active ? 2.25 : 2}
                                            />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className={`shrink-0 border-t border-gray-200 ${collapsed ? 'p-2' : 'p-3'}`}>
                <Link
                    href="/"
                    onClick={onNavigate}
                    title={collapsed ? 'View website' : undefined}
                    aria-label={collapsed ? 'View website' : undefined}
                    className={`flex items-center rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 motion-reduce:transition-none ${focusRing} ${
                        collapsed ? 'h-10 justify-center' : 'gap-3 px-3 py-2.5'
                    }`}
                >
                    <ExternalLink className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && 'View website'}
                </Link>

                {!collapsed && (
                    <div className="mt-2 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                        <Avatar name={auth?.user?.name} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {auth?.user?.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                )}

                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`mt-2 flex w-full items-center rounded-lg text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 motion-reduce:transition-none ${focusRing} ${
                            collapsed ? 'h-10 justify-center' : 'gap-3 px-3 py-2.5'
                        }`}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={2} />
                        ) : (
                            <>
                                <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={2} />
                                Collapse
                            </>
                        )}
                    </button>
                )}
            </div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

export default function AdminLayout({ children, title, actions }) {
    const page = usePage();
    const { auth, flash } = page.props;
    const currentUrl = page.url;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(true);
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem('tp-admin-sidebar') === 'collapsed';
        } catch {
            return false;
        }
    });

    const searchRef = useRef(null);
    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    const closeProfile = useCallback(() => setProfileOpen(false), []);
    const closeNotifications = useCallback(() => setNotificationsOpen(false), []);

    useDismiss(profileOpen, closeProfile, profileRef);
    useDismiss(notificationsOpen, closeNotifications, notificationsRef);

    const activeItem = ALL_ITEMS.find((item) => isActive(currentUrl, item.href, item.exact));
    const pageTitle = title || activeItem?.label || 'Dashboard';

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('tp-admin-sidebar', next ? 'collapsed' : 'expanded');
            } catch {
                /* storage unavailable: ignore */
            }
            return next;
        });
    };

    // Close overlays whenever the page changes.
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
        setFlashVisible(true);
    }, [currentUrl, flash?.success, flash?.error]);

    // Mobile drawer: Escape to close + lock background scroll.
    useEffect(() => {
        if (!mobileOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') setMobileOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [mobileOpen]);

    // Ctrl/Cmd + K focuses search.
    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const flashMessage = flash?.success || flash?.error;
    const flashIsError = Boolean(flash?.error);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 antialiased">
            <a
                href="#admin-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to content
            </a>

            {/* Desktop sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-gray-200 bg-white transition-[width] duration-200 motion-reduce:transition-none lg:flex ${
                    collapsed ? 'w-[72px]' : 'w-64'
                }`}
            >
                <SidebarContent
                    currentUrl={currentUrl}
                    auth={auth}
                    collapsed={collapsed}
                    onToggleCollapse={toggleCollapsed}
                />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
                    <div
                        className="absolute inset-0 bg-gray-900/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                            className={`absolute right-3 top-4 z-10 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 ${focusRing}`}
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

            {/* Main column */}
            <div
                className={`flex min-h-screen flex-col transition-[padding] duration-200 motion-reduce:transition-none ${
                    collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
                }`}
            >
                {/* Top bar */}
                <header className="sticky top-0 z-20 h-16 border-b border-gray-200 bg-white/90 backdrop-blur">
                    <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                            className={`rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden ${focusRing}`}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Breadcrumb + page title */}
                        <nav aria-label="Breadcrumb" className="min-w-0">
                            <ol className="flex items-center gap-1.5 text-sm">
                                <li className="hidden text-gray-400 sm:block">
                                    <Link
                                        href="/admin/dashboard"
                                        className={`rounded hover:text-gray-600 ${focusRing}`}
                                    >
                                        Admin
                                    </Link>
                                </li>
                                <li className="hidden text-gray-300 sm:block" aria-hidden="true">
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </li>
                                <li className="min-w-0">
                                    <h1 className="truncate text-base font-semibold text-gray-900">
                                        {pageTitle}
                                    </h1>
                                </li>
                            </ol>
                        </nav>

                        {/* Search */}
                        <div className="ml-auto hidden w-full max-w-sm items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-[#0A599E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A599E]/20 md:flex">
                            <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
                            <input
                                ref={searchRef}
                                type="search"
                                placeholder="Search admin"
                                aria-label="Search admin"
                                className="w-full border-0 bg-transparent p-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                            />
                            <kbd className="hidden shrink-0 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-400 lg:block">
                                Ctrl K
                            </kbd>
                        </div>

                        <div className="ml-auto flex items-center gap-1 md:ml-0">
                            {actions}

                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNotificationsOpen((prev) => !prev);
                                        setProfileOpen(false);
                                    }}
                                    aria-label="Notifications"
                                    aria-haspopup="true"
                                    aria-expanded={notificationsOpen}
                                    className={`relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 ${focusRing}`}
                                >
                                    <Bell className="h-5 w-5" strokeWidth={2} />
                                    <span
                                        className="absolute right-2 top-2 h-2 w-2 rounded-full ring-2 ring-white"
                                        style={{ backgroundColor: BRAND }}
                                    />
                                </button>

                                {notificationsOpen && (
                                    <div className="absolute right-0 top-12 z-30 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                            <p className="text-sm font-semibold">Notifications</p>
                                        </div>
                                        <div className="px-4 py-10 text-center">
                                            <Bell className="mx-auto h-8 w-8 text-gray-300" strokeWidth={1.5} />
                                            <p className="mt-3 text-sm font-medium text-gray-900">
                                                You&apos;re all caught up
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                New activity on your site will show up here.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" aria-hidden="true" />

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen((prev) => !prev);
                                        setNotificationsOpen(false);
                                    }}
                                    aria-haspopup="menu"
                                    aria-expanded={profileOpen}
                                    aria-label="Account menu"
                                    className={`flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-gray-100 ${focusRing}`}
                                >
                                    <Avatar name={auth?.user?.name} size="sm" />
                                    <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 xl:block">
                                        {auth?.user?.name}
                                    </span>
                                    <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" strokeWidth={2} />
                                </button>

                                {profileOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-12 z-30 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
                                    >
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="truncate text-sm font-semibold">{auth?.user?.name}</p>
                                            <p className="truncate text-xs text-gray-500">{auth?.user?.email}</p>
                                        </div>

                                        <Link
                                            href="/admin/settings"
                                            role="menuitem"
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Settings className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                            Settings
                                        </Link>

                                        <Link
                                            href="/"
                                            role="menuitem"
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <ExternalLink className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                            View website
                                        </Link>

                                        <div className="my-1.5 border-t border-gray-100" />

                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            role="menuitem"
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" strokeWidth={2} />
                                            Sign out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main id="admin-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        {flashMessage && flashVisible && (
                            <div
                                role={flashIsError ? 'alert' : 'status'}
                                className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                                    flashIsError
                                        ? 'border-red-200 bg-red-50 text-red-800'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                }`}
                            >
                                {flashIsError ? (
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                ) : (
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                )}
                                <p className="flex-1">{flashMessage}</p>
                                <button
                                    type="button"
                                    onClick={() => setFlashVisible(false)}
                                    aria-label="Dismiss message"
                                    className={`rounded p-0.5 opacity-60 hover:opacity-100 ${focusRing}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row">
                        <p>&copy; {new Date().getFullYear()} TrendPulse. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Link href="/admin/settings" className="hover:text-gray-900">
                                Settings
                            </Link>
                            <a href="mailto:support@trendpulse.com" className="hover:text-gray-900">
                                Support
                            </a>
                            <span className="text-gray-400">v1.0.0</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}