import { Link } from '@inertiajs/react';

export default function PeopleStoryCard({ story }) {
    return (
        <Link
            href={`/people/${story.slug}`}
            className="group block overflow-hidden rounded-3xl bg-white"
        >

            <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">

                {story.featured_image ? (
                    <img
                        src={story.featured_image}
                        alt={story.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Story
                    </div>
                )}

                {story.is_popular && (
                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Popular
                    </span>
                )}

                {!story.is_popular && story.trending_views_count > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Trending
                    </span>
                )}

            </div>

            <div className="p-6">

                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {story.category || 'Relationship'}
                    </p>

                    {typeof story.views === 'number' && (
                        <p className="text-xs text-gray-400">
                            {story.views.toLocaleString()} views
                        </p>
                    )}
                </div>

                <h3 className="mt-2 text-xl font-bold">
                    {story.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    {story.excerpt}
                </p>

                <div className="mt-5 text-sm font-bold">
                    Read their story →
                </div>

            </div>

        </Link>
    );
}