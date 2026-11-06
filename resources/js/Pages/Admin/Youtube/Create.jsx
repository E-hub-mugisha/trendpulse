// resources/js/Pages/Admin/Youtube/Create.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    FileClock,
    ImageOff,
    Loader2,
    PlayCircle,
    Star,
} from 'lucide-react';

const INDEX_URL = '/admin/youtube';

const focusRing =
    'outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]/40 focus-visible:ring-offset-1';

const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A599E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#084A85] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none ${focusRing}`;

/** Accepts a full URL (watch, youtu.be, embed, shorts, live) or a bare 11-character ID. */
function extractYoutubeId(value) {
    const input = (value || '').trim();
    if (!input) return '';
    if (/^[\w-]{11}$/.test(input)) return input;

    const patterns = [
        /[?&]v=([\w-]{11})/,
        /youtu\.be\/([\w-]{11})/,
        /youtube\.com\/(?:embed|shorts|live|v)\/([\w-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) return match[1];
    }

    return '';
}

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors, isDirty } = useForm({
        title: '',
        youtube_id: '',
        thumbnail: '',
        description: '',
        category_id: '',
        is_featured: false,
        is_published: true,
        published_at: '',
    });

    // What the person typed or pasted. The extracted ID is what gets saved.
    const [urlInput, setUrlInput] = useState('');

    const videoId = data.youtube_id;
    const urlInvalid = urlInput.trim() !== '' && !videoId;

    const previewSrc = data.thumbnail.trim() || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');
    const categoryName = categories.find((c) => String(c.id) === String(data.category_id))?.name;

    // Warn before closing the tab with unsaved work.
    useEffect(() => {
        if (!isDirty || processing) return undefined;
        const onBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [isDirty, processing]);

    const handleUrlChange = (value) => {
        setUrlInput(value);
        setData('youtube_id', extractYoutubeId(value));
    };

    const submit = (e) => {
        e.preventDefault();
        post(INDEX_URL, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Add YouTube Video">
            <Head title="Add YouTube Video" />

            <Link
                href={INDEX_URL}
                className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-gray-500 hover:text-[#0A599E] ${focusRing}`}
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
                Back to videos
            </Link>

            <p className="mt-3 max-w-2xl text-sm text-gray-500">
                Paste a YouTube link or video ID. The thumbnail is pulled in automatically.
            </p>

            <form onSubmit={submit} className="mt-6 grid items-start gap-6 lg:grid-cols-3">
                {/* ---------------------------------------------------------- */}
                {/*  Main column                                               */}
                {/* ---------------------------------------------------------- */}
                <div className="space-y-6 lg:col-span-2">
                    <Section title="Video" description="Where the video lives and what it’s called.">
                        <Field label="YouTube link or video ID" htmlFor="youtube_url" error={errors.youtube_id}>
                            <input
                                id="youtube_url"
                                type="text"
                                inputMode="url"
                                value={urlInput}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=…"
                                aria-invalid={Boolean(errors.youtube_id) || urlInvalid}
                                aria-describedby="youtube_url_status"
                                className={inputClass(errors.youtube_id || urlInvalid)}
                                autoFocus
                            />
                            <div id="youtube_url_status" className="mt-1.5 min-h-[1.25rem] text-xs">
                                {videoId && (
                                    <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Video found: <code className="rounded bg-emerald-50 px-1">{videoId}</code>
                                    </p>
                                )}
                                {urlInvalid && (
                                    <p className="flex items-center gap-1.5 font-medium text-red-600">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        We couldn’t find a video ID in that link. Check it and try again.
                                    </p>
                                )}
                            </div>
                        </Field>

                        <Field label="Title" htmlFor="title" error={errors.title}>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Give the video a clear, searchable title"
                                aria-invalid={Boolean(errors.title)}
                                className={inputClass(errors.title)}
                            />
                        </Field>

                        <Field
                            label="Description"
                            htmlFor="description"
                            error={errors.description}
                            hint="Optional. A short summary shown with the video."
                        >
                            <textarea
                                id="description"
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                aria-invalid={Boolean(errors.description)}
                                className={`${inputClass(errors.description)} resize-y`}
                            />
                        </Field>
                    </Section>

                    <Section title="Thumbnail" description="Uses the YouTube thumbnail unless you add your own.">
                        <Field
                            label="Custom thumbnail URL"
                            htmlFor="thumbnail"
                            error={errors.thumbnail}
                            hint="Optional. Leave blank to use the YouTube thumbnail."
                        >
                            <input
                                id="thumbnail"
                                type="url"
                                value={data.thumbnail}
                                onChange={(e) => setData('thumbnail', e.target.value)}
                                placeholder="https://…"
                                aria-invalid={Boolean(errors.thumbnail)}
                                className={inputClass(errors.thumbnail)}
                            />
                        </Field>
                    </Section>
                </div>

                {/* ---------------------------------------------------------- */}
                {/*  Side column                                               */}
                {/* ---------------------------------------------------------- */}
                <aside className="space-y-6 lg:sticky lg:top-24">
                    {/* Live preview */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-5 py-3">
                            <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
                        </div>
                        <div className="p-4">
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <PreviewThumb key={previewSrc} src={previewSrc} featured={data.is_featured} />
                                <div className="p-3">
                                    <div className="flex items-center gap-2">
                                        {data.is_published ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
                                                <FileClock className="h-3 w-3" strokeWidth={2.5} />
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`mt-2 line-clamp-2 text-sm font-semibold ${
                                            data.title ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                    >
                                        {data.title || 'Your video title'}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">{categoryName || 'Uncategorised'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publishing */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-5 py-3">
                            <h2 className="text-sm font-semibold text-gray-900">Publishing</h2>
                        </div>

                        <div className="space-y-4 p-5">
                            <Field label="Category" htmlFor="category_id" error={errors.category_id}>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={inputClass(errors.category_id)}
                                >
                                    <option value="">No category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Publish date" htmlFor="published_at" error={errors.published_at} hint="Optional.">
                                <input
                                    id="published_at"
                                    type="date"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className={inputClass(errors.published_at)}
                                />
                            </Field>

                            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                                <SwitchRow
                                    id="is_published"
                                    label="Published"
                                    description="Visible on the website"
                                    checked={data.is_published}
                                    onChange={(v) => setData('is_published', v)}
                                />
                                <SwitchRow
                                    id="is_featured"
                                    label="Featured"
                                    description="Highlighted in featured spots"
                                    checked={data.is_featured}
                                    onChange={(v) => setData('is_featured', v)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
                            <Link href={INDEX_URL} className={btnSecondary}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className={btnPrimary}>
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <PlayCircle className="h-4 w-4" strokeWidth={2} />
                                )}
                                {processing ? 'Saving…' : 'Add video'}
                            </button>
                        </div>
                    </div>
                </aside>
            </form>
        </AdminLayout>
    );
}

/* ======================================================================== */
/*  PIECES                                                                   */
/* ======================================================================== */

function Section({ title, description, children }) {
    return (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
            </div>
            <div className="space-y-5 p-5 sm:p-6">{children}</div>
        </section>
    );
}

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

function inputClass(error) {
    return `block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-[#0A599E] focus:ring-[#0A599E]/20'
    }`;
}

function SwitchRow({ id, label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
                <p id={`${id}-label`} className="text-sm font-semibold text-gray-900">
                    {label}
                </p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-labelledby={`${id}-label`}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors motion-reduce:transition-none ${focusRing} ${
                    checked ? 'bg-[#0A599E]' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${
                        checked ? 'translate-x-[24px]' : 'translate-x-[4px]'
                    }`}
                />
            </button>
        </div>
    );
}

function PreviewThumb({ src, featured }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="relative aspect-video w-full bg-gray-100">
            {src && !failed ? (
                <img
                    src={src}
                    alt="Video thumbnail preview"
                    onError={() => setFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-gray-400">
                    <ImageOff className="h-6 w-6" strokeWidth={1.5} />
                    <span className="text-xs">{failed ? 'Thumbnail couldn’t load' : 'Thumbnail appears here'}</span>
                </div>
            )}
            {featured && (
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/75" title="Featured">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="sr-only">Featured</span>
                </span>
            )}
        </div>
    );
}