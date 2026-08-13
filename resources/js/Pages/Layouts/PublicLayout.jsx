import { Head, Link } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    return (
        <>
            <Head title="Stories" />

            <div className="min-h-screen bg-white">

                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tight"
                        >
                            STORIES<span className="text-gray-400">.</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden items-center gap-8 md:flex">

                            <Link
                                href="/youtube"
                                className="text-sm font-medium text-gray-700 transition hover:text-black"
                            >
                                YouTube
                            </Link>

                            <Link
                                href="/entertainment"
                                className="text-sm font-medium text-gray-700 transition hover:text-black"
                            >
                                Entertainment
                            </Link>

                            <Link
                                href="/people"
                                className="text-sm font-medium text-gray-700 transition hover:text-black"
                            >
                                People
                            </Link>

                            <Link
                                href="/community"
                                className="text-sm font-medium text-gray-700 transition hover:text-black"
                            >
                                Community
                            </Link>

                        </nav>

                        {/* CTA */}
                        <Link
                            href="/share-your-story"
                            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Share Your Story
                        </Link>

                    </div>
                </header>

                <main>
                    {children}
                </main>

                <footer className="border-t border-gray-100 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 py-12">

                        <div className="flex flex-col justify-between gap-8 md:flex-row">

                            <div>
                                <Link
                                    href="/"
                                    className="text-xl font-black"
                                >
                                    STORIES.
                                </Link>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                                    Real stories, real people and real
                                    conversations from our community.
                                </p>
                            </div>

                            <div className="flex gap-8 text-sm text-gray-600">
                                <Link href="/youtube">
                                    YouTube
                                </Link>

                                <Link href="/entertainment">
                                    Entertainment
                                </Link>

                                <Link href="/people">
                                    People
                                </Link>

                                <Link href="/community">
                                    Community
                                </Link>
                            </div>

                        </div>

                        <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
                            © {new Date().getFullYear()} Stories. All rights reserved.
                        </div>

                    </div>
                </footer>

            </div>
        </>
    );
}