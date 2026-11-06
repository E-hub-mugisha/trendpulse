import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Search,
    X,
    Menu,
    Bell,
    User,
    LogOut,
    ChevronDown,
    Clock,
    PlayCircle,
    Newspaper,
    Users,
    CornerDownLeft,
} from 'lucide-react';

const NAVIGATION = [
    { name: 'Stories', href: '/stories', icon: PlayCircle },
    { name: 'Entertainment', href: '/entertainment', icon: Newspaper },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Community', href: '/community', icon: Users },
];

const RECENT_KEY = 'tp_recent_searches';
const readRecent = () => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
};
const writeRecent = (list) => {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
};

function useDebounced(value, delay) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

function useClickOutside(ref, handler, active) {
    useEffect(() => {
        if (!active) return;
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler();
        };
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler, active]);
}

/* ------------------------------ Search ------------------------------ */

function SearchOverlay({ open, onClose, categories }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);
    const [recent, setRecent] = useState([]);
    const inputRef = useRef(null);

    const debounced = useDebounced(query, 250);
    const q = debounced.trim();
    const typing = query.trim().length >= 2;

    // Open / close housekeeping: focus, scroll lock, reset
    useEffect(() => {
        if (!open) {
            setQuery('');
            setResults(null);
            setActive(0);
            return;
        }
        setRecent(readRecent());
        const t = setTimeout(() => inputRef.current?.focus(), 30);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t);
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Fetch, cancelling stale requests
    useEffect(() => {
        if (!open) return;
        if (q.length < 2) {
            setResults(null);
            setLoading(false);
            return;
        }
        const ctrl = new AbortController();
        setLoading(true);
        fetch(`/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((d) => { setResults(d); setActive(0); })
            .catch((e) => {
                if (e.name !== 'AbortError') setResults({ people: [], entertainment: [], stories: [] });
            })
            .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
        return () => ctrl.abort();
    }, [q, open]);

    const groups = useMemo(
        () => [
            { key: 'stories', label: 'Stories', items: results?.stories || [] },
            { key: 'entertainment', label: 'Entertainment', items: results?.entertainment || [] },
            { key: 'people', label: 'People', items: results?.people || [] },
        ].filter((g) => g.items.length > 0),
        [results],
    );
    const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

    useEffect(() => {
        document.getElementById(`search-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const remember = (term) => {
        const t = term.trim();
        if (t.length < 2) return;
        const next = [t, ...readRecent().filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5);
        writeRecent(next);
    };

    const go = (item) => {
        remember(query);
        onClose();
        router.visit(item.url);
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (flat[active]) go(flat[active]);
            else remember(query);
        } else if (e.key === 'Escape') onClose();
    };

    if (!open) return null;

    let offset = 0;

    return (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[8vh] sm:px-4" role="dialog" aria-modal="true" aria-label="Search">
            <div className="tp-fade-in absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />

            <div className="tp-pop-in relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-100 px-4">
                    <Search className="h-4 w-4 shrink-0 text-[#0A599E]" strokeWidth={2.2} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search stories, people, entertainment…"
                        aria-label="Search"
                        autoComplete="off"
                        className="h-14 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                    {query && (
                        <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">Esc</kbd>
                </div>

                <div className="overflow-y-auto overscroll-contain p-2">
                    {typing ? (
                        <>
                            {loading && (
                                <div className="space-y-1 p-2" aria-label="Loading results">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl p-2">
                                            <div className="h-11 w-14 rounded-lg bg-slate-100" />
                                            <div className="h-3 w-2/3 rounded bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && results && flat.length === 0 && (
                                <div className="px-4 py-10 text-center">
                                    <p className="text-sm font-semibold text-slate-800">No results for “{query.trim()}”</p>
                                    <p className="mt-1 text-xs text-slate-500">Check the spelling or try a shorter keyword.</p>
                                </div>
                            )}

                            {!loading && flat.length > 0 && (
                                <div role="listbox" aria-label="Search results">
                                    {groups.map((group) => {
                                        const start = offset;
                                        offset += group.items.length;
                                        return (
                                            <div key={group.key} className="mb-1">
                                                <p className="px-3 pb-1 pt-3 text-xs font-semibold text-slate-400">{group.label}</p>
                                                {group.items.map((item, i) => {
                                                    const idx = start + i;
                                                    const isActive = idx === active;
                                                    return (
                                                        <Link
                                                            key={`${group.key}-${item.id}`}
                                                            id={`search-opt-${idx}`}
                                                            role="option"
                                                            aria-selected={isActive}
                                                            href={item.url}
                                                            onClick={() => { remember(query); onClose(); }}
                                                            onMouseMove={() => setActive(idx)}
                                                            className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${isActive ? 'bg-blue-50' : ''}`}
                                                        >
                                                            <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                                {item.image && <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                                                            </div>
                                                            <span className={`line-clamp-2 flex-1 text-sm font-semibold ${isActive ? 'text-[#0A599E]' : 'text-slate-800'}`}>{item.title}</span>
                                                            {isActive && <CornerDownLeft className="hidden h-3.5 w-3.5 text-[#0A599E] sm:block" />}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-2">
                            {recent.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between px-1 pb-2">
                                        <p className="text-xs font-semibold text-slate-400">Recent</p>
                                        <button type="button" onClick={() => { writeRecent([]); setRecent([]); }} className="text-xs font-medium text-slate-400 hover:text-[#0A599E]">
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recent.map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => { setQuery(r); inputRef.current?.focus(); }}
                                                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-[#0A599E]/10 hover:text-[#0A599E]"
                                            >
                                                <Clock className="h-3 w-3" /> {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="px-1 pb-2 text-xs font-semibold text-slate-400">Browse</p>
                            <div className="grid gap-1 sm:grid-cols-3">
                                {NAVIGATION.slice(0, 3).map((s) => (
                                    <div key={s.name}>
                                        <Link href={s.href} onClick={onClose} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:text-[#0A599E]">
                                            <s.icon className="h-4 w-4" strokeWidth={2} /> {s.name}
                                        </Link>
                                        {categories.slice(0, 4).map((c) => (
                                            <Link key={c.id} href={`${s.href}?category=${c.slug}`} onClick={onClose} className="block rounded-lg px-2 py-1.5 pl-8 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-[#0A599E]">
                                                {c.name}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400 sm:flex">
                    <span><kbd className="font-sans font-semibold">↑↓</kbd> to move</span>
                    <span><kbd className="font-sans font-semibold">Enter</kbd> to open</span>
                    <span><kbd className="font-sans font-semibold">Esc</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------- Account menu ---------------------------- */

function AccountMenu({ user, unread }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const close = () => setOpen(false);
    useClickOutside(ref, close, open);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && close();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const item = 'flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0A599E]';

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2.5 transition hover:border-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A599E] text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden max-w-[90px] truncate text-[13px] font-semibold text-slate-700 xl:block">{user?.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div role="menu" className="tp-pop-in absolute right-0 top-[calc(100%+8px)] w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white py-1 shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <Link role="menuitem" href="/profile" onClick={close} className={item}><User className="h-4 w-4" /> Profile</Link>
                    <Link role="menuitem" href="/notifications" onClick={close} className={item}>
                        <Bell className="h-4 w-4" /> Notifications
                        {unread > 0 && <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-4 text-white">{unread > 9 ? '9+' : unread}</span>}
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button role="menuitem" type="button" onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-red-500 transition hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Log out
                    </button>
                </div>
            )}
        </div>
    );
}

/* ------------------------------- Navbar ------------------------------- */

export default function Navbar() {
    const { url, props } = usePage();
    const { auth, unreadNotificationsCount = 0 } = props;
    const categories = props.categories || [];

    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isActive = (href) => url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);

    // Hide on scroll down, reveal on scroll up
    useEffect(() => {
        let last = window.scrollY;
        let ticking = false;
        const update = () => {
            const y = window.scrollY;
            setScrolled(y > 8);
            if (Math.abs(y - last) > 8) {
                setHidden(y > last && y > 160);
                last = y;
            }
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Search shortcut: Ctrl/Cmd+K, or "/" outside inputs
    useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            const typingInField = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typingInField)) {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Close mobile menu on navigation, lock scroll + Esc while open
    useEffect(() => { setMobileOpen(false); }, [url]);
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
        document.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
    }, [mobileOpen]);

    const iconBtn = 'relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#0A599E]/10 hover:text-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]';

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'} ${
                    scrolled ? 'border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl' : 'border-b border-transparent bg-white/70 backdrop-blur-md'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2">
                        <img src="/assets/images/logo.png" alt="" className="h-8 w-auto" />
                        <span className="text-lg font-black tracking-tight text-slate-900">
                            Trend<span className="text-[#0A599E]">Pulse</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                        {NAVIGATION.map((item) => {
                            const on = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={on ? 'page' : undefined}
                                    className={`group relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${on ? 'text-[#0A599E]' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    {item.name}
                                    <span className={`absolute inset-x-3.5 bottom-0.5 h-0.5 origin-left rounded-full bg-[#0A599E] transition-transform duration-200 ${on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/70 pl-3 pr-2 text-[13px] text-slate-400 transition hover:border-[#0A599E] hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
                            aria-label="Search (press slash)"
                        >
                            <Search className="h-3.5 w-3.5" strokeWidth={2.2} />
                            <span className="w-24 text-left">Search</span>
                            <kbd className="rounded border border-slate-200 px-1.5 text-[10px] font-medium">/</kbd>
                        </button>

                        {auth?.user && (
                            <Link href="/notifications" className={iconBtn} aria-label={`Notifications${unreadNotificationsCount ? `, ${unreadNotificationsCount} unread` : ''}`}>
                                <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <Link
                            href="/share-your-story"
                            className="inline-flex h-9 items-center rounded-full bg-[#0A599E] px-4 text-[13px] font-bold text-white transition hover:bg-[#07406F] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2"
                        >
                            Share your story
                        </Link>

                        {auth?.user ? (
                            <AccountMenu user={auth.user} unread={unreadNotificationsCount} />
                        ) : (
                            <Link href="/login" className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-[13px] font-bold text-slate-700 transition hover:border-[#0A599E] hover:text-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]">
                                Sign in
                            </Link>
                        )}
                    </div>

                    {/* Mobile actions */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <button type="button" onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
                            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className={iconBtn}
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                        >
                            <Menu className="h-5 w-5" strokeWidth={2} />
                            {auth?.user && unreadNotificationsCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-[75] lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
                <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />
                <aside
                    id="mobile-menu"
                    className={`absolute right-0 top-0 flex h-full w-[85%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
                        <span className="text-sm font-bold text-slate-900">Menu</span>
                        <button type="button" onClick={() => setMobileOpen(false)} className={iconBtn} aria-label="Close menu" tabIndex={mobileOpen ? 0 : -1}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
                        {NAVIGATION.map((item) => {
                            const on = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    tabIndex={mobileOpen ? 0 : -1}
                                    aria-current={on ? 'page' : undefined}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${on ? 'bg-[#0A599E]/10 text-[#0A599E]' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <item.icon className="h-4 w-4" strokeWidth={2} /> {item.name}
                                </Link>
                            );
                        })}
                        <Link href="/share-your-story" tabIndex={mobileOpen ? 0 : -1} className="mt-3 block rounded-xl bg-[#0A599E] px-4 py-3 text-center text-sm font-bold text-white active:scale-[0.98]">
                            Share your story
                        </Link>
                    </nav>

                    <div className="border-t border-slate-100 p-3">
                        {auth?.user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-2">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A599E] text-xs font-bold text-white">{auth.user.name?.charAt(0)?.toUpperCase()}</span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-900">{auth.user.name}</p>
                                        <p className="truncate text-xs text-slate-400">{auth.user.email}</p>
                                    </div>
                                </div>
                                <Link href="/profile" tabIndex={mobileOpen ? 0 : -1} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><User className="h-4 w-4" /> Profile</Link>
                                <Link href="/notifications" tabIndex={mobileOpen ? 0 : -1} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    <Bell className="h-4 w-4" /> Notifications
                                    {unreadNotificationsCount > 0 && <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-4 text-white">{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>}
                                </Link>
                                <button type="button" tabIndex={mobileOpen ? 0 : -1} onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50">
                                    <LogOut className="h-4 w-4" /> Log out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" tabIndex={mobileOpen ? 0 : -1} className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">
                                Sign in
                            </Link>
                        )}
                    </div>
                </aside>
            </div>

            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} categories={categories} />
        </>
    );
}