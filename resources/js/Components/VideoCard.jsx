import { Link } from '@inertiajs/react';

export default function VideoCard({ video }) {
    return (
        <Link
            href={`/youtube/${video.slug}`}
            className="group block"
        >
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

                <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg">
                    ▶
                </div>

            </div>

            <div className="mt-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {video.category || 'Story'}
                </p>

                <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-6">
                    {video.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                    {video.views || 'Watch now'}
                </p>

            </div>

        </Link>
    );
}