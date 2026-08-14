import { Link, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import CommunityPost from '../../../Components/CommunityPost';

export default function Index({ posts }) {
    const { auth } = usePage().props;
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post('/community', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <PublicLayout title="Community">

            <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">

                <SectionHeading
                    eyebrow="Community"
                    title="Join the conversation"
                    description="Share your thoughts, ask questions and connect with other people."
                />

                {auth?.user ? (
                    <form
                        onSubmit={submit}
                        className="mb-8 rounded-3xl bg-black p-6 text-white sm:p-8"
                    >
                        <h2 className="text-2xl font-black">
                            Have something to say?
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Share your thoughts with the wider TrendPulse community.
                        </p>

                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder={`What's on your mind, ${auth.user.name?.split(' ')[0]}?`}
                            rows={3}
                            className="mt-5 w-full resize-none rounded-2xl border-0 bg-white/10 p-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                        />
                        {errors.content && (
                            <p className="mt-1 text-xs text-red-400">{errors.content}</p>
                        )}

                        {data.image && (
                            <p className="mt-2 text-xs text-gray-400">
                                Attached: {data.image.name}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add photo
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('image', e.target.files[0] ?? null)}
                                />
                            </label>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/share-your-story"
                                    className="text-xs font-bold text-gray-400 hover:text-white"
                                >
                                    Write a full story instead →
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black disabled:opacity-40"
                                >
                                    Post
                                </button>
                            </div>

                        </div>
                    </form>
                ) : (
                    <div className="mb-8 rounded-3xl bg-black p-6 text-white sm:p-8">

                        <h2 className="text-2xl font-black">
                            Have something to say?
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Sign in to post, like, and comment with the TrendPulse community.
                        </p>

                        <Link
                            href="/login"
                            className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
                        >
                            Sign in to post →
                        </Link>

                    </div>
                )}

                <div className="space-y-5">

                    {posts.data.length > 0 ? (
                        posts.data.map((post) => (
                            <CommunityPost
                                key={post.id}
                                post={post}
                                isAuthenticated={!!auth?.user}
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