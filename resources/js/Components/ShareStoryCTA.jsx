import { Link } from '@inertiajs/react';

export default function ShareStoryCTA() {
    return (
        <section className="bg-black text-white">

            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

                    <div className="max-w-3xl">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
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
                        className="inline-flex shrink-0 rounded-full bg-white px-7 py-4 text-sm font-bold text-black"
                    >
                        Share Your Story →
                    </Link>

                </div>

            </div>

        </section>
    );
}
