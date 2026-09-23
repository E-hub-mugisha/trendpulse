import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const YOUTUBE_CHANNEL_URL =
    'https://www.youtube.com/@TrendPulse_Global/featured';

function getYoutubeUrl(video) {
    if (video?.youtube_id) {
        return `https://www.youtube.com/watch?v=${video.youtube_id}`;
    }

    return YOUTUBE_CHANNEL_URL;
}

function getThumbnail(video) {
    if (video?.thumbnail_url) {
        return video.thumbnail_url;
    }

    if (video?.youtube_id) {
        return `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
    }

    return '/images/youtube-placeholder.jpg';
}

function formatViews(views) {
    if (!views) {
        return 'Watch now';
    }

    return `${Number(views).toLocaleString()} views`;
}

function PlayIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
        >
            <path d="M8 5v14l11-7L8 5Z" />
        </svg>
    );
}

function ArrowLeftIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 12H5"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12 19-7-7 7-7"
            />
        </svg>
    );
}

function VideoCard({ video }) {
    return (
        <article className="group">
            <Link
                href={`/youtube/${video.slug}`}
                className="block"
            >
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
                    <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition group-hover:scale-110">
                        <PlayIcon />
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0A599E]">
                        {video.category || 'Story'}
                    </p>

                    <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-6 text-black transition group-hover:text-[#0A599E]">
                        {video.title}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        {video.published_at && (
                            <>
                                <span>{video.published_at}</span>
                                <span>•</span>
                            </>
                        )}

                        <span>{formatViews(video.views)}</span>
                    </div>
                </div>
            </Link>

            <a
                href={getYoutubeUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0A599E] transition hover:text-[#07406F]"
            >
                <PlayIcon />
                Watch on YouTube
            </a>
        </article>
    );
}

function EmptyState({ category }) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-[#f7f7f5] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0A599E] shadow-sm">
                <PlayIcon className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-black">
                No videos found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                There are currently no published videos in the{' '}
                <strong>{category.name}</strong> category.
            </p>

            <Link
                href="/youtube"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07406F]"
            >
                <ArrowLeftIcon />
                Back to YouTube
            </Link>
        </div>
    );
}

export default function Category({
    category,
    videos,
    categories = [],
}) {
    const videoItems = videos?.data || [];

    return (
        <PublicLayout title={category?.name || 'YouTube Category'}>
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

                {/* =====================================================
                    BACK
                ====================================================== */}

                <Link
                    href="/youtube"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#0A599E]"
                >
                    <ArrowLeftIcon />
                    Back to YouTube
                </Link>

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="border-b-2 border-black pb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A599E]">
                        YouTube Category
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
                                {category.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
                                Explore all our published videos in this
                                category.
                            </p>
                        </div>

                        <a
                            href={YOUTUBE_CHANNEL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07406F]"
                        >
                            <PlayIcon />
                            Visit YouTube
                        </a>
                    </div>
                </div>

                {/* =====================================================
                    CATEGORY NAVIGATION
                ====================================================== */}

                {categories.length > 0 && (
                    <div className="mt-8 overflow-x-auto pb-2">
                        <div className="flex min-w-max gap-2">
                            <Link
                                href="/youtube"
                                className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
                            >
                                All
                            </Link>

                            {categories.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/youtube/category/${item.slug}`}
                                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                                        item.slug === category.slug
                                            ? 'bg-[#0A599E] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* =====================================================
                    VIDEO COUNT
                ====================================================== */}

                {videoItems.length > 0 && (
                    <div className="mt-12 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-black">
                                {category.name} Videos
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                {videos.total}{' '}
                                {videos.total === 1
                                    ? 'video'
                                    : 'videos'}
                            </p>
                        </div>
                    </div>
                )}

                {/* =====================================================
                    VIDEOS
                ====================================================== */}

                {videoItems.length > 0 ? (
                    <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {videoItems.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-12">
                        <EmptyState category={category} />
                    </div>
                )}

                {/* =====================================================
                    PAGINATION
                ====================================================== */}

                {videos?.links &&
                    videos.links.length > 3 && (
                        <div className="mt-16 flex flex-wrap justify-center gap-2">
                            {videos.links.map(
                                (link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-[#0A599E] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } ${
                                            !link.url
                                                ? 'pointer-events-none opacity-40'
                                                : ''
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}
                        </div>
                    )}
            </section>
        </PublicLayout>
    );
}