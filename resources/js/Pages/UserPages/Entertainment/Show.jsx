import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Show({ post, relatedPosts }) {
    return (
        <PublicLayout title={post.title}>

            <article>

                {/* Hero image */}
                <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">

                    <div className="aspect-[21/9] overflow-hidden rounded-3xl bg-gray-100">

                        {post.featured_image ? (
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Entertainment
                            </div>
                        )}

                    </div>

                </div>

                {/* Article */}
                <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-400">

                        <span>
                            {post.category || 'Entertainment'}
                        </span>

                        <span>•</span>

                        <span>{post.date}</span>

                        <span>•</span>

                        <span>
                            {post.views.toLocaleString()} views
                        </span>

                    </div>

                    <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mt-6 text-xl leading-8 text-gray-500">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="mt-10 border-t border-gray-100 pt-10">

                        <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                            {post.content}
                        </div>

                    </div>

                    {post.author_name && (
                        <div className="mt-10 border-t border-gray-100 pt-6 text-sm text-gray-500">
                            Written by{' '}
                            <span className="font-bold text-black">
                                {post.author_name}
                            </span>
                        </div>
                    )}

                </div>

                {/* Related */}
                {relatedPosts.length > 0 && (
                    <section className="border-t border-gray-100 bg-white">

                        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                            <h2 className="text-3xl font-black">
                                You may also like
                            </h2>

                            <div className="mt-8 grid gap-7 md:grid-cols-3">

                                {relatedPosts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/entertainment/${item.slug}`}
                                        className="group"
                                    >
                                        <h3 className="text-xl font-bold group-hover:text-gray-500">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500">
                                            {item.excerpt}
                                        </p>
                                    </Link>
                                ))}

                            </div>

                        </div>

                    </section>
                )}

            </article>

        </PublicLayout>
    );
}