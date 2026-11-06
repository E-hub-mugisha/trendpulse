import { Link } from '@inertiajs/react';
import { ArrowUpRight, Eye, Flame, Play, TrendingUp } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@TrendPulse_Global/featured';

/* ------------------------------ Helpers ------------------------------ */

function getYoutubeUrl(video) {
    if (video?.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
    return YOUTUBE_CHANNEL_URL;
}

function getThumbnail(video) {
    if (video?.thumbnail_url) return video.thumbnail_url;
    if (video?.youtube_id) return `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
    return '/images/youtube-placeholder.jpg';
}

function formatViews(views) {
    if (!views) return 'Watch now';
    return `${Number(views).toLocaleString()} views`;
}

const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2';

/* ------------------------------ Video card ------------------------------ */

function VideoCard({ video }) {
    return (
        <article className="group">
            <Link href={`/youtube/${video.slug}`} className={`block rounded-2xl ${ring}`}>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200">
                    <img
                        src={getThumbnail(video)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                    <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A599E] shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-[#0A599E] group-hover:text-white">
                        <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                    </span>
                </div>

                <div className="mt-3.5">
                    <p className="text-xs font-semibold text-[#0A599E]">{video.category || 'Story'}</p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-[#0A599E]">
                        {video.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                        {video.published_at && (
                            <>
                                <span>{video.published_at}</span>
                                <span aria-hidden="true">·</span>
                            </>
                        )}
                        <span className="inline-flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {formatViews(video.views)}
                        </span>
                    </p>
                </div>
            </Link>

            <a
                href={getYoutubeUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A599E] transition hover:text-[#07406F]"
            >
                Watch on YouTube <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
            </a>
        </article>
    );
}

/* ------------------------------ List row ------------------------------ */

function VideoListRow({ video, rank, dark = false }) {
    return (
        <div className={`group flex items-center gap-3 rounded-2xl p-2 transition ${dark ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}>
            <span className={`w-7 shrink-0 text-center text-lg font-extrabold tabular-nums transition ${dark ? 'text-white/40 group-hover:text-white' : 'text-slate-300 group-hover:text-[#0A599E]'}`}>
                {rank}
            </span>

            <Link href={`/youtube/${video.slug}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB]">
                <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:w-28">
                    <img
                        src={getThumbnail(video)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#0A599E]">
                            <Play className="ml-0.5 h-2.5 w-2.5" fill="currentColor" />
                        </span>
                    </span>
                </div>

                <div className="min-w-0">
                    <p className={`text-xs font-semibold ${dark ? 'text-[#9CCBF0]' : 'text-[#0A599E]'}`}>{video.category || 'Story'}</p>
                    <h3 className={`mt-0.5 line-clamp-2 text-sm font-bold leading-5 ${dark ? 'text-white' : 'text-slate-900 transition group-hover:text-[#0A599E]'}`}>
                        {video.title}
                    </h3>
                    <p className={`mt-1 text-xs ${dark ? 'text-white/50' : 'text-slate-400'}`}>{formatViews(video.views)}</p>
                </div>
            </Link>

            <a
                href={getYoutubeUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                title="Watch on YouTube"
                aria-label={`Watch ${video.title} on YouTube`}
                className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition sm:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB] ${
                    dark ? 'bg-white/10 text-white hover:bg-white hover:text-[#07406F]' : 'bg-slate-100 text-slate-500 hover:bg-[#0A599E] hover:text-white'
                }`}
            >
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
        </div>
    );
}

/* ------------------------------ Empty state ------------------------------ */

function EmptyState() {
    return (
        <div className="rounded-3xl border border-dashed border-[#0A599E]/25 bg-[#0A599E]/5 px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-slate-900">No videos yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Check back soon for new stories, conversations and experiences from our community.
            </p>
            <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#0A599E] px-6 text-sm font-semibold text-white transition hover:bg-[#07406F] active:scale-[0.97]"
            >
                Visit our channel <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
            </a>
        </div>
    );
}

/* ------------------------------ Pagination ------------------------------ */

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="mt-12 flex flex-wrap justify-center gap-1.5" aria-label="Pagination">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    preserveScroll
                    aria-current={link.active ? 'page' : undefined}
                    className={`min-w-10 rounded-full px-4 py-2 text-center text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${
                        link.active ? 'bg-[#0A599E] text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#0A599E] hover:ring-[#0A599E]/40'
                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}

/* ------------------------------ Page ------------------------------ */

export default function Index({
    featured = null,
    latest = { data: [], links: [] },
    trending = [],
    popular = [],
    categories = [],
}) {
    const latestVideos = latest?.data || [];
    const hasFeatured = Boolean(featured);
    const hasTrending = trending?.length > 0;
    const hasPopular = popular?.length > 0;
    const hasLatest = latestVideos.length > 0;

    return (
        <PublicLayout title="YouTube">
            {/* Header + categories */}
            <section className="mx-auto max-w-7xl px-4 pb-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                        className="mb-0"
                        eyebrow="Watch"
                        title="Our stories on YouTube"
                        description="Real conversations, experiences and stories from our community."
                    />
                    <a
                        href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-[#0A599E] px-6 text-sm font-semibold text-white transition hover:bg-[#07406F] active:scale-[0.97] sm:self-auto ${ring}`}
                    >
                        <Play className="h-3.5 w-3.5" fill="currentColor" />
                        Watch on YouTube
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.4} />
                    </a>
                </div>

                {categories?.length > 0 && (
                    <nav className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" aria-label="Video categories">
                        <span className="shrink-0 rounded-full bg-[#0A599E] px-4 py-2 text-sm font-semibold text-white shadow-sm" aria-current="page">
                            All
                        </span>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/youtube/category/${category.slug}`}
                                className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-[#0A599E] hover:ring-[#0A599E]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                )}
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {!hasFeatured && !hasLatest && (
                    <div className="py-10"><EmptyState /></div>
                )}

                {/* Featured + trending */}
                {hasFeatured && (
                    <section className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
                        <article className={`group relative overflow-hidden rounded-3xl bg-slate-900 ${hasTrending ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                            <Link href={`/youtube/${featured.slug}`} className={`relative block aspect-video lg:aspect-[16/10] ${ring} rounded-3xl`}>
                                <img
                                    src={getThumbnail(featured)}
                                    alt=""
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#0A599E] px-3 py-1 text-xs font-semibold text-white">
                                    <Flame className="h-3 w-3" strokeWidth={2.5} /> Featured
                                </span>

                                <span className="absolute left-1/2 top-[38%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0A599E] shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-[#0A599E] group-hover:text-white sm:h-20 sm:w-20">
                                    <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
                                </span>

                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                                    <p className="text-xs font-semibold text-[#9CCBF0]">{featured.category || 'Story'}</p>
                                    <h2 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                                        {featured.title}
                                    </h2>
                                    {featured.description && (
                                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-[15px]">{featured.description}</p>
                                    )}
                                    <p className="mt-3 flex items-center gap-2 text-xs text-white/60">
                                        {featured.published_at && (<><span>{featured.published_at}</span><span aria-hidden="true">·</span></>)}
                                        <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {formatViews(featured.views)}</span>
                                    </p>
                                </div>
                            </Link>

                            <a
                                href={getYoutubeUrl(featured)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
                            >
                                YouTube <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                            </a>
                        </article>

                        {hasTrending && (
                            <aside className="flex flex-col overflow-hidden rounded-3xl bg-[#07406F] lg:col-span-4">
                                <div className="flex items-center gap-2 px-5 pb-2 pt-5">
                                    <TrendingUp className="h-4 w-4 text-[#5BA3DB]" strokeWidth={2.4} />
                                    <h3 className="text-sm font-bold text-white">Trending now</h3>
                                </div>
                                <div className="flex-1 space-y-0.5 px-3 pb-4">
                                    {trending.map((video, i) => (
                                        <VideoListRow key={video.id} video={video} rank={i + 1} dark />
                                    ))}
                                </div>
                            </aside>
                        )}
                    </section>
                )}

                {/* Latest */}
                {hasLatest && (
                    <section className="py-10 lg:py-12">
                        <SectionHeading eyebrow="New" title="Latest videos" className="mb-8" />
                        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {latestVideos.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                        <Pagination links={latest?.links} />
                    </section>
                )}
            </div>

            {/* Popular */}
            {hasPopular && (
                <section className="mt-6 border-y border-slate-200/70 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                        <SectionHeading eyebrow="Most watched" title="Popular" description="The stories our community keeps coming back to." />
                        <div className="grid gap-x-8 gap-y-1 md:grid-cols-2">
                            {popular.map((video, i) => (
                                <VideoListRow key={video.id} video={video} rank={i + 1} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}