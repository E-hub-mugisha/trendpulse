import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

// Change this to your real newsletter route (must accept POST { email })
const NEWSLETTER_ENDPOINT = '/newsletter';

const SOCIAL_ICONS = {
    facebook: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.2-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h1.9L7.5 4h-2l12.1 16Z" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    youtube: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.9 3.7 12 3.7 12 3.7s-6.9 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.8 2.8 2.8 0 0 0 2 2c1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.8ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
    ),
    tiktok: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
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

const COLUMNS = [
    {
        title: 'Explore',
        links: [
            { name: 'Stories', href: '/stories' },
            { name: 'Entertainment', href: '/entertainment' },
            { name: 'People', href: '/people' },
            { name: 'Community', href: '/community' },
        ],
    },
    {
        title: 'Get involved',
        links: [
            { name: 'Share your story', href: '/share-your-story' },
            { name: 'Join the conversation', href: '/community' },
        ],
    },
];

const linkCls = 'text-sm text-slate-400 transition hover:text-[#5BA3DB] focus:outline-none focus-visible:text-[#5BA3DB] focus-visible:underline';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | sending | done
    const [error, setError] = useState('');

    const invalid = touched && email !== '' && !/^\S+@\S+\.\S+$/.test(email);

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Enter a full email, like name@example.com.');
            return;
        }
        setError('');
        setStatus('sending');
        router.post(NEWSLETTER_ENDPOINT, { email }, {
            preserveScroll: true,
            onSuccess: () => { setStatus('done'); setEmail(''); },
            onError: (errs) => { setStatus('idle'); setError(errs.email || 'Something went wrong. Try again.'); },
            onFinish: () => setStatus((s) => (s === 'sending' ? 'idle' : s)),
        });
    };

    if (status === 'done') {
        return (
            <div role="status" className="tp-slide-up mt-4 flex items-center gap-2 rounded-xl bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                You’re in. Watch your inbox.
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate className="mt-4">
            <div className={`flex items-center gap-2 rounded-full border bg-white/5 p-1 pl-4 transition focus-within:bg-white/10 ${invalid || error ? 'border-red-400/70' : 'border-white/10 focus-within:border-[#5BA3DB]'}`}>
                <Mail className="h-4 w-4 shrink-0 text-[#5BA3DB]" strokeWidth={2} />
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onBlur={() => setTouched(true)}
                    placeholder="Your email"
                    autoComplete="email"
                    aria-invalid={invalid || !!error}
                    className="w-full border-0 bg-transparent p-0 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0"
                />
                <button
                    type="submit"
                    disabled={status === 'sending' || email === ''}
                    className="group flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A599E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d6ab8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB]"
                >
                    {status === 'sending' ? 'Joining…' : 'Join'}
                    <ArrowRight className="h-3 w-3 transition-transform group-enabled:group-hover:translate-x-0.5" strokeWidth={2.5} />
                </button>
            </div>
            {(error || invalid) && <p role="alert" className="mt-2 pl-4 text-xs text-red-400">{error || 'Enter a full email, like name@example.com.'}</p>}
        </form>
    );
}

export default function Footer() {
    return (
        <footer className="relative mt-20 bg-slate-950 text-white">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0A599E] to-transparent" />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-4">
                        <Link href="/" className="inline-block text-xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB]">
                            Trend<span className="text-[#5BA3DB]">Pulse</span>
                        </Link>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                            Real stories, real people and real conversations.
                        </p>
                        <div className="mt-5 flex items-center gap-2">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.key}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:bg-[#0A599E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB]"
                                >
                                    {SOCIAL_ICONS[s.key]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {COLUMNS.map((col) => (
                        <nav key={col.title} className="md:col-span-2" aria-label={col.title}>
                            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className={linkCls}>{l.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    {/* Newsletter */}
                    <div className="md:col-span-4">
                        <h3 className="text-sm font-semibold text-white">Get the best stories</h3>
                        <p className="mt-1.5 text-sm text-slate-400">One email a week. Unsubscribe anytime.</p>
                        <Newsletter />
                    </div>
                </div>

                <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
                    <p>&copy; {new Date().getFullYear()} TrendPulse. All rights reserved.</p>
                    <div className="flex gap-5">
                        {[['About', '/about'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([n, h]) => (
                            <Link key={n} href={h} className="transition hover:text-[#5BA3DB] focus:outline-none focus-visible:text-[#5BA3DB] focus-visible:underline">{n}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}