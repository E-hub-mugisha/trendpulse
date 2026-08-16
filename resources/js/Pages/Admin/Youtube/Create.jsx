// resources/js/Pages/Admin/Youtube/Create.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

function extractYoutubeId(value) {
    if (!value) return '';

    const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
        /(?:youtu\.be\/)([\w-]{11})/,
        /(?:youtube\.com\/embed\/)([\w-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = value.match(pattern);
        if (match) return match[1];
    }

    return /^[\w-]{11}$/.test(value.trim()) ? value.trim() : value;
}

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        youtube_id: '',
        thumbnail: '',
        description: '',
        category_id: '',
        is_featured: false,
        is_published: true,
        published_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/youtube');
    };

    return (
        <AdminLayout title="Add YouTube Video">

            <div className="mx-auto max-w-3xl">

                <Link
                    href="/admin/youtube"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to videos
                </Link>

                <h1 className="text-2xl font-black tracking-tight">
                    Add YouTube Video
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Paste a YouTube URL or video ID — the thumbnail is pulled automatically.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Title
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            YouTube URL or Video ID
                        </label>
                        <input
                            type="text"
                            value={data.youtube_id}
                            onChange={(e) => setData('youtube_id', extractYoutubeId(e.target.value))}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.youtube_id && <p className="mt-1 text-xs text-red-500">{errors.youtube_id}</p>}

                        {data.youtube_id && /^[\w-]{11}$/.test(data.youtube_id) && (
                            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
                                <img
                                    src={`https://img.youtube.com/vi/${data.youtube_id}/hqdefault.jpg`}
                                    alt="Preview"
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Custom Thumbnail URL <span className="normal-case text-gray-300">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.thumbnail}
                            onChange={(e) => setData('thumbnail', e.target.value)}
                            placeholder="Leave blank to use the YouTube thumbnail"
                            className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.thumbnail && <p className="mt-1 text-xs text-red-500">{errors.thumbnail}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="mt-2 block w-full resize-none rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Category
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">No category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Publish Date
                            </label>
                            <input
                                type="date"
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                                className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-6">

                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            Published
                        </label>

                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            Featured
                        </label>

                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/admin/youtube"
                            className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                        >
                            <PlayCircle className="h-4 w-4" strokeWidth={2} />
                            {processing ? 'Saving…' : 'Add Video'}
                        </button>
                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}