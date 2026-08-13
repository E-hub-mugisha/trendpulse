import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Show({ story, relatedStories }) {
    return (
        <PublicLayout title={story.title}>

            <article>

                <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">

                    <div className="grid overflow-hidden rounded-3xl bg-[#eeeeec] lg:grid-cols-2">

                        <div className="min-h-[450px] bg-gray-200">

                            {story.featured_image ? (
                                <img
                                    src={story.featured_image}
                                    alt={story.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[450px] items-center justify-center text-gray-400">
                                    People Story
                                </div>
                            )}

                        </div>

                        <div className="flex items-center p-8 sm:p-12 lg:p-16">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                                    {story.category || 'People'}
                                </p>

                                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                                    {story.title}
                                </h1>

                                <p className="mt-5 text-lg text-gray-500">
                                    A story from{' '}
                                    <span className="font-bold text-black">
                                        {story.person_name}
                                    </span>
                                </p>

                                {story.relationship_status && (
                                    <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold">
                                        {story.relationship_status}
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6">

                    {story.excerpt && (
                        <p className="text-xl font-medium leading-8 text-gray-500">
                            {story.excerpt}
                        </p>
                    )}

                    <div className="mt-10 border-t border-gray-100 pt-10">

                        <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                            {story.story}
                        </div>

                    </div>

                    <div className="mt-10 flex flex-wrap gap-3 text-sm text-gray-400">
                        <span>{story.date}</span>
                        <span>•</span>
                        <span>{story.views.toLocaleString()} views</span>
                    </div>

                </div>

                {relatedStories.length > 0 && (
                    <section className="border-t border-gray-100 bg-[#f7f7f5]">

                        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                            <h2 className="text-3xl font-black">
                                More people stories
                            </h2>

                            <div className="mt-8 grid gap-7 md:grid-cols-3">

                                {relatedStories.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/people/${item.slug}`}
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