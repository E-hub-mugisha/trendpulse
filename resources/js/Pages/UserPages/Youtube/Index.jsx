import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@TrendPulse_Global/featured';

function getYoutubeUrl(video) {
    if (video.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
    return YOUTUBE_CHANNEL_URL;
}

function getThumbnail(video) {
    return video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
}

function PlayIcon({ className = 'h-4 w-4' }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M8 5v14l11-7L8 5Z" />
        </svg>
    );
}

function SectionHeader({ title, viewAllHref }) {
    return (
        <div className="mb-6 flex items-end justify-between border-b-2 border-black pb-4">
            <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight">
                <span className="h-5 w-1.5 rounded-full bg-[#0A599E]" />
                {title}
            </h2>
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="text-sm font-bold text-gray-400 transition hover:text-[#0A599E]"
                >
                    View all →
                </Link>
            )}
        </div>
    );
}

function VideoCard({ video }) {
    return (
        <div className="group">

            <Link href={`/youtube/${video.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200">

                    <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg">
                        <PlayIcon className="h-4 w-4" />
                    </div>

                </div>

                <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0A599E]">
                        {video.category || 'Story'}
                    </p>

                    <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-6 text-black">
                        {video.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        {video.views ? `${Number(video.views).toLocaleString()} views` : 'Watch now'}
                    </p>
                </div>
            </Link>

            
            <a    href={getYoutubeUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0A599E] transition hover:text-[#07406F]"
            >
                <PlayIcon />
                Watch on YouTube
            </a>
        </div>
    );
}

function VideoListRow({ video, rank }) {
    return (
        <div className="group flex items-center gap-4 py-4">
            <span className="w-7 shrink-0 text-2xl font-black text-gray-200 transition group-hover:text-[#0A599E]">
                {String(rank).padStart(2, '0')}
            </span>

            <Link href={`/youtube/${video.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black">
                            <PlayIcon className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0A599E]">
                        {video.category || 'Story'}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5 text-black group-hover:text-[#0A599E]">
                        {video.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                        {video.views ? `${Number(video.views).toLocaleString()} views` : 'Watch now'}
                    </p>
                </div>
            </Link>

            
            <a    href={getYoutubeUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                title="Watch on YouTube"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#0A599E] hover:text-white"
            >
                <PlayIcon />
            </a>
        </div>
    );
}

export default function Index({
    featured,
    latest,
    trending,
    popular,
    categories,
    activeCategory,
}) {
    const switchCategory = (slug) => {
        if (slug === activeCategory) return;

        router.get(
            '/youtube',
            slug ? { category: slug } : {},
            { preserveScroll: true, preserveState: true, replace: true }
        );
    };

    const categoryHref = (slug) => (slug ? `/youtube?category=${slug}` : '/youtube');

    const hasTrending = trending && trending.length > 0;
    const hasPopular = popular && popular.length > 0;
    const hasLatest = latest && latest.data && latest.data.length > 0;

    return (
        <PublicLayout title="YouTube">

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        eyebrow="Watch"
                        title="Our Stories on YouTube"
                        description="Real conversations, experiences and stories from our community."
                    />

                    
                    <a  href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-1 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07406F]"
                    >
                        <PlayIcon />
                        Watch on YouTube
                    </a>
                </div>

                <div className="mb-12 mt-10 flex flex-wrap gap-2 border-b border-gray-100 pb-8">
                    <button
                        type="button"
                        onClick={() => switchCategory(null)}
                        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                            !activeCategory
                                ? 'bg-[#0A599E] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>

                    {categories?.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => switchCategory(category.slug)}
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                                activeCategory === category.slug
                                    ? 'bg-[#0A599E] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {!featured && !hasLatest && (
                    <div className="rounded-3xl bg-gray-100 p-20 text-center">
                        <h3 className="text-xl font-bold">No videos yet</h3>
                        <p className="mt-2 text-gray-500">Check back soon for new stories.</p>

                        
                        <a    href={YOUTUBE_CHANNEL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07406F]"
                        >
                            <PlayIcon />
                            Visit our channel
                        </a>
                    </div>
                )}

                {featured && (
                    <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

                        <div className="group block overflow-hidden rounded-3xl bg-white">
                            <Link href={`/youtube/${featured.slug}`} className="block">
                                <div className="relative aspect-video overflow-hidden rounded-3xl bg-gray-200">
                                    <img
                                        src={getThumbnail(featured)}
                                        alt={featured.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" />

                                    <span className="absolute left-4 top-4 rounded-full bg-[#0A599E] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                                        Featured
                                    </span>

                                    <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg">
                                        <PlayIcon className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#0A599E]">
                                        {featured.category || 'Story'}
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black leading-tight text-black sm:text-4xl">
                                        {featured.title}
                                    </h2>
                                    {featured.description && (
                                        <p className="mt-3 line-clamp-2 text-base leading-7 text-gray-500">
                                            {featured.description}
                                        </p>
                                    )}
                                </div>
                            </Link>

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <Link
                                    href={`/youtube/${featured.slug}`}
                                    className="text-sm font-bold text-black transition hover:text-[#0A599E]"
                                >
                                    Read more →
                                </Link>

                                
                                <a    href={getYoutubeUrl(featured)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#0A599E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#07406F]"
                                >
                                    <PlayIcon />
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>

                        {hasTrending && (
                            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-[#f7f7f5]">
                                <div className="flex items-center gap-2 border-b border-gray-200 bg-black px-6 py-4">
                                    <span className="h-2 w-2 rounded-full bg-[#0A599E]" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Trending Now
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-200 px-6">
                                    {trending.map((video, i) => (
                                        <VideoListRow key={video.id} video={video} rank={i + 1} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {hasLatest && (
                    <div className="mb-16">
                        <SectionHeader title="Latest" viewAllHref={categoryHref(activeCategory)} />

                        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {latest.data.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>

                        {latest.links && latest.links.length > 3 && (
                            <div className="mt-14 flex flex-wrap justify-center gap-2">
                                {latest.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-[#0A599E] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {hasPopular && (
                    <div>
                        <SectionHeader title="Popular" />

                        <div className="divide-y divide-gray-100">
                            {popular.map((video, i) => (
                                <VideoListRow key={video.id} video={video} rank={i + 1} />
                            ))}
                        </div>
                    </div>
                )}

            </section>

        </PublicLayout>
    );
}