import { Link } from '@inertiajs/react';

export default function ShareStoryCTA() {
    return (
        <section className="relative overflow-hidden bg-black text-white">

            <div className="absolute inset-x-0 top-0 h-1 bg-[#0A599E]" />

            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

                    <div className="max-w-3xl">

                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5BA3DB]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                            Your voice matters
                        </p>

                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                            Everyone has a story.
                            <br />
                            What's yours?
                        </h2>

                        <p className="mt-5 max-w-xl text-gray-400">
                            Share your experience, relationship,
                            journey or lesson with the TrendPulse community.
                        </p>

                    </div>

                    <Link
                        href="/share-your-story"
                        className="inline-flex shrink-0 rounded-full bg-[#0A599E] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0d6ab8]"
                    >
                        Share Your Story →
                    </Link>

                </div>

            </div>

        </section>
    );
}