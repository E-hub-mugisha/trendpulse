import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import NewsCard from '../../../Components/NewsCard';

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

function SectionHeader({ title, viewAllHref }) {
    return (
        <div className="relative mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold tracking-tight text-black">
                {title}
            </h2>

            <span className="absolute -bottom-px left-0 h-[2px] w-14 bg-[#0A599E]" />

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
    );
}

function PostListRow({ post, rank }) {
    return (
        <Link
            href={`/entertainment/${post.slug}`}
            className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3.5 transition hover:bg-[#0A599E]/5"
        >
            <span className="w-7 shrink-0 text-xl font-semibold tabular-nums text-gray-300 transition group-hover:text-[#0A599E]">
                {String(rank).padStart(2, '0')}
            </span>

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#0A599E]/20 to-[#07406F]/30">
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-medium text-[#0A599E]">
                        Post
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#0A599E]">
                    {post.category || 'Entertainment'}
                </p>

                <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-5 text-black transition group-hover:text-[#0A599E]">
                    {post.title}
                </h3>

                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                    <EyeIcon />
                    {(post.views ?? 0).toLocaleString()} views
                </p>
            </div>
        </Link>
    );
}

function TrendingTile({ post, rank }) {
    return (
        <Link
            href={`/entertainment/${post.slug}`}
            className="group block"
        >
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A599E]/30 to-[#07406F]/50">
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-white/80">
                        Post
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <span className="absolute bottom-2 left-3 text-3xl font-semibold leading-none text-white drop-shadow">
                    {rank}
                </span>
            </div>

            <h3 className="mt-3 line-clamp-2 text-[13px] font-semibold leading-5 text-black transition group-hover:text-[#0A599E]">
                {post.title}
            </h3>

            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                <EyeIcon />
                {(post.views ?? 0).toLocaleString()} views
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

    const current = loading ? target : activeCategory ?? null;

    const switchCategory = (slug) => {
        if (slug === (activeCategory ?? null)) return;

        router.get(
            '/entertainment',
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

    const categoryHref = (slug) =>
        slug ? `/entertainment?category=${slug}` : '/entertainment';

    const pill = (active) =>
        `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
            active
                ? 'bg-[#0A599E] text-white shadow-md shadow-[#0A599E]/25'
                : 'border border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-[#0A599E] hover:text-[#0A599E]'
        }`;

    return (
        <PublicLayout title="Entertainment">
            <style>{`
                @keyframes en-fade {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: none; }
                }
                @keyframes en-load {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
                .en-fade { animation: en-fade 0.35s ease both; }
                .en-scroll::-webkit-scrollbar { display: none; }
                .en-scroll { scrollbar-width: none; }
                @media (prefers-reduced-motion: reduce) {
                    .en-fade { animation: none; }
                }
            `}</style>

            {loading && (
                <div className="fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden bg-[#0A599E]/15">
                    <div
                        className="h-full w-2/5 bg-[#0A599E]"
                        style={{ animation: 'en-load 1s ease-in-out infinite' }}
                    />
                </div>
            )}

            <div className="bg-gradient-to-b from-[#0A599E]/[0.05] via-white to-white">
                <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
                    <SectionHeading
                        eyebrow="Entertainment"
                        title="What's happening"
                        description="Entertainment, lifestyle, culture and trending stories."
                    />

                    {/* Category filter */}
                    <div className="mb-10 mt-8">
                        <div
                            className="en-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                            role="group"
                            aria-label="Filter posts by category"
                        >
                            <button
                                type="button"
                                onClick={() => switchCategory(null)}
                                aria-pressed={!current}
                                className={pill(!current)}
                            >
                                All
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
                        {/* Empty state */}
                        {!featured && (
                            <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-[#0A599E]/25 bg-white/70 px-8 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A599E]/10 text-[#0A599E]">
                                    <Svg className="h-6 w-6">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <path d="M8 21h8M12 17v4" />
                                    </Svg>
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-black">
                                    No posts here yet
                                </h3>

                                <p className="mt-2 text-[13px] text-gray-500">
                                    Nothing has been published in this section so far.
                                </p>

                                {activeCategory && (
                                    <button
                                        type="button"
                                        onClick={() => switchCategory(null)}
                                        className="mt-6 rounded-full bg-[#0A599E] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#07406F]"
                                    >
                                        Show all posts
                                    </button>
                                )}
                            </div>
                        )}

                        {featured && (
                            <>
                                {/* =================================================
                                    FEATURED (dark compact card, image on the right)
                                ================================================= */}

                                <Link
                                    href={`/entertainment/${featured.slug}`}
                                    className="group relative mb-14 flex flex-col-reverse overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#0b1c2c] to-[#07406F] text-white shadow-xl shadow-[#0A599E]/10 transition duration-300 hover:shadow-2xl hover:shadow-[#0A599E]/20 sm:flex-row sm:items-stretch"
                                >
                                    <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#0A599E]/30 blur-3xl" />

                                    <div className="relative flex flex-1 flex-col justify-center p-6 sm:p-9">
                                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A599E] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                            Featured
                                        </span>

                                        <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-[#7cc0f5]">
                                            {featured.category || 'Entertainment'}
                                        </p>

                                        <h2 className="mt-1.5 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                                            {featured.title}
                                        </h2>

                                        {featured.excerpt && (
                                            <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-white/70">
                                                {featured.excerpt}
                                            </p>
                                        )}

                                        <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-white transition group-hover:gap-3">
                                            Read more
                                            <ArrowIcon />
                                        </span>
                                    </div>

                                    <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-[#07406F] to-[#0A599E] sm:h-auto sm:w-[260px] md:w-[320px]">
                                        {featured.featured_image ? (
                                            <img
                                                src={featured.featured_image}
                                                alt={featured.title}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105 sm:absolute sm:inset-0"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs font-medium text-white/80">
                                                Post
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* =================================================
                                    TRENDING (ranked tiles)
                                ================================================= */}

                                {trending?.length > 0 && (
                                    <div className="mb-14">
                                        <SectionHeader title="Trending now" />

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-5">
                                            {trending.slice(0, 5).map((post, i) => (
                                                <div key={post.id} className="en-fade">
                                                    <TrendingTile post={post} rank={i + 1} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    LATEST
                                ================================================= */}

                                {latest?.length > 0 && (
                                    <div className="mb-14">
                                        <SectionHeader
                                            title="Latest"
                                            viewAllHref={categoryHref(activeCategory)}
                                        />

                                        <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                                            {latest.map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="en-fade transition duration-300 hover:-translate-y-1"
                                                >
                                                    <NewsCard post={post} />
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
                                                    {mostViewed.map((post, i) => (
                                                        <PostListRow
                                                            key={post.id}
                                                            post={post}
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
                                                    {popular.map((post, i) => (
                                                        <PostListRow
                                                            key={post.id}
                                                            post={post}
                                                            rank={i + 1}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Cross-link to People */}
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A599E] to-[#07406F] px-7 py-9 text-white shadow-xl shadow-[#0A599E]/20 sm:px-12">
                                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

                                    <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                                        <div className="max-w-lg">
                                            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                                                Looking for something more personal?
                                            </h2>

                                            <p className="mt-1.5 text-[13px] leading-6 text-white/80">
                                                Read real stories about relationships, love,
                                                family and life from people like you.
                                            </p>
                                        </div>

                                        <Link
                                            href="/people"
                                            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium text-[#07406F] transition hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            Read people stories
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