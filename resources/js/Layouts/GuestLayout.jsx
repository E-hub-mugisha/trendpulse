import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6fb] px-4 py-8">
            <style>{`
                @keyframes tp-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(2px)} }
                @keyframes tp-fade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
                .tp-shake{animation:tp-shake .4s ease-in-out}
                .tp-fade{animation:tp-fade .2s ease-out}
                @media (prefers-reduced-motion: reduce){ .tp-shake,.tp-fade{animation:none} }
            `}</style>

            <Link
                href="/"
                className="mb-6 flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f6fb]"
            >
                <img src="/assets/images/logo.png" alt="" className="h-8 w-auto" />
                <span className="text-base font-extrabold tracking-tight text-slate-900">TrendPulse</span>
            </Link>

            <main className="w-full max-w-sm">{children}</main>

            <p className="mt-6 text-[11px] text-slate-400">
                &copy; {new Date().getFullYear()} TrendPulse
            </p>
        </div>
    );
}