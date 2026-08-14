import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import NewsCard from '../../../Components/NewsCard';

function SectionHeader({ title, viewAllHref }) {
    return (
        <div className="mb-6 flex items-end justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black tracking-tight">
                {title}
            </h2>
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="text-sm font-bold text-gray-400 hover:text-black"
                >
                    View all →
                </Link>
            )}
        </div>
    );
}

function PostListRow({ post, rank }) {
    return (
        <Link
            href={`/entertainment/${post.slug}`}
            className="group flex items-center gap-4 py-4"
        >
            <span className="w-6 shrink-0 text-2xl font-black text-gray-200">
                {rank}
            </span>

            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        Post
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {post.category || 'Entertainment'}
                </p>
                <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5 group-hover:text-gray-500">
                    {post.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                    {post.views.toLocaleString()} views
                </p>
            </div>
        </Link>
    );
}

export default function Index({
    featured,
    latest,
    trending,
    mostViewed,
    popular,
    categories,
    activeCategory,
}) {
    const switchCategory = (slug) => {
        if (slug === activeCategory) return;

        router.get(
            '/entertainment',
            slug ? { category: slug } : {},
            { preserveScroll: true, preserveState: true, replace: true }
        );
    };

    const categoryHref = (slug) => (slug ? `/entertainment?category=${slug}` : '/entertainment');

    return (
        <PublicLayout title="Entertainment">

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Entertainment"
                    title="What's happening"
                    description="Entertainment, lifestyle, culture and trending stories."
                />

                <div className="mb-12 flex flex-wrap gap-2 border-b border-gray-100 pb-8">
                    <button
                        type="button"
                        onClick={() => switchCategory(null)}
                        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                            !activeCategory
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => switchCategory(category.slug)}
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                                activeCategory === category.slug
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {!featured && (
                    <p className="py-16 text-center text-gray-400">
                        No posts here yet.
                    </p>
                )}

                {featured && (
                    <>

                        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

                            <Link
                                href={`/entertainment/${featured.slug}`}
                                className="group block overflow-hidden rounded-3xl bg-white"
                            >
                                <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                                    {featured.featured_image ? (
                                        <img
                                            src={featured.featured_image}
                                            alt={featured.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            Post
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        {featured.category || 'Entertainment'}
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
                                        {featured.title}
                                    </h2>
                                    <p className="mt-3 text-base leading-7 text-gray-500">
                                        {featured.excerpt}
                                    </p>
                                    <div className="mt-4 text-sm font-bold">
                                        Read more →
                                    </div>
                                </div>
                            </Link>

                            {trending.length > 0 && (
                                <div className="rounded-3xl bg-[#f7f7f5] p-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Trending Now
                                    </h3>

                                    <div className="mt-1 divide-y divide-gray-200">
                                        {trending.map((post, i) => (
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

                        {latest.length > 0 && (
                            <div className="mb-16">
                                <SectionHeader
                                    title="Latest"
                                    viewAllHref={categoryHref(activeCategory)}
                                />

                                <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                                    {latest.map((post) => (
                                        <NewsCard
                                            key={post.id}
                                            post={post}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-12 lg:grid-cols-2">

                            {mostViewed.length > 0 && (
                                <div>
                                    <SectionHeader title="Most Viewed" />

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

                            {popular.length > 0 && (
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

                    </>
                )}

            </section>

        </PublicLayout>
    );
}