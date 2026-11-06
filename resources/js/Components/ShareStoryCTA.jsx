import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const TOPICS = [
    { label: 'Love and relationships', slug: 'relationships' },
    { label: 'Reunions', slug: 'reunions' },
    { label: 'Life journeys', slug: 'journeys' },
    { label: 'Lessons learned', slug: 'lessons' },
    { label: 'Testimonies', slug: 'testimonies' },
];

export default function ShareStoryCTA() {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A599E] px-6 py-12 text-white sm:px-12 sm:py-16">
                {/* Soft decorative rings */}
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/10" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#07406F]/60" />

                <div className="relative grid items-center gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Your voice matters
                        </p>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">
                            Everyone has a story.
                            <br />
                            What’s yours?
                        </h2>
                        <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/80">
                            Share your experience, relationship, journey or lesson with the TrendPulse community. It only takes a few minutes.
                        </p>

                        <Link
                            href="/share-your-story"
                            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#0A599E] shadow-lg shadow-black/10 transition hover:bg-slate-100 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A599E]"
                        >
                            Share your story
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                        </Link>
                    </div>

                    <div className="lg:col-span-5">
                        <p className="text-sm font-semibold text-white/90">Not sure where to start? Pick a topic</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {TOPICS.map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/share-your-story?topic=${t.slug}`}
                                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    {t.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}