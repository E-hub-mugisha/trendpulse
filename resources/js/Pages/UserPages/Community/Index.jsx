import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import CommunityPost from '../../../Components/CommunityPost';

export default function Index({ posts }) {
    return (
        <PublicLayout title="Community">

            <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">

                <SectionHeading
                    eyebrow="Community"
                    title="Join the conversation"
                    description="Share your thoughts, ask questions and connect with other people."
                />

                <div className="mb-8 rounded-3xl bg-black p-6 text-white sm:p-8">

                    <h2 className="text-2xl font-black">
                        Have something to say?
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                        Share your story with the wider TrendPulse community.
                    </p>

                    <Link
                        href="/share-your-story"
                        className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
                    >
                        Share Your Story →
                    </Link>

                </div>

                <div className="space-y-5">

                    {posts.data.length > 0 ? (
                        posts.data.map((post) => (
                            <CommunityPost
                                key={post.id}
                                post={post}
                            />
                        ))
                    ) : (
                        <div className="rounded-3xl bg-gray-100 p-16 text-center">
                            <h3 className="font-bold">
                                No community posts yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Be part of the first conversation.
                            </p>
                        </div>
                    )}

                </div>

                {posts.links.length > 3 && (
                    <div className="mt-10 flex flex-wrap justify-center gap-2">

                        {posts.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100'
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