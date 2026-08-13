import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-black text-white">

            <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white blur-[120px]" />
                <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-gray-500 blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">

                <div className="max-w-4xl">

                    <div className="mb-7 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        Stories • People • Community
                    </div>

                    <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                        Real stories.
                        <br />
                        Real people.
                        <br />
                        <span className="text-gray-500">
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
                            className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-gray-200"
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