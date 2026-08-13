import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import NewsCard from '../../../Components/SectionHeading';

export default function Index({ posts }) {
    return (
        <PublicLayout title="Entertainment">

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Entertainment"
                    title="What's happening"
                    description="Entertainment, lifestyle, culture and trending stories."
                />

                <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">

                    {posts.data.map((post) => (
                        <NewsCard
                            key={post.id}
                            post={post}
                        />
                    ))}

                </div>

                {posts.links.length > 3 && (
                    <div className="mt-14 flex flex-wrap justify-center gap-2">

                        {posts.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-40'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}

                    </div>
                )}

            </section>

        </PublicLayout>
    );
}