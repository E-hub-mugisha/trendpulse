// resources/js/Components/Navbar.jsx

import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Search,
    X,
    Menu,
    PlayCircle,
    Newspaper,
    Users,
    Grid3x3,
} from 'lucide-react';

function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

const SECTION_ICONS = {
    stories: PlayCircle,
    entertainment: Newspaper,
    people: Users,
};

function SearchOverlay({ open, onClose, categories }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const debouncedQuery = useDebouncedValue(query, 300);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setResults(null);
        }
    }, [open]);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.trim().length < 2) {
            setResults(null);
            return;
        }

        setLoading(true);

        fetch(`/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then((res) => res.json())
            .then((data) => setResults(data))
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!open) return null;

    const isSearching = query.trim().length >= 2;

    const hasResults = results && (
        results.people.length > 0 ||
        results.entertainment.length > 0 ||
        results.stories.length > 0
    );

    const resultGroups = [
        { key: 'people', label: 'People Stories', items: results?.people || [] },
        { key: 'entertainment', label: 'Entertainment', items: results?.entertainment || [] },
        { key: 'stories', label: 'Stories', items: results?.stories || [] },
    ];

    const categorySections = [
        { key: 'stories', label: 'Stories', base: '/stories' },
        { key: 'entertainment', label: 'Entertainment', base: '/entertainment' },
        { key: 'people', label: 'People', base: '/people' },
    ];

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex h-[76px] max-w-4xl items-center gap-4 px-5 sm:px-6">

                    <Search className="h-5 w-5 shrink-0 text-[#0A599E]" strokeWidth={2} />

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search stories, videos, entertainment..."
                        className="flex-1 border-0 bg-transparent p-0 text-lg font-medium placeholder-gray-300 focus:outline-none focus:ring-0"
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#0A599E]/10 hover:text-[#0A599E]"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>

                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6">

                {/* Search results (only while actively searching) */}
                {isSearching && (
                    <div className="mb-10">

                        {loading && (
                            <p className="text-sm text-gray-400">Searching…</p>
                        )}

                        {!loading && !hasResults && (
                            <p className="text-sm text-gray-400">
                                No results for "{query}".
                            </p>
                        )}

                        {!loading && hasResults && (
                            <div className="space-y-8">
                                {resultGroups.map((group) => (
                                    group.items.length > 0 && (
                                        <div key={group.key}>
                                            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                                                {group.label}
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={item.url}
                                                        onClick={onClose}
                                                        className="group flex items-center gap-3 rounded-xl p-2 hover:bg-[#0A599E]/5"
                                                    >
                                                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-gray-100" />
                                                            )}
                                                        </div>
                                                        <span className="line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-[#0A599E]">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                    </div>
                )}

                {/* Browse by category (always visible, secondary once searching) */}
                <div className={isSearching ? 'border-t border-gray-100 pt-8' : ''}>

                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <Grid3x3 className="h-3.5 w-3.5 text-[#0A599E]" strokeWidth={2} />
                        Browse by Category
                    </h3>

                    <div className="grid gap-8 sm:grid-cols-3">

                        {categorySections.map((section) => {
                            const Icon = SECTION_ICONS[section.key];

                            return (
                                <div key={section.key}>
                                    <Link
                                        href={section.base}
                                        onClick={onClose}
                                        className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800 transition hover:text-[#0A599E]"
                                    >
                                        <Icon className="h-4 w-4" strokeWidth={2} />
                                        {section.label}
                                    </Link>

                                    <div className="flex flex-col gap-1">
                                        {categories.length > 0 ? (
                                            categories.slice(0, 6).map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`${section.base}?category=${cat.slug}`}
                                                    onClick={onClose}
                                                    className="rounded-lg px-2 py-1.5 text-sm text-gray-500 transition hover:bg-[#0A599E]/5 hover:text-[#0A599E]"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="px-2 py-1.5 text-sm text-gray-300">
                                                No categories yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default function Navbar() {
    const { url, props } = usePage();
    const categories = props.categories || [];
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const navigation = [
        { name: 'stories', href: '/stories' },
        { name: 'Entertainment', href: '/entertainment' },
        { name: 'People', href: '/people' },
        { name: 'Community', href: '/community' },
    ];

    const isActive = (href) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

                    <Link href="/" className="flex items-center gap-2">
                        {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A599E] text-sm font-black text-white">
                            T
                        </div> */}
                        <img
                            src="/assets/images/logo.png"
                            alt="TrendPulse Logo"
                            className="h-9 w-auto"
                        />
                        <span className="text-xl font-black tracking-tight text-black">
                            Trend<span className="text-[#0A599E]">Pulse</span>
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    isActive(item.href)
                                        ? 'bg-[#0A599E]/10 text-[#0A599E]'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop right side */}
                    <div className="hidden items-center gap-2 lg:flex">

                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition hover:bg-[#0A599E]/10 hover:text-[#0A599E]"
                        >
                            <Search className="h-5 w-5" strokeWidth={2} />
                        </button>

                        <Link
                            href="/share-your-story"
                            className="inline-flex items-center rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#07406F]"
                        >
                            Share Your Story
                        </Link>

                    </div>

                    {/* Mobile: search + menu buttons */}
                    <div className="flex items-center gap-2 lg:hidden">

                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-[#0A599E]/10 hover:text-[#0A599E]"
                        >
                            <Search className="h-5 w-5" strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#0A599E] hover:text-[#0A599E]"
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5" strokeWidth={2} />
                            ) : (
                                <Menu className="h-5 w-5" strokeWidth={2} />
                            )}
                        </button>

                    </div>

                </div>

                {/* Mobile navigation */}
                {mobileOpen && (
                    <div className="border-t border-gray-100 bg-white px-5 py-5 lg:hidden">
                        <nav className="flex flex-col gap-2">

                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                                        isActive(item.href)
                                            ? 'bg-[#0A599E]/10 text-[#0A599E]'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <Link
                                href="/share-your-story"
                                onClick={() => setMobileOpen(false)}
                                className="mt-2 rounded-xl bg-[#0A599E] px-4 py-3 text-center text-sm font-bold text-white"
                            >
                                Share Your Story
                            </Link>

                        </nav>
                    </div>
                )}
            </header>

            <SearchOverlay
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                categories={categories}
            />
        </>
    );
}