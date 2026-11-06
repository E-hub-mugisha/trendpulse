import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, title = 'TrendPulse' }) {
    const bar = useRef(null);
    const [showTop, setShowTop] = useState(false);

    // Reading progress bar + back-to-top visibility (no re-render per scroll tick)
    useEffect(() => {
        let ticking = false;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const y = window.scrollY;
            if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
            setShowTop(y > 700);
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const toTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <>
            <Head title={title} />

            <style>{`
                @keyframes tp-pop-in { from{opacity:0;transform:translateY(-6px) scale(.98)} to{opacity:1;transform:none} }
                @keyframes tp-fade-in { from{opacity:0} to{opacity:1} }
                @keyframes tp-slide-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
                .tp-pop-in{animation:tp-pop-in .16s ease-out}
                .tp-fade-in{animation:tp-fade-in .18s ease-out}
                .tp-slide-up{animation:tp-slide-up .2s ease-out}
                @media (prefers-reduced-motion: reduce){ .tp-pop-in,.tp-fade-in,.tp-slide-up{animation:none} html{scroll-behavior:auto} }
            `}</style>

            <a
                href="#main"
                className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-[#0A599E] px-3 py-2 text-xs font-semibold text-white transition focus:translate-y-0 focus:outline-none"
            >
                Skip to content
            </a>

            {/* Reading progress */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5" aria-hidden="true">
                <div ref={bar} className="h-full origin-left bg-[#0A599E]" style={{ transform: 'scaleX(0)' }} />
            </div>

            <div className="min-h-screen bg-[#f7f8fa] text-slate-900 antialiased">
                <Navbar />

                <main id="main" tabIndex={-1} className="focus:outline-none">
                    {children}
                </main>

                <Footer />
            </div>

            <button
                type="button"
                onClick={toTop}
                aria-label="Back to top"
                tabIndex={showTop ? 0 : -1}
                className={`fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A599E] text-white shadow-lg shadow-[#0A599E]/30 transition duration-200 hover:bg-[#07406F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2 ${
                    showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
                }`}
            >
                <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
            </button>
        </>
    );
}