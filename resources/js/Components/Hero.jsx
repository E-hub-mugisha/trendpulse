import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Hero({
    videoId = 'dQw4w9WgXcQ',
    posterImage = '/assets/images/hero-poster.jpg',
}) {
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <section className="relative overflow-hidden bg-black text-white">

            {/* Background media */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">

                {/* Poster image — always rendered underneath, visible until/unless video loads */}
                <img
                    src={posterImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-hidden="true"
                />

                {/* Video — fades in on top once loaded; stays hidden if blocked/fails */}
                <div
                    className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${
                        videoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1`}
                        title="Background video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen={false}
                        tabIndex={-1}
                        onLoad={() => setVideoLoaded(true)}
                    />
                </div>

            </div>

            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Glow accents (kept on top of the dark overlay, under content) */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#0A599E] blur-[120px]" />
                <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-[#0A599E]/60 blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">

                <div className="max-w-4xl">

                    <div className="mb-7 inline-flex rounded-full border border-[#0A599E]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5BA3DB]">
                        Stories • People • Community
                    </div>

                    <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                        Real stories.
                        <br />
                        Real people.
                        <br />
                        <span className="text-[#5BA3DB]">
                            Real conversations.
                        </span>
                    </h1>

                    <p className="mt-8 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                        Discover stories that inspire, entertainment that
                        connects us, and conversations from a community
                        with something to say.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">

                        <Link
                            href="/youtube"
                            className="rounded-full bg-[#0A599E] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0d6ab8]"
                        >
                            Watch Stories
                        </Link>

                        <Link
                            href="/share-your-story"
                            className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                            Share Your Story
                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
}