import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Each slide pairs an image with its own headline/copy — text and image
 * change together. Download matching photos from Freepik/Unsplash and
 * drop them at these paths (or pass a custom `slides` prop).
 */
const HERO_SLIDES = [
    {
        image: '/assets/images/hero/love-story.jpg',
        eyebrow: 'Love stories',
        title: 'Two lives,\none story.',
        text: 'Real couples, real moments — the quiet, unscripted love stories that remind us what connection actually looks like.',
    },
    {
        image: '/assets/images/hero/reunion.jpg',
        eyebrow: 'Reunions',
        title: 'Years apart,\none moment.',
        text: 'Unexpected reunions between people who never stopped hoping — captured the instant they found their way back to each other.',
    },
    {
        image: '/assets/images/hero/journey.jpg',
        eyebrow: 'Human journeys',
        title: 'Every path\nhas a story.',
        text: 'Extraordinary journeys of resilience and change, told by the people who lived them — no script, just truth.',
    },
    {
        image: '/assets/images/hero/testimony.jpg',
        eyebrow: 'Testimonies',
        title: 'Words that\nstay with you.',
        text: 'Powerful testimonies from around the world, researched and narrated with the care every story deserves.',
    },
];

export default function Hero({ slides = HERO_SLIDES }) {
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timerRef.current);
    }, [slides.length]);

    const goTo = (index) => {
        clearInterval(timerRef.current);
        setActive(index);
        timerRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 6000);
    };

    const current = slides[active];

    return (
        <section className="bg-white">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:py-28 lg:px-8">

                {/* LEFT — content, keyed to the active slide */}
                <div className="order-2 lg:order-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0A599E]">
                        {current.eyebrow}
                    </p>

                    <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        {current.title}
                    </h1>

                    <p className="mt-6 max-w-md text-base leading-7 text-gray-500 sm:text-lg">
                        {current.text}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/youtube"
                            className="rounded-full bg-[#0A599E] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#07406F]"
                        >
                            Watch Stories
                        </Link>

                        <Link
                            href="/share-your-story"
                            className="rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-900"
                        >
                            Share Your Story
                        </Link>
                    </div>

                    {/* Slide indicators */}
                    <div className="mt-14 flex items-center gap-3">
                        {slides.map((s, i) => (
                            <button
                                key={s.image}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to ${s.eyebrow}`}
                                className="group flex items-center gap-2"
                            >
                                <span
                                    className={`h-[2px] rounded-full transition-all duration-300 ${
                                        i === active ? 'w-8 bg-[#0A599E]' : 'w-4 bg-gray-300 group-hover:bg-gray-400'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT — image, crossfades with the active slide */}
                <div className="order-1 lg:order-2">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[4/5] lg:aspect-[3/4]">
                        {slides.map((s, i) => (
                            <img
                                key={s.image}
                                src={s.image}
                                alt={s.eyebrow}
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                                    i === active ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}

                        {/* Minimal accent — thin border ring, no glow/gradient */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />

                        {/* Slide label */}
                        <div className="absolute bottom-5 left-5">
                            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur">
                                {current.eyebrow}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}