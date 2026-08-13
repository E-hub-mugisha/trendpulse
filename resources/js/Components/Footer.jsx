import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">

            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

                <div className="grid gap-12 md:grid-cols-4">

                    <div className="md:col-span-2">

                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tight"
                        >
                            Trend<span className="text-gray-400">Pulse</span>
                        </Link>

                        <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
                            Real stories, real people and real conversations.
                            Discover stories that entertain, inspire and
                            connect us.
                        </p>

                        <Link
                            href="/share-your-story"
                            className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
                        >
                            Share Your Story
                        </Link>

                    </div>

                    <div>
                        <h3 className="text-sm font-bold">
                            Explore
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">
                            <Link href="/youtube">YouTube</Link>
                            <Link href="/entertainment">Entertainment</Link>
                            <Link href="/people">People</Link>
                            <Link href="/community">Community</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold">
                            Community
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">
                            <Link href="/share-your-story">
                                Share Your Story
                            </Link>

                            <Link href="/community">
                                Join the Conversation
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="mt-14 flex flex-col justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-400 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} TrendPulse.
                        All rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <span>Privacy</span>
                        <span>Terms</span>
                    </div>
                </div>

            </div>

        </footer>
    );
}