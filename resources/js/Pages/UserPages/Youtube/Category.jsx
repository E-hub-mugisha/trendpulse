import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronRight, Eye, Play } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';

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
                    <h2 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-[#0A599E]">
                        {video.title}
                    </h2>
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

/* ------------------------------ Empty state ------------------------------ */

function EmptyState({ category }) {
    return (
        <div className="rounded-3xl border border-dashed border-[#0A599E]/25 bg-[#0A599E]/5 px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">No videos found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are no published videos in <strong className="text-slate-700">{category.name}</strong> yet. Try another category or check back soon.
            </p>
            <Link
                href="/youtube"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#0A599E] px-6 text-sm font-semibold text-white transition hover:bg-[#07406F] active:scale-[0.97]"
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
                Browse all videos
            </Link>
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

export default function Category({ category, videos, categories = [] }) {
    const videoItems = videos?.data || [];
    const total = videos?.total ?? videoItems.length;
    const activeChip = useRef(null);

    // Bring the active category chip into view on small screens
    useEffect(() => {
        activeChip.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
    }, [category?.slug]);

    return (
        <PublicLayout title={category?.name || 'YouTube Category'}>
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                    <Link href="/youtube" className="font-medium text-slate-500 transition hover:text-[#0A599E]">YouTube</Link>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="font-semibold text-slate-900" aria-current="page">{category.name}</span>
                </nav>

                {/* Header banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#07406F] px-6 py-10 text-white sm:px-10 sm:py-12">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 h-64 w-64 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#0A599E]/50 blur-3xl" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9CCBF0]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#5BA3DB]" />
                                Category
                            </p>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{category.name}</h1>
                            <p className="mt-3 text-[15px] leading-7 text-white/75">
                                Explore every published video in this category.
                                <span className="ml-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                                    {total} {total === 1 ? 'video' : 'videos'}
                                </span>
                            </p>
                        </div>

                        <a
                            href={YOUTUBE_CHANNEL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-sm font-semibold text-[#07406F] shadow-lg shadow-black/10 transition hover:bg-slate-100 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:self-auto"
                        >
                            <Play className="h-3.5 w-3.5" fill="currentColor" />
                            Visit YouTube
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.4} />
                        </a>
                    </div>
                </div>

                {/* Category chips */}
                {categories.length > 0 && (
                    <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" aria-label="Video categories">
                        <Link
                            href="/youtube"
                            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-[#0A599E] hover:ring-[#0A599E]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
                        >
                            All
                        </Link>
                        {categories.map((item) => {
                            const on = item.slug === category.slug;
                            return (
                                <Link
                                    key={item.id}
                                    ref={on ? activeChip : null}
                                    href={`/youtube/category/${item.slug}`}
                                    aria-current={on ? 'page' : undefined}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${
                                        on ? 'bg-[#0A599E] text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#0A599E] hover:ring-[#0A599E]/40'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* Videos */}
                {videoItems.length > 0 ? (
                    <>
                        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {videoItems.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                        <Pagination links={videos?.links} />
                    </>
                ) : (
                    <div className="mt-8">
                        <EmptyState category={category} />
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}