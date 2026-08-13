import { Link } from '@inertiajs/react';

export default function NewsCard({ post }) {
    return (
        <Link
            href={`/entertainment/${post.slug}`}
            className="group block"
        >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200">

                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        Entertainment
                    </div>
                )}

            </div>

            <div className="mt-4">

                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <span>
                        {post.category || 'Entertainment'}
                    </span>

                    <span>•</span>

                    <span>
                        {post.date || 'Latest'}
                    </span>
                </div>

                <h3 className="mt-2 text-xl font-bold leading-7 transition group-hover:text-gray-500">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {post.excerpt}
                    </p>
                )}

            </div>

        </Link>
    );
}