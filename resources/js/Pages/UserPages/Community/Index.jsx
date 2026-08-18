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

    const firstName = auth?.user?.name?.split(' ')[0];
    const initial = auth?.user?.name?.charAt(0)?.toUpperCase();

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
                        className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                    >
                        <div className="h-1.5 bg-[#0A599E]" />

                        <div className="p-6 sm:p-8">

                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A599E] text-sm font-bold text-white">
                                    {initial}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl font-black text-black">
                                        Have something to say?
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Share your thoughts with the wider TrendPulse community.
                                    </p>

                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder={`What's on your mind, ${firstName}?`}
                                        rows={3}
                                        className="mt-4 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-black placeholder-gray-400 outline-none transition focus:border-[#0A599E] focus:bg-white focus:ring-2 focus:ring-[#0A599E]/25"
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-xs font-medium text-red-500">{errors.content}</p>
                                    )}

                                    {data.image && (
                                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0A599E]">
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {data.image.name}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-[#0A599E] hover:text-[#0A599E]">
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

                                        <div className="flex items-center gap-4">
                                            <Link
                                                href="/share-your-story"
                                                className="text-xs font-bold text-gray-400 transition hover:text-[#0A599E]"
                                            >
                                                Write a full story instead →
                                            </Link>

                                            <button
                                                type="submit"
                                                disabled={processing || !data.content.trim()}
                                                className="rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07406F] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-black text-white">
                        <div className="h-1.5 bg-[#0A599E]" />

                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-black">
                                Have something to say?
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Sign in to post, like, and comment with the TrendPulse community.
                            </p>

                            <Link
                                href="/login"
                                className="mt-5 inline-flex rounded-full bg-[#0A599E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d6ab8]"
                            >
                                Sign in to post →
                            </Link>
                        </div>
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
                        <div className="rounded-3xl border-2 border-dashed border-[#0A599E]/25 bg-[#0A599E]/5 p-16 text-center">
                            <h3 className="font-bold text-black">
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
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    link.active
                                        ? 'bg-[#0A599E] text-white'
                                        : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0A599E] hover:text-[#0A599E]'
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