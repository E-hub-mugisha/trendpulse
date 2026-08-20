import { Link } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';

const SOCIAL_ICONS = {
    facebook: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.2-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h1.9L7.5 4h-2l12.1 16Z" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    youtube: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.9 3.7 12 3.7 12 3.7s-6.9 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.8 2.8 2.8 0 0 0 2 2c1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.8ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
    ),
    tiktok: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M16.6 5.8a4.6 4.6 0 0 1-3.8-4.3h-3.2v14.6a2.7 2.7 0 1 1-1.9-2.6v-3.3a6 6 0 1 0 5.1 6V9.6a7.8 7.8 0 0 0 3.8 1V7.4a4.5 4.5 0 0 1-2.5-.9 4.4 4.4 0 0 1-.5-.7Z" />
        </svg>
    ),
};

const SOCIAL_LINKS = [
    { key: 'facebook', href: 'https://www.facebook.com/trendpulse05global', label: 'Facebook' },
    { key: 'x', href: 'https://x.com/TrendPulse024', label: 'X (Twitter)' },
    { key: 'instagram', href: 'https://www.instagram.com/trend_pulse05/', label: 'Instagram' },
    { key: 'youtube', href: 'https://www.youtube.com/@TrendPulse_Global/featured', label: 'YouTube' },
    { key: 'tiktok', href: 'https://www.tiktok.com/@trend.pulse20', label: 'TikTok' },
];

export default function Footer() {
    return (
        <footer className="relative bg-black text-white">

            <div className="absolute inset-x-0 top-0 h-1 bg-[#0A599E]" />

            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

                <div className="grid gap-12 md:grid-cols-12">

                    <div className="md:col-span-5">

                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tight"
                        >
                            Trend<span className="text-[#5BA3DB]">Pulse</span>
                        </Link>

                        <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">
                            Real stories, real people and real conversations.
                            Discover stories that entertain, inspire and
                            connect us.
                        </p>

                        <div className="mt-6 flex items-center gap-2">
                            {SOCIAL_LINKS.map((social) => (
                                
                                <a    key={social.key}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-[#0A599E] hover:text-white"
                                >
                                    {SOCIAL_ICONS[social.key]}
                                </a>
                            ))}
                        </div>

                    </div>

                    <div className="md:col-span-2">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                            Explore
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm">
                            <Link href="/stories" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                Stories
                            </Link>
                            <Link href="/entertainment" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                Entertainment
                            </Link>
                            <Link href="/people" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                People
                            </Link>
                            <Link href="/community" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                Community
                            </Link>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                            Community
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm">
                            <Link href="/share-your-story" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                Share Your Story
                            </Link>
                            <Link href="/community" className="text-gray-400 transition hover:text-[#5BA3DB]">
                                Join the Conversation
                            </Link>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                            Stay Updated
                        </h3>

                        <p className="mt-5 text-sm leading-6 text-gray-400">
                            Get the best stories delivered to your inbox.
                        </p>

                        <form className="mt-4 flex items-center gap-2 rounded-full border border-transparent bg-white/10 p-1.5 pl-4 transition focus-within:border-[#0A599E] focus-within:bg-white/[0.08]">
                            <Mail className="h-4 w-4 shrink-0 text-[#5BA3DB]" strokeWidth={2} />
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full border-0 bg-transparent p-0 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A599E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d6ab8]"
                            >
                                Join
                                <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center">
                    <p>
                        &copy; {new Date().getFullYear()} TrendPulse. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <Link href="/about" className="transition hover:text-[#5BA3DB]">
                            About
                        </Link>
                        <Link href="/privacy" className="transition hover:text-[#5BA3DB]">
                            Privacy
                        </Link>
                        <Link href="/terms" className="transition hover:text-[#5BA3DB]">
                            Terms
                        </Link>
                        <Link href="/contact" className="transition hover:text-[#5BA3DB]">
                            Contact
                        </Link>
                    </div>
                </div>

            </div>

        </footer>
    );
}