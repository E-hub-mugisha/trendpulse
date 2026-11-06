import { useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import PeopleStoryCard from '../../../Components/PeopleStoryCard';

/* -------------------------------------------------------------------------
 | Small helpers
 ------------------------------------------------------------------------- */

const Svg = ({ children, className = 'h-3.5 w-3.5' }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const EyeIcon = () => (
    <Svg>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </Svg>
);

const ArrowIcon = () => (
    <Svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
);

const ChevronLeft = () => (
    <Svg>
        <path d="M15 18l-6-6 6-6" />
    </Svg>
);

const ChevronRight = () => (
    <Svg>
        <path d="M9 18l6-6-6-6" />
    </Svg>
);

function SectionHeader({ title, viewAllHref, children }) {
    return (
        <div className="relative mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold tracking-tight text-black">
                {title}
            </h2>

            <span className="absolute -bottom-px left-0 h-[2px] w-14 bg-[#0A599E]" />

            <div className="flex items-center gap-3">
                {children}

                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-[#0A599E]"
                    >
                        View all
                        <ArrowIcon />
                    </Link>
                )}
            </div>
        </div>
    );
}

function StoryListRow({ story, rank }) {
    return (
        <Link
            href={`/people/${story.slug}`}
            className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3.5 transition hover:bg-[#0A599E]/5"
        >
            <span className="w-7 shrink-0 text-xl font-semibold tabular-nums text-gray-300 transition group-hover:text-[#0A599E]">
                {String(rank).padStart(2, '0')}
            </span>

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#0A599E]/20 to-[#07406F]/30">
                {story.featured_image ? (
                    <img
                        src={story.featured_image}
                        alt={story.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-medium text-[#0A599E]">
                        Story
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#0A599E]">
                    {story.category || 'Relationship'}
                </p>

                <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-5 text-black transition group-hover:text-[#0A599E]">
                    {story.title}
                </h3>

                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                    <EyeIcon />
                    {(story.views ?? 0).toLocaleString()} views
                </p>
            </div>
        </Link>
    );
}

function TrendingCard({ story, rank }) {
    return (
        <Link
            href={`/people/${story.slug}`}
            className="group w-[230px] shrink-0 snap-start"
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A599E]/20 to-[#07406F]/30">
                {story.featured_image ? (
                    <img
                        src={story.featured_image}
                        alt={story.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-[#0A599E]">
                        Story
                    </div>
                )}

                <span className="absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-black/75 px-2 text-[11px] font-semibold tabular-nums text-white backdrop-blur">
                    {rank}
                </span>
            </div>

            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#0A599E]">
                {story.category || 'Relationship'}
            </p>

            <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-black transition group-hover:text-[#0A599E]">
                {story.title}
            </h3>

            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                <EyeIcon />
                {(story.views ?? 0).toLocaleString()} views
            </p>
        </Link>
    );
}

/* -------------------------------------------------------------------------
 | Page
 ------------------------------------------------------------------------- */

export default function Index({
    featured,
    latest = [],
    trending = [],
    mostViewed = [],
    popular = [],
    categories = [],
    activeCategory,
}) {
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState(null);
    const scrollerRef = useRef(null);

    const current = loading ? target : activeCategory ?? null;

    const switchCategory = (slug) => {
        if (slug === (activeCategory ?? null)) return;

        router.get(
            '/people',
            slug ? { category: slug } : {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onStart: () => {
                    setTarget(slug);
                    setLoading(true);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const categoryHref = (slug) => (slug ? `/people?category=${slug}` : '/people');

    const scrollTrending = (dir) => {
        scrollerRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });
    };

    const pill = (active) =>
        `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
            active
                ? 'bg-[#0A599E] text-white shadow-md shadow-[#0A599E]/25'
                : 'border border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-[#0A599E] hover:text-[#0A599E]'
        }`;

    return (
        <PublicLayout title="People">
            <style>{`
                @keyframes pp-fade {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: none; }
                }
                @keyframes pp-load {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
                .pp-fade { animation: pp-fade 0.35s ease both; }
                .pp-scroll::-webkit-scrollbar { display: none; }
                .pp-scroll { scrollbar-width: none; }
                @media (prefers-reduced-motion: reduce) {
                    .pp-fade { animation: none; }
                }
            `}</style>

            {/* Loading bar */}
            {loading && (
                <div className="fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden bg-[#0A599E]/15">
                    <div
                        className="h-full w-2/5 bg-[#0A599E]"
                        style={{ animation: 'pp-load 1s ease-in-out infinite' }}
                    />
                </div>
            )}

            <div className="bg-gradient-to-b from-[#0A599E]/[0.05] via-white to-white">
                <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
                    <SectionHeading
                        eyebrow="People"
                        title="Real people. Real experiences."
                        description="Stories about relationships, love, family and life."
                    />

                    {/* =================================================
                        CATEGORY FILTER
                    ================================================= */}

                    <div className="mb-10 mt-8">
                        <div
                            className="pp-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                            role="group"
                            aria-label="Filter stories by category"
                        >
                            <button
                                type="button"
                                onClick={() => switchCategory(null)}
                                aria-pressed={!current}
                                className={pill(!current)}
                            >
                                All stories
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => switchCategory(category.slug)}
                                    aria-pressed={current === category.slug}
                                    className={pill(current === category.slug)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`transition-opacity duration-300 ${
                            loading ? 'pointer-events-none opacity-50' : 'opacity-100'
                        }`}
                    >
                        {/* =================================================
                            EMPTY STATE
                        ================================================= */}

                        {!featured && (
                            <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-[#0A599E]/25 bg-white/70 px-8 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A599E]/10 text-[#0A599E]">
                                    <Svg className="h-6 w-6">
                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
                                    </Svg>
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-black">
                                    No stories here yet
                                </h3>

                                <p className="mt-2 text-[13px] text-gray-500">
                                    Nothing has been published in this section so far.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                    {activeCategory && (
                                        <button
                                            type="button"
                                            onClick={() => switchCategory(null)}
                                            className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-medium text-gray-700 transition hover:border-[#0A599E] hover:text-[#0A599E]"
                                        >
                                            Show all stories
                                        </button>
                                    )}

                                    <Link
                                        href="/share-your-story"
                                        className="rounded-full bg-[#0A599E] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#07406F]"
                                    >
                                        Share your story
                                    </Link>
                                </div>
                            </div>
                        )}

                        {featured && (
                            <>
                                {/* =================================================
                                    FEATURED (compact horizontal card)
                                ================================================= */}

                                <Link
                                    href={`/people/${featured.slug}`}
                                    className="group mb-14 flex flex-col overflow-hidden rounded-3xl border border-[#0A599E]/15 bg-[#EAF1F8]/60 transition duration-300 hover:border-[#0A599E]/40 hover:shadow-xl hover:shadow-[#0A599E]/10 sm:flex-row sm:items-stretch"
                                >
                                    <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-[#07406F] to-[#0A599E] sm:h-auto sm:w-[260px] md:w-[300px]">
                                        {featured.featured_image ? (
                                            <img
                                                src={featured.featured_image}
                                                alt={featured.title}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105 sm:absolute sm:inset-0"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs font-medium text-white/80">
                                                Story
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A599E] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                            Featured
                                        </span>

                                        <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-[#0A599E]">
                                            {featured.category || 'Relationship'}
                                        </p>

                                        <h2 className="mt-1.5 text-xl font-semibold leading-snug tracking-tight text-black transition group-hover:text-[#0A599E] sm:text-2xl">
                                            {featured.title}
                                        </h2>

                                        {featured.excerpt && (
                                            <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-gray-600">
                                                {featured.excerpt}
                                            </p>
                                        )}

                                        <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#07406F] transition group-hover:gap-3">
                                            Read their story
                                            <ArrowIcon />
                                        </span>
                                    </div>
                                </Link>

                                {/* =================================================
                                    TRENDING (horizontal scroller)
                                ================================================= */}

                                {trending?.length > 0 && (
                                    <div className="mb-14">
                                        <SectionHeader title="Trending now">
                                            <div className="hidden gap-2 sm:flex">
                                                <button
                                                    type="button"
                                                    onClick={() => scrollTrending(-1)}
                                                    aria-label="Scroll trending left"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#0A599E] hover:bg-[#0A599E] hover:text-white"
                                                >
                                                    <ChevronLeft />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => scrollTrending(1)}
                                                    aria-label="Scroll trending right"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#0A599E] hover:bg-[#0A599E] hover:text-white"
                                                >
                                                    <ChevronRight />
                                                </button>
                                            </div>
                                        </SectionHeader>

                                        <div
                                            ref={scrollerRef}
                                            className="pp-scroll -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
                                        >
                                            {trending.map((story, i) => (
                                                <TrendingCard
                                                    key={story.id}
                                                    story={story}
                                                    rank={i + 1}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    LATEST STORIES
                                ================================================= */}

                                {latest?.length > 0 && (
                                    <div className="mb-14">
                                        <SectionHeader
                                            title="Latest stories"
                                            viewAllHref={categoryHref(activeCategory)}
                                        />

                                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                                            {latest.map((story) => (
                                                <div
                                                    key={story.id}
                                                    className="pp-fade transition duration-300 hover:-translate-y-1"
                                                >
                                                    <PeopleStoryCard story={story} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    MOST VIEWED + POPULAR
                                ================================================= */}

                                {(mostViewed?.length > 0 || popular?.length > 0) && (
                                    <div className="mb-14 grid gap-12 lg:grid-cols-2">
                                        {mostViewed?.length > 0 && (
                                            <div>
                                                <SectionHeader title="Most viewed" />

                                                <div className="divide-y divide-gray-100">
                                                    {mostViewed.map((story, i) => (
                                                        <StoryListRow
                                                            key={story.id}
                                                            story={story}
                                                            rank={i + 1}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {popular?.length > 0 && (
                                            <div>
                                                <SectionHeader title="Popular" />

                                                <div className="divide-y divide-gray-100">
                                                    {popular.map((story, i) => (
                                                        <StoryListRow
                                                            key={story.id}
                                                            story={story}
                                                            rank={i + 1}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* =================================================
                                    SHARE YOUR STORY CTA
                                ================================================= */}

                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A599E] to-[#07406F] px-7 py-10 text-white shadow-xl shadow-[#0A599E]/20 sm:px-12 sm:py-12">
                                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-black/20 blur-3xl" />

                                    <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                                        <div className="max-w-xl">
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                                                Your voice matters
                                            </p>

                                            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                                Have a story of your own?
                                            </h2>

                                            <p className="mt-2 text-[13px] leading-6 text-white/80">
                                                A relationship, a turning point, a lesson
                                                learned. Your experience could be exactly what
                                                someone else needs to read today.
                                            </p>
                                        </div>

                                        <Link
                                            href="/share-your-story"
                                            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium text-[#07406F] transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            Share your story
                                            <ArrowIcon />
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}