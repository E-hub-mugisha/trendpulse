import { Link } from '@inertiajs/react';
import { ArrowUpRight, Eye, Play } from 'lucide-react';

function getYoutubeUrl(video) {
    if (video.youtube_url) return video.youtube_url;
    if (video.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
    return null;
}

function getThumb(video) {
    if (video.thumbnail) return video.thumbnail;
    if (video.youtube_id) return `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
    return null;
}

const ytLink =
    'inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#0A599E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]';

/**
 * variant: 'default' (grid card) | 'featured' (large overlay) | 'compact' (horizontal row)
 */
export default function VideoCard({ video, variant = 'default' }) {
    const youtubeUrl = getYoutubeUrl(video);
    const thumb = getThumb(video);
    const href = `/youtube/${video.slug}`;
    const image = thumb && (
        <img
            src={thumb}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
    );

    if (variant === 'featured') {
        return (
            <div className="group relative">
                <Link
                    href={href}
                    className="relative block aspect-video overflow-hidden rounded-3xl bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2 lg:aspect-[16/11]"
                >
                    {image}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0A599E] shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-[#0A599E] group-hover:text-white">
                        <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <span className="rounded-full bg-[#0A599E] px-3 py-1 text-xs font-semibold text-white">
                            {video.category || 'Story'}
                        </span>
                        <h3 className="mt-3 line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                            {video.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
                            <Eye className="h-3.5 w-3.5" /> {video.views || 'Watch now'}
                        </p>
                    </div>
                </Link>

                {youtubeUrl && (
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={`absolute right-4 top-4 ${ytLink}`}>
                        YouTube <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                    </a>
                )}
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <Link
                href={href}
                className="group flex gap-3 rounded-2xl p-2 transition hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
            >
                <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:w-40">
                    {image}
                    <span className="absolute bottom-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#0A599E] transition group-hover:bg-[#0A599E] group-hover:text-white">
                        <Play className="ml-0.5 h-3 w-3" fill="currentColor" />
                    </span>
                </div>
                <div className="min-w-0 py-1">
                    <p className="text-xs font-semibold text-[#0A599E]">{video.category || 'Story'}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition group-hover:text-[#0A599E]">
                        {video.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400">{video.views || 'Watch now'}</p>
                </div>
            </Link>
        );
    }

    return (
        <div className="group">
            <Link href={href} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200">
                    {image}
                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                    <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A599E] shadow-lg transition group-hover:bg-[#0A599E] group-hover:text-white">
                        <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                    </span>
                </div>

                <div className="mt-3.5">
                    <p className="text-xs font-semibold text-[#0A599E]">{video.category || 'Story'}</p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-[#0A599E]">
                        {video.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400">{video.views || 'Watch now'}</p>
                </div>
            </Link>

            {youtubeUrl && (
                <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A599E] transition hover:text-[#07406F]"
                >
                    Watch on YouTube <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                </a>
            )}
        </div>
    );
}