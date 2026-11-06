import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

/**
 * Each slide pairs an image with its own headline/copy. Text and image change
 * together. Pass a custom `slides` prop or drop photos at these paths.
 */
const HERO_SLIDES = [
    {
        image: '/assets/images/hero/love-story.jpg',
        eyebrow: 'Love stories',
        title: 'Two lives,\none story.',
        text: 'Real couples, real moments. The quiet, unscripted love stories that remind us what connection looks like.',
    },
    {
        image: '/assets/images/hero/reunion.jpg',
        eyebrow: 'Reunions',
        title: 'Years apart,\none moment.',
        text: 'Unexpected reunions between people who never stopped hoping, captured the instant they found each other again.',
    },
    {
        image: '/assets/images/hero/journey.jpg',
        eyebrow: 'Human journeys',
        title: 'Every path\nhas a story.',
        text: 'Journeys of resilience and change, told by the people who lived them. No script, just truth.',
    },
    {
        image: '/assets/images/hero/testimony.jpg',
        eyebrow: 'Testimonies',
        title: 'Words that\nstay with you.',
        text: 'Powerful testimonies from around the world, researched and narrated with the care every story deserves.',
    },
];

const DURATION = 6000;

export default function Hero({ slides = HERO_SLIDES }) {
    const n = slides.length;
    const [active, setActive] = useState(0);
    const [cycle, setCycle] = useState(0); // bumps on manual change so the progress bar restarts
    const [userPaused, setUserPaused] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [broken, setBroken] = useState({});
    const touchX = useRef(null);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);
        const onChange = (e) => setReduceMotion(e.matches);
        mq.addEventListener?.('change', onChange);
        const onVis = () => setTabHidden(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => {
            mq.removeEventListener?.('change', onChange);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    const playing = n > 1 && !userPaused && !hovering && !tabHidden && !reduceMotion;

    const go = (i) => {
        setActive(((i % n) + n) % n);
        setCycle((c) => c + 1);
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    };

    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    };

    const current = slides[active];
    const pad = (v) => String(v).padStart(2, '0');

    const roundBtn =
        'flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]';

    return (
        <section
            className="bg-white"
            aria-roledescription="carousel"
            aria-label="Featured stories"
            onKeyDown={onKeyDown}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <style>{`
                @keyframes tp-progress { from{transform:scaleX(0)} to{transform:scaleX(1)} }
                @keyframes tp-hero-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
                .tp-hero-in{animation:tp-hero-in .55s cubic-bezier(.2,.7,.2,1) both}
                .tp-hero-in > *:nth-child(2){animation-delay:.06s}
                .tp-hero-in > *:nth-child(3){animation-delay:.12s}
                @media (prefers-reduced-motion: reduce){ .tp-hero-in,.tp-hero-in > *{animation:none} }
            `}</style>

            <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
                {/* Copy */}
                <div className="order-2 lg:order-1 lg:col-span-5">
                    <div key={active} className="tp-hero-in" aria-live={playing ? 'off' : 'polite'}>
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#0A599E]/10 px-3 py-1 text-xs font-semibold text-[#0A599E]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                            {current.eyebrow}
                        </p>

                        <h1 className="mt-4 whitespace-pre-line text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
                            {current.title}
                        </h1>

                        <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-500">{current.text}</p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/youtube"
                            className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#0A599E] px-6 text-sm font-semibold text-white transition hover:bg-[#07406F] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2"
                        >
                            Watch stories
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                        </Link>
                        <Link
                            href="/share-your-story"
                            className="inline-flex h-11 items-center rounded-full border border-slate-200 px-6 text-sm font-semibold text-slate-800 transition hover:border-slate-900 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2"
                        >
                            Share your story
                        </Link>
                    </div>

                    {/* Progress indicators: also drive the autoplay timing */}
                    {n > 1 && (
                        <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Choose a story">
                            {slides.map((s, i) => (
                                <button
                                    key={s.image}
                                    type="button"
                                    role="tab"
                                    aria-selected={i === active}
                                    aria-label={s.eyebrow}
                                    title={s.eyebrow}
                                    onClick={() => go(i)}
                                    className="group relative h-6 w-full max-w-[64px] focus:outline-none"
                                >
                                    <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200 transition-all group-hover:h-1.5 group-focus-visible:ring-2 group-focus-visible:ring-[#0A599E] group-focus-visible:ring-offset-2">
                                        {i < active || (i === active && reduceMotion) ? (
                                            <span className="absolute inset-0 rounded-full bg-[#0A599E]" />
                                        ) : i === active ? (
                                            <span
                                                key={`${active}-${cycle}`}
                                                className="absolute inset-0 origin-left rounded-full bg-[#0A599E]"
                                                style={{
                                                    animation: `tp-progress ${DURATION}ms linear forwards`,
                                                    animationPlayState: playing ? 'running' : 'paused',
                                                }}
                                                onAnimationEnd={() => go(active + 1)}
                                            />
                                        ) : null}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Image */}
                <div className="order-1 lg:order-2 lg:col-span-7">
                    <div
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 lg:aspect-[16/11]"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        {slides.map((s, i) =>
                            broken[s.image] ? null : (
                                <img
                                    key={s.image}
                                    src={s.image}
                                    alt={i === active ? s.eyebrow : ''}
                                    aria-hidden={i !== active}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    onError={() => setBroken((b) => ({ ...b, [s.image]: true }))}
                                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-1000 ease-out ${
                                        i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                                    }`}
                                />
                            ),
                        )}

                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

                        {/* Slide label + count */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 sm:bottom-5 sm:left-5">
                            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 backdrop-blur">
                                {current.eyebrow}
                            </span>
                            {n > 1 && (
                                <span className="rounded-full bg-black/40 px-2.5 py-1.5 text-xs font-medium tabular-nums text-white backdrop-blur">
                                    {pad(active + 1)} / {pad(n)}
                                </span>
                            )}
                        </div>

                        {/* Controls */}
                        {n > 1 && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-5 sm:right-5">
                                <button
                                    type="button"
                                    onClick={() => setUserPaused((v) => !v)}
                                    aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                                    className={roundBtn}
                                >
                                    {userPaused ? <Play className="h-4 w-4" fill="currentColor" /> : <Pause className="h-4 w-4" fill="currentColor" />}
                                </button>
                                <button type="button" onClick={() => go(active - 1)} aria-label="Previous story" className={`${roundBtn} hidden sm:flex`}>
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button type="button" onClick={() => go(active + 1)} aria-label="Next story" className={`${roundBtn} hidden sm:flex`}>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}