import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

/* -------------------------------------------------------------------------
 | Icons
 ------------------------------------------------------------------------- */

const SHARE_ICONS = {
    facebook: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.2-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h1.9L7.5 4h-2l12.1 16Z" />
        </svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M17 14.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5L10 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2 0-.2-.2-.2-.5-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21H3.2V8.75Zm6.13 0H12.7v1.68h.05c.46-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.28 4.18 5.25V21h-3.5v-5.4c0-1.29-.02-2.94-1.8-2.94-1.8 0-2.08 1.4-2.08 2.85V21h-3.5V8.75Z" />
        </svg>
    ),
};

const Svg = ({ children, className = 'h-4 w-4' }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const LinkIcon = () => (
    <Svg>
        <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </Svg>
);

const CheckIcon = () => (
    <Svg>
        <path d="M5 13l4 4L19 7" />
    </Svg>
);

const ArrowIcon = () => (
    <Svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
);

const EyeIcon = () => (
    <Svg className="h-3.5 w-3.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </Svg>
);

const ClockIcon = () => (
    <Svg className="h-3.5 w-3.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </Svg>
);

const UpIcon = () => (
    <Svg>
        <path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
);

const NativeShareIcon = () => (
    <Svg>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </Svg>
);

/* -------------------------------------------------------------------------
 | Reusable pieces
 ------------------------------------------------------------------------- */

const circleBtn =
    'flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:-translate-y-0.5 hover:bg-[#0A599E] hover:text-white';

function SectionHeader({ title }) {
    return (
        <div className="relative mb-5 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold tracking-tight text-black">
                {title}
            </h2>
            <span className="absolute -bottom-px left-0 h-[2px] w-14 bg-[#0A599E]" />
        </div>
    );
}

function PostRow({ item, meta }) {
    return (
        <Link
            href={`/entertainment/${item.slug}`}
            className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-[#0A599E]/5"
        >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#0A599E]/20 to-[#07406F]/30">
                {item.featured_image ? (
                    <img
                        src={item.featured_image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-medium text-[#0A599E]">
                        Post
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 text-black transition group-hover:text-[#0A599E]">
                    {item.title}
                </h3>

                {meta && (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                        {meta}
                    </p>
                )}
            </div>
        </Link>
    );
}

/* -------------------------------------------------------------------------
 | Post content: renders Tiptap-produced HTML (or legacy plain text)
 ------------------------------------------------------------------------- */

const SIZES = [
    { label: 'Small', px: 14, lh: 1.75 },
    { label: 'Medium', px: 15.5, lh: 1.85 },
    { label: 'Large', px: 17, lh: 1.9 },
];

function PostContent({ html, size }) {
    if (!html) return null;

    // Posts saved before the rich text editor was added may still be plain
    // text with no tags, so keep the whitespace-preserving fallback.
    const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html);
    const style = { fontSize: SIZES[size].px, lineHeight: SIZES[size].lh };

    if (!looksLikeHtml) {
        return (
            <div
                className="whitespace-pre-line text-gray-700 transition-all duration-200 first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-[#0A599E]"
                style={style}
            >
                {html}
            </div>
        );
    }

    return (
        <>
            <div
                className="post-content text-gray-700 transition-all duration-200"
                style={style}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            <PostContentStyles />
        </>
    );
}

function PostContentStyles() {
    return (
        <style>{`
            .post-content > p:first-of-type::first-letter {
                float: left;
                font-size: 3.1em;
                line-height: 0.9;
                font-weight: 600;
                color: #0A599E;
                margin: 0.08em 0.12em 0 0;
            }
            .post-content p { margin: 0 0 1.25em; }
            .post-content p:last-child { margin-bottom: 0; }
            .post-content h2 { font-size: 1.45em; font-weight: 600; color: #000; margin: 1.5em 0 0.5em; letter-spacing: -0.01em; line-height: 1.3; }
            .post-content h3 { font-size: 1.2em; font-weight: 600; color: #000; margin: 1.3em 0 0.4em; line-height: 1.35; }
            .post-content h2:first-child, .post-content h3:first-child { margin-top: 0; }
            .post-content ul, .post-content ol { margin: 0 0 1.25em; padding-left: 1.5em; }
            .post-content ul { list-style: disc; }
            .post-content ol { list-style: decimal; }
            .post-content li { margin: 0.35em 0; }
            .post-content li::marker { color: #0A599E; }
            .post-content blockquote {
                margin: 1.5em 0;
                padding: 0.9em 1.25em;
                border-left: 3px solid #0A599E;
                background: #EAF1F8;
                border-radius: 0 14px 14px 0;
                color: #07406F;
                font-style: italic;
            }
            .post-content blockquote p { margin: 0; }
            .post-content a { color: #0A599E; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s ease; }
            .post-content a:hover { color: #07406F; }
            .post-content strong { font-weight: 600; color: #000; }
            .post-content img { max-width: 100%; height: auto; border-radius: 14px; margin: 1.5em 0; }
            .post-content hr { border: none; border-top: 1px solid #E1E5EA; margin: 2em 0; }
            .post-content code {
                background: #f3f4f6;
                border-radius: 4px;
                padding: 0.1em 0.4em;
                font-size: 0.85em;
            }
            .post-content pre {
                background: #0b1c2c;
                color: #e6edf3;
                border-radius: 12px;
                padding: 1em 1.2em;
                overflow-x: auto;
                margin: 1.5em 0;
                font-size: 0.85em;
            }
            .post-content pre code { background: none; padding: 0; color: inherit; }
        `}</style>
    );
}

/* -------------------------------------------------------------------------
 | Page
 ------------------------------------------------------------------------- */

export default function Show({
    post,
    relatedPosts = [],
    recentPosts = [],
    trendingPosts = [],
}) {
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showTop, setShowTop] = useState(false);
    const [size, setSize] = useState(1);

    const bodyRef = useRef(null);

    /* ------------------------------ share ------------------------------ */

    useEffect(() => {
        setShareUrl(window.location.href);
        setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
    }, []);

    const shareLinks = useMemo(
        () => [
            {
                key: 'facebook',
                label: 'Share on Facebook',
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            },
            {
                key: 'x',
                label: 'Share on X',
                href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
            },
            {
                key: 'whatsapp',
                label: 'Share on WhatsApp',
                href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`,
            },
            {
                key: 'linkedin',
                label: 'Share on LinkedIn',
                href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            },
        ],
        [shareUrl, post.title]
    );

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            /* clipboard unavailable */
        }
    };

    const nativeShare = () => {
        navigator.share?.({ title: post.title, url: shareUrl }).catch(() => {});
    };

    /* -------------------- reading progress + back to top ---------------- */

    useEffect(() => {
        let frame = null;

        const update = () => {
            frame = null;
            const el = bodyRef.current;

            if (el) {
                const rect = el.getBoundingClientRect();
                const total = rect.height - window.innerHeight * 0.6;
                const done = -rect.top + window.innerHeight * 0.2;
                setProgress(Math.min(1, Math.max(0, total > 0 ? done / total : 0)));
            }

            setShowTop(window.scrollY > 700);
        };

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    /* ------------------------------ derived ---------------------------- */

    const plainText = (post.content || '').replace(/<[^>]*>/g, ' ');
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));
    const authorInitial = post.author_name?.charAt(0)?.toUpperCase() || 'A';

    const hasTrending = trendingPosts?.length > 0;
    const hasRecent = recentPosts?.length > 0;

    return (
        <PublicLayout title={post.title}>
            <style>{`
                @keyframes pe-fade {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: none; }
                }
                .pe-fade { animation: pe-fade 0.5s ease both; }
                @media (prefers-reduced-motion: reduce) {
                    .pe-fade { animation: none; }
                }
            `}</style>

            {/* Reading progress */}
            <div
                className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-transparent"
                role="progressbar"
                aria-label="Reading progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
            >
                <div
                    className="h-full origin-left bg-gradient-to-r from-[#0A599E] to-[#1d7fd1] transition-transform duration-150"
                    style={{ transform: `scaleX(${progress})` }}
                />
            </div>

            <article className="bg-gradient-to-b from-[#0A599E]/[0.05] via-white to-white">
                {/* =====================================================
                    HEADER (image on the left, small)
                ===================================================== */}

                <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-6 lg:px-8">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-5 flex items-center gap-2 text-xs text-gray-400"
                    >
                        <Link href="/entertainment" className="transition hover:text-[#0A599E]">
                            Entertainment
                        </Link>
                        <span aria-hidden>/</span>
                        <span className="text-gray-500">{post.category || 'Post'}</span>
                    </nav>

                    <header className="pe-fade overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                        <div className="grid items-center gap-7 p-6 sm:p-8 md:grid-cols-[250px_minmax(0,1fr)]">
                            <div className="relative aspect-[4/3] w-full max-w-[250px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#07406F] to-[#0A599E] shadow-lg shadow-[#0A599E]/15 md:max-w-none">
                                {post.featured_image ? (
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs font-medium text-white/80">
                                        Entertainment
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A599E] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    {post.category || 'Entertainment'}
                                </span>

                                <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl">
                                    {post.title}
                                </h1>

                                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400">
                                    {post.date && <span>{post.date}</span>}

                                    <span className="inline-flex items-center gap-1.5">
                                        <ClockIcon />
                                        {readingMinutes} min read
                                    </span>

                                    <span className="inline-flex items-center gap-1.5">
                                        <EyeIcon />
                                        {(post.views ?? 0).toLocaleString()} views
                                    </span>
                                </p>

                                {post.author_name && (
                                    <div className="mt-5 flex items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A599E] to-[#07406F] text-xs font-semibold text-white shadow-md shadow-[#0A599E]/30">
                                            {authorInitial}
                                        </span>

                                        <p className="text-[13px] text-gray-500">
                                            Written by{' '}
                                            <span className="font-semibold text-black">
                                                {post.author_name}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                {/* =====================================================
                    ARTICLE BODY
                ===================================================== */}

                <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
                    {/* Text size controls */}
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                            Text size
                        </p>

                        <div
                            className="inline-flex rounded-full border border-gray-200 bg-white p-1"
                            role="group"
                            aria-label="Text size"
                        >
                            {SIZES.map((s, i) => (
                                <button
                                    key={s.label}
                                    type="button"
                                    onClick={() => setSize(i)}
                                    aria-pressed={size === i}
                                    aria-label={s.label}
                                    className={`flex h-7 w-9 items-center justify-center rounded-full font-medium transition ${
                                        size === i
                                            ? 'bg-[#0A599E] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-[#0A599E]'
                                    }`}
                                    style={{ fontSize: 11 + i * 2 }}
                                >
                                    A
                                </button>
                            ))}
                        </div>
                    </div>

                    {post.excerpt && (
                        <p className="border-l-2 border-[#0A599E] pl-5 text-base font-medium leading-7 text-gray-500 sm:text-lg sm:leading-8">
                            {post.excerpt}
                        </p>
                    )}

                    <div ref={bodyRef} className="mt-9">
                        <PostContent html={post.content} size={size} />
                    </div>

                    {/* Share */}
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-[13px] font-medium text-black">
                            Enjoyed this? Pass it on.
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            {shareLinks.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    title={link.label}
                                    className={circleBtn}
                                >
                                    {SHARE_ICONS[link.key]}
                                </a>
                            ))}

                            {canNativeShare && (
                                <button
                                    type="button"
                                    onClick={nativeShare}
                                    aria-label="Share"
                                    title="Share"
                                    className={circleBtn}
                                >
                                    <NativeShareIcon />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={copyLink}
                                aria-label="Copy link"
                                title="Copy link"
                                className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-xs font-medium transition ${
                                    copied
                                        ? 'bg-[#0A599E] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-[#0A599E] hover:text-white'
                                }`}
                            >
                                {copied ? <CheckIcon /> : <LinkIcon />}
                                {copied ? 'Link copied' : 'Copy link'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    TRENDING + RECENT (below the article)
                ===================================================== */}

                {(hasTrending || hasRecent) && (
                    <div className="mx-auto max-w-5xl px-5 pb-14 sm:px-6 lg:px-8">
                        <div
                            className={`grid gap-12 ${
                                hasTrending && hasRecent ? 'lg:grid-cols-2' : ''
                            }`}
                        >
                            {hasTrending && (
                                <div>
                                    <SectionHeader title="Trending now" />

                                    <div className="divide-y divide-gray-100">
                                        {trendingPosts.map((item) => (
                                            <PostRow
                                                key={`trending-${item.id}`}
                                                item={item}
                                                meta={
                                                    <>
                                                        <EyeIcon />
                                                        {(item.views ?? 0).toLocaleString()} views
                                                    </>
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasRecent && (
                                <div>
                                    <SectionHeader title="Recent posts" />

                                    <div className="divide-y divide-gray-100">
                                        {recentPosts.map((item) => (
                                            <PostRow
                                                key={`recent-${item.id}`}
                                                item={item}
                                                meta={
                                                    item.published_at
                                                        ? new Date(
                                                              item.published_at
                                                          ).toLocaleDateString('en-US', {
                                                              month: 'short',
                                                              day: 'numeric',
                                                              year: 'numeric',
                                                          })
                                                        : null
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* =====================================================
                    YOU MAY ALSO LIKE
                ===================================================== */}

                {relatedPosts?.length > 0 && (
                    <section className="border-t border-gray-100 bg-[#EAF1F8]/50">
                        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 lg:px-8">
                            <SectionHeader title="You may also like" />

                            <div className="grid gap-5 md:grid-cols-3">
                                {relatedPosts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/entertainment/${item.slug}`}
                                        className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0A599E]/40 hover:shadow-lg hover:shadow-[#0A599E]/10"
                                    >
                                        <h3 className="text-[15px] font-semibold leading-snug text-black transition group-hover:text-[#0A599E]">
                                            {item.title}
                                        </h3>

                                        {item.excerpt && (
                                            <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-500">
                                                {item.excerpt}
                                            </p>
                                        )}

                                        <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-[#0A599E]">
                                            Read more
                                            <ArrowIcon />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </article>

            {/* Back to top */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#0A599E] text-white shadow-lg shadow-[#0A599E]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#07406F] ${
                    showTop
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0'
                }`}
            >
                <UpIcon />
            </button>
        </PublicLayout>
    );
}