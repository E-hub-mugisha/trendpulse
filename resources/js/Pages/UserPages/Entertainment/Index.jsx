import { Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import NewsCard from '../../../Components/NewsCard';

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

function PostListRow({ post, rank }) {
    return (
        <Link
            href={`/entertainment/${post.slug}`}
            className="group flex items-center gap-4 py-4"
        >
            <span className="w-7 shrink-0 text-2xl font-black text-gray-200 transition group-hover:text-[#0A599E]">
                {String(rank).padStart(2, '0')}
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
                <p className="text-xs font-bold uppercase tracking-wider text-[#0A599E]">
                    {post.category || 'Entertainment'}
                </p>
                <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5 text-black transition group-hover:text-[#0A599E]">
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
                                ? 'bg-[#0A599E] text-white'
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
                                    ? 'bg-[#0A599E] text-white'
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
                                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-200">
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

                                    <span className="absolute left-4 top-4 rounded-full bg-[#0A599E] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                                        Featured
                                    </span>
                                </div>

                                <div className="pt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#0A599E]">
                                        {featured.category || 'Entertainment'}
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black leading-tight text-black sm:text-4xl">
                                        {featured.title}
                                    </h2>
                                    <p className="mt-3 text-base leading-7 text-gray-500">
                                        {featured.excerpt}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-black transition group-hover:gap-2.5 group-hover:text-[#0A599E]">
                                        Read more
                                        <span aria-hidden>→</span>
                                    </div>
                                </div>
                            </Link>

                            {trending.length > 0 && (
                                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-[#f7f7f5]">
                                    <div className="flex items-center gap-2 border-b border-gray-200 bg-black px-6 py-4">
                                        <span className="h-2 w-2 rounded-full bg-[#0A599E]" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                            Trending Now
                                        </h3>
                                    </div>

                                    <div className="divide-y divide-gray-200 px-6">
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