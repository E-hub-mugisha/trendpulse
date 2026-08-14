import { Link } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";

const SHARE_ICONS = {
    facebook: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.2-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h1.9L7.5 4h-2l12.1 16Z" />
        </svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M17 14.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5L10 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2 0-.2-.2-.2-.5-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21H3.2V8.75Zm6.13 0H12.7v1.68h.05c.46-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.28 4.18 5.25V21h-3.5v-5.4c0-1.29-.02-2.94-1.8-2.94-1.8 0-2.08 1.4-2.08 2.85V21h-3.5V8.75Z" />
        </svg>
    ),
    link: (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5"
                strokeLinecap="round"
            />
            <path
                d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.5-1.5"
                strokeLinecap="round"
            />
        </svg>
    ),
};

export default function Show({
    story,
    relatedStories,
    recentStories,
    trendingStories,
}) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const shareLinks = [
        {
            key: "facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            key: "x",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(story.title)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            key: "whatsapp",
            href: `https://wa.me/?text=${encodeURIComponent(`${story.title} ${shareUrl}`)}`,
        },
        {
            key: "linkedin",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    const copyLink = () => {
        navigator.clipboard?.writeText(shareUrl);
    };

    const hasTrending = trendingStories.length > 0;
    const hasRecent = recentStories.length > 0;

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
                                    {story.category || "People"}
                                </p>

                                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                                    {story.title}
                                </h1>

                                <p className="mt-5 text-lg text-gray-500">
                                    A story from{" "}
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

                <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="mx-auto w-full max-w-3xl">
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

                            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-gray-100 pt-8">
                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                    <span>{story.date}</span>
                                    <span>•</span>
                                    <span>
                                        {story.views.toLocaleString()} views
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="mr-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Share
                                    </span>

                                    {shareLinks.map((link) => (
                                        <a
                                            key={link.key}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 transition hover:bg-black hover:text-white"
                                        >
                                            {SHARE_ICONS[link.key]}
                                        </a>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={copyLink}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 transition hover:bg-black hover:text-white"
                                        title="Copy link"
                                    >
                                        {SHARE_ICONS.link}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {(hasTrending || hasRecent) && (
                            <aside className="rounded-3xl bg-[#f7f7f5] p-6 lg:sticky lg:top-8 lg:self-start">
                                {hasTrending && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Trending Now
                                        </h3>

                                        <div className="mt-1 divide-y divide-gray-200">
                                            {trendingStories.map((item) => (
                                                <Link
                                                    key={`trending-${item.id}`}
                                                    href={`/people/${item.slug}`}
                                                    className="group flex gap-3 py-3"
                                                >
                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                                                        {item.featured_image ? (
                                                            <img
                                                                src={
                                                                    item.featured_image
                                                                }
                                                                alt={item.title}
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                                                Story
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h4 className="line-clamp-2 text-sm font-bold leading-5 group-hover:text-gray-500">
                                                            {item.title}
                                                        </h4>
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {item.views.toLocaleString()}{" "}
                                                            views
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hasTrending && hasRecent && (
                                    <div className="my-6 border-t border-gray-200" />
                                )}

                                {hasRecent && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Recent Stories
                                        </h3>

                                        <div className="mt-1 divide-y divide-gray-200">
                                            {recentStories.map((item) => (
                                                <Link
                                                    key={`recent-${item.id}`}
                                                    href={`/people/${item.slug}`}
                                                    className="group flex gap-3 py-3"
                                                >
                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                                                        {item.featured_image ? (
                                                            <img
                                                                src={
                                                                    item.featured_image
                                                                }
                                                                alt={item.title}
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                                                Story
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h4 className="line-clamp-2 text-sm font-bold leading-5 group-hover:text-gray-500">
                                                            {item.title}
                                                        </h4>
                                                        {item.published_at && (
                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {new Date(
                                                                    item.published_at,
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </aside>
                        )}
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
