import { Link } from '@inertiajs/react';

function getYoutubeUrl(video) {
    if (video.youtube_url) return video.youtube_url;
    if (video.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
    return null;
}

export default function VideoCard({ video }) {
    const youtubeUrl = getYoutubeUrl(video);

    return (
        <div className="group">

            <Link href={`/youtube/${video.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200">

                    <img
                        src={
                            video.thumbnail ||
                            `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
                        }
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0A599E] shadow-lg transition group-hover:bg-[#0A599E] group-hover:text-white">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                            <path d="M8 5v14l11-7L8 5Z" />
                        </svg>
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
                        {video.views || 'Watch now'}
                    </p>

                </div>
            </Link>

            {youtubeUrl && (
                
                <a    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0A599E] transition hover:text-[#07406F]"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M8 5v14l11-7L8 5Z" />
                    </svg>
                    Watch on YouTube
                </a>
            )}

        </div>
    );
}