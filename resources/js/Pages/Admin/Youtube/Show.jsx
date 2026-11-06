// resources/js/Pages/Admin/YoutubeVideos/Show.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ExternalLink,
    Eye,
    Star,
    CheckCircle2,
    FileClock,
    Calendar,
    Clock,
    FolderOpen,
    Play,
    Copy,
    Check,
    ImageOff,
    Loader2,
    AlertTriangle,
} from 'lucide-react';

const INDEX_URL = '/admin/youtube';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A599E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#084A85] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none ${focusRing}`;

/* ======================================================================== */
/*  PAGE                                                                     */
/* ======================================================================== */

export default function Show({ video, relatedVideos = [] }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const categoryName = video.category?.name ?? video.category;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;
    const longDescription = (video.description || '').length > 320;

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`${INDEX_URL}/${video.slug}`, {
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="Video Details">
            <Head title={video.title} />
            <ModalStyles />

            <Link
                href={INDEX_URL}
                className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-gray-500 hover:text-[#0A599E] ${focusRing}`}
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
                Back to videos
            </Link>

            {/* Header */}
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge published={video.is_published} />
                        {video.is_featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                Featured
                            </span>
                        )}
                    </div>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        {video.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        {categoryName && (
                            <span className="inline-flex items-center gap-1.5">
                                <FolderOpen className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                {categoryName}
                            </span>
                        )}
                        {video.published_at && (
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                {video.published_at}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                        <ExternalLink className="h-4 w-4" strokeWidth={2} />
                        <span className="hidden sm:inline">View on YouTube</span>
                        <span className="sm:hidden">YouTube</span>
                    </a>

                    <Link href={`${INDEX_URL}/${video.slug}/edit`} className={btnPrimary}>
                        <Pencil className="h-4 w-4" strokeWidth={2} />
                        Edit
                    </Link>

                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        aria-label="Delete video"
                        title="Delete video"
                        className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-2.5 text-red-600 transition-colors hover:bg-red-50 motion-reduce:transition-none ${focusRing}`}
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <StatCard icon={Eye} label="Total views" value={(video.views ?? 0).toLocaleString()} tone="brand" />
                <StatCard icon={Calendar} label="Published" value={video.published_at || 'Not set'} />
                <StatCard icon={Clock} label="Last updated" value={video.updated_at || '—'} />
            </div>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
                {/* ---------------------------------------------------------- */}
                {/*  Main column                                               */}
                {/* ---------------------------------------------------------- */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Player */}
                    <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm">
                        {playing ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPlaying(true)}
                                aria-label={`Play ${video.title}`}
                                className={`group relative block h-full w-full ${focusRing}`}
                            >
                                <PosterImage src={video.thumbnail_url} />
                                <span className="absolute inset-0 flex items-center justify-center bg-gray-900/25 transition-colors group-hover:bg-gray-900/40 motion-reduce:transition-none">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A599E] text-white shadow-lg ring-4 ring-white/30 transition-transform group-hover:scale-105 motion-reduce:transition-none">
                                        <Play className="ml-1 h-7 w-7 fill-white" strokeWidth={1.5} />
                                    </span>
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Description */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                        {video.description ? (
                            <>
                                <p
                                    className={`mt-3 whitespace-pre-line text-[15px] leading-7 text-gray-700 ${
                                        longDescription && !expanded ? 'line-clamp-4' : ''
                                    }`}
                                >
                                    {video.description}
                                </p>
                                {longDescription && (
                                    <button
                                        type="button"
                                        onClick={() => setExpanded((prev) => !prev)}
                                        aria-expanded={expanded}
                                        className={`mt-2 rounded text-sm font-medium text-[#0A599E] hover:underline ${focusRing}`}
                                    >
                                        {expanded ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">
                                No description yet.{' '}
                                <Link
                                    href={`${INDEX_URL}/${video.slug}/edit`}
                                    className={`rounded font-medium text-[#0A599E] hover:underline ${focusRing}`}
                                >
                                    Add one
                                </Link>
                            </p>
                        )}
                    </section>

                    {/* Related videos */}
                    {relatedVideos?.length > 0 && (
                        <section>
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                More in {categoryName || 'this category'}
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {relatedVideos.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`${INDEX_URL}/${item.slug}`}
                                        className={`group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-[#0A599E]/40 hover:bg-[#0A599E]/5 motion-reduce:transition-none ${focusRing}`}
                                    >
                                        <RelatedThumb src={item.thumbnail_url} />
                                        <div className="min-w-0">
                                            <p className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#0A599E]">
                                                {item.title}
                                            </p>
                                            {!item.is_published && (
                                                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                                    <FileClock className="h-3 w-3" />
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* ---------------------------------------------------------- */}
                {/*  Side column                                               */}
                {/* ---------------------------------------------------------- */}
                <aside className="lg:sticky lg:top-24">
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-5 py-3">
                            <h3 className="text-sm font-semibold text-gray-900">Details</h3>
                        </div>

                        <dl className="divide-y divide-gray-100">
                            <DetailRow label="Slug">
                                <code className="truncate text-sm text-gray-800">{video.slug}</code>
                                <CopyButton value={video.slug} label="Copy slug" />
                            </DetailRow>

                            <DetailRow label="YouTube ID">
                                <code className="truncate text-sm text-gray-800">{video.youtube_id}</code>
                                <CopyButton value={video.youtube_id} label="Copy YouTube ID" />
                            </DetailRow>

                            <DetailRow label="YouTube link">
                                <a
                                    href={youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`truncate rounded text-sm text-[#0A599E] hover:underline ${focusRing}`}
                                >
                                    youtube.com/watch?v={video.youtube_id}
                                </a>
                                <CopyButton value={youtubeUrl} label="Copy YouTube link" />
                            </DetailRow>

                            {video.is_published && (
                                <DetailRow label="On the website">
                                    <a
                                        href={`/entertainment/videos/${video.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-[#0A599E] hover:underline ${focusRing}`}
                                    >
                                        View live
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </DetailRow>
                            )}

                            <DetailRow label="Created">
                                <span className="text-sm text-gray-800">{video.created_at || '—'}</span>
                            </DetailRow>

                            <DetailRow label="Record ID">
                                <span className="text-sm text-gray-800">#{video.id}</span>
                            </DetailRow>
                        </dl>
                    </section>
                </aside>
            </div>

            <DeleteModal
                open={confirmDelete}
                video={video}
                deleting={deleting}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  PIECES                                                                   */
/* ======================================================================== */

function StatusBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
            <FileClock className="h-3 w-3" strokeWidth={2.5} />
            Draft
        </span>
    );
}

function StatCard({ icon: Icon, label, value, tone = 'neutral' }) {
    const tones = {
        neutral: 'bg-gray-100 text-gray-600',
        brand: 'bg-[#0A599E]/10 text-[#0A599E]',
    };

    return (
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${tones[tone]}`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="truncate text-lg font-bold tabular-nums text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function DetailRow({ label, children }) {
    return (
        <div className="px-5 py-3">
            <dt className="text-xs font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 flex items-center justify-between gap-2">{children}</dd>
        </div>
    );
}

function CopyButton({ value, label }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard unavailable (e.g. insecure context): ignore */
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Copied' : label}
            title={copied ? 'Copied' : label}
            className={`shrink-0 rounded-md p-1.5 transition-colors motion-reduce:transition-none ${focusRing} ${
                copied ? 'text-emerald-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" />}
            <span className="sr-only" aria-live="polite">
                {copied ? 'Copied' : ''}
            </span>
        </button>
    );
}

function PosterImage({ src }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500">
                <ImageOff className="h-10 w-10" strokeWidth={1.25} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt=""
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
        />
    );
}

function RelatedThumb({ src }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {src && !failed ? (
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <ImageOff className="h-4 w-4" />
                </div>
            )}
        </div>
    );
}

/* ======================================================================== */
/*  DELETE MODAL                                                             */
/* ======================================================================== */

function DeleteModal({ open, video, deleting, onCancel, onConfirm }) {
    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (e) => e.key === 'Escape' && onCancelRef.current();
        const previousOverflow = document.body.style.overflow;
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-video-title"
        >
            <div className="yt-backdrop absolute inset-0 bg-gray-900/50" onClick={onCancel} />
            <div className="yt-modal-panel relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                <div className="px-6 py-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-50 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 id="delete-video-title" className="text-base font-semibold text-gray-900">
                                Delete this video?
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500">
                                “{video.title}” will be permanently removed. This can’t be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button type="button" onClick={onCancel} className={btnSecondary}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`}
                    >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        {deleting ? 'Deleting…' : 'Delete video'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalStyles() {
    return (
        <style>{`
            .yt-backdrop { animation: yt-fade-in 150ms ease-out; }
            .yt-modal-panel { animation: yt-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes yt-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes yt-modal-in {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
                .yt-backdrop, .yt-modal-panel { animation: none; }
            }
        `}</style>
    );
}