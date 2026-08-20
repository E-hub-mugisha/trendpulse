import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

const PulseLine = ({ className = '' }) => (
    <svg
        viewBox="0 0 140 24"
        className={className}
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M0 12H32L38 3L46 21L54 12H72L78 5L84 19L90 12H140"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const PlayButton = () => (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-[#0A599E]">
            <path d="M8 5v14l11-7z" />
        </svg>
    </div>
);

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Us" />

            {/* Hero */}
            <section className="bg-black text-white">
                <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">

                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0A599E]">
                            TrendPulse
                        </p>

                        <PulseLine className="mt-4 h-5 w-32 text-[#0A599E]" />

                        <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                            Every story
                            <br />
                            has a pulse.
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                            Real people, real moments — the stories, shows and
                            conversations your community can't stop talking
                            about.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                href="/share-your-story"
                                className="rounded-full bg-[#0A599E] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#084a85]"
                            >
                                Share Your Story
                            </Link>

                            <a
                                href="#watch"
                                className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Watch Stories
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
                            <img
                                src="https://images.pexels.com/photos/7550397/pexels-photo-7550397.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="TrendPulse community members sharing a moment together"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-5 -left-5 rounded-2xl bg-[#0A599E] px-5 py-4 text-white shadow-xl">
                            <p className="text-2xl font-black leading-none">1</p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-wider">
                                community, endless stories
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Word strip */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 lg:px-8">
                    <span>Stories</span>
                    <span className="text-[#0A599E]">•</span>
                    <span>Entertainment</span>
                    <span className="text-[#0A599E]">•</span>
                    <span>People</span>
                    <span className="text-[#0A599E]">•</span>
                    <span>Community</span>
                </div>
            </div>

            {/* Who We Are */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                                Who We Are
                            </p>

                            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                                Everyone has a story worth hearing.
                            </h2>

                            <p className="mt-5 leading-8 text-gray-600">
                                TrendPulse brings the stories, shows and
                                conversations that matter into one place — so
                                your voice finds its audience.
                            </p>

                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <div className="border-t-2 border-[#0A599E] pt-3">
                                    <p className="text-xs font-bold text-[#0A599E]">01</p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">Stories</p>
                                </div>
                                <div className="border-t-2 border-[#0A599E] pt-3">
                                    <p className="text-xs font-bold text-[#0A599E]">02</p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">Entertainment</p>
                                </div>
                                <div className="border-t-2 border-[#0A599E] pt-3">
                                    <p className="text-xs font-bold text-[#0A599E]">03</p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">Community</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[2rem]">
                            <img
                                src="https://images.pexels.com/photos/6995236/pexels-photo-6995236.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="Diverse group of friends sharing stories over coffee"
                                className="h-full w-full object-cover"
                            />
                        </div>

                    </div>

                </div>
            </section>

            {/* Watch & Read */}
            <section id="watch" className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="mb-10 max-w-xl">
                        <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                            What We Do
                        </p>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Watch it. Read it. Talk about it.
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="group relative overflow-hidden rounded-3xl">
                            <img
                                src="https://images.pexels.com/photos/12432832/pexels-photo-12432832.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="Creator filming a story for the TrendPulse YouTube channel"
                                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayButton />
                            </div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <p className="text-lg font-black text-white">YouTube Stories</p>
                                <p className="mt-1 text-sm text-white/80">
                                    New episodes every week on our channel.
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl">
                            <img
                                src="https://images.pexels.com/photos/8263318/pexels-photo-8263318.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="Friends enjoying entertainment together at the movies"
                                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayButton />
                            </div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <p className="text-lg font-black text-white">Entertainment</p>
                                <p className="mt-1 text-sm text-white/80">
                                    Reactions and reviews on what's trending.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* Moments gallery */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                                Moments
                            </p>
                            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                                Snapshots from the community.
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src="https://images.pexels.com/photos/6995237/pexels-photo-6995237.jpeg?auto=compress&cs=tinysrgb&w=700"
                                alt="Volunteers taking a break together"
                                className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src="https://images.pexels.com/photos/7495404/pexels-photo-7495404.jpeg?auto=compress&cs=tinysrgb&w=700"
                                alt="Community members brainstorming ideas together"
                                className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src="https://images.pexels.com/photos/8263321/pexels-photo-8263321.jpeg?auto=compress&cs=tinysrgb&w=700"
                                alt="Friends enjoying a movie night together"
                                className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                            />
                        </div>

                    </div>

                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

                    <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                        What Guides Us
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {['Authenticity', 'Community', 'Respect', 'Creativity'].map((label) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-900"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                                {label}
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/6995234/pexels-photo-6995234.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Community members gathered together"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/85" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24">

                    <PulseLine className="mx-auto h-5 w-32 text-[#0A599E]" />

                    <h2 className="mt-6 text-3xl font-black text-white sm:text-4xl">
                        Your story matters.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
                        Share an experience, or join a community that's
                        listening.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            href="/share-your-story"
                            className="rounded-full bg-[#0A599E] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#084a85]"
                        >
                            Share Your Story
                        </Link>

                        <Link
                            href="/community"
                            className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                            Join the Community
                        </Link>

                    </div>

                </div>

            </section>

        </PublicLayout>
    );
}
