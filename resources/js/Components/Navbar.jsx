import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Navbar() {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigation = [
        {
            name: 'YouTube',
            href: '/youtube',
        },
        {
            name: 'Entertainment',
            href: '/entertainment',
        },
        {
            name: 'People',
            href: '/people',
        },
        {
            name: 'Community',
            href: '/community',
        },
    ];

    const isActive = (href) => {
        if (href === '/') {
            return url === '/';
        }

        return url.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-black text-white">
                        T
                    </div>

                    <span className="text-xl font-black tracking-tight">
                        Trend<span className="text-gray-400">Pulse</span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-semibold transition ${
                                isActive(item.href)
                                    ? 'text-black'
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden lg:block">
                    <Link
                        href="/share-your-story"
                        className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-gray-800"
                    >
                        Share Your Story
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 lg:hidden"
                >
                    <span className="text-xl">
                        {mobileOpen ? '×' : '☰'}
                    </span>
                </button>
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
                                        ? 'bg-gray-100 text-black'
                                        : 'text-gray-600'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href="/share-your-story"
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-bold text-white"
                        >
                            Share Your Story
                        </Link>

                    </nav>
                </div>
            )}
        </header>
    );
}