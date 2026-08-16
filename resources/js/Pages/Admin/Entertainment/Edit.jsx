// resources/js/Pages/Admin/Entertainment/Edit.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { ArrowLeft, ImagePlus, Save, ExternalLink } from 'lucide-react';

export default function Edit({ post: postData, categories, authors }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(postData.featured_image);

    const { data, setData, post, processing, errors } = useForm({
        title: postData.title || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        featured_image: null,
        category_id: postData.category_id || '',
        author_id: postData.author_id || '',
        is_featured: postData.is_featured,
        is_popular: postData.is_popular,
        is_published: postData.is_published,
        published_at: postData.published_at ? postData.published_at.slice(0, 10) : '',
        _method: 'put',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/entertainment/${postData.slug}`, { forceFormData: true });
    };

    const handleImage = (e) => {
        const file = e.target.files[0] ?? null;
        setData('featured_image', file);
        setPreview(file ? URL.createObjectURL(file) : postData.featured_image);
    };

    return (
        <AdminLayout title="Edit Post">

            <div className="mx-auto max-w-3xl">

                <Link
                    href="/admin/entertainment"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to posts
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Edit Post
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {postData.views.toLocaleString()} views
                        </p>
                    </div>

                    <a
                        href={`/entertainment/${postData.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
                    >
                        <ExternalLink className="h-4 w-4" strokeWidth={2} />
                        View live
                    </a>
                </div>

                <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Featured Image
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 flex aspect-[21/9] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300"
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
                                    <p className="mt-2 text-sm font-medium">Click to upload an image</p>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImage}
                        />
                        {errors.featured_image && <p className="mt-1 text-xs text-red-500">{errors.featured_image}</p>}
                    </div>

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
                            Excerpt
                        </label>
                        <textarea
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            rows={2}
                            maxLength={500}
                            className="mt-2 block w-full resize-none rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Content
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={12}
                            className="mt-2 block w-full resize-y rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
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
                                Author
                            </label>
                            <select
                                value={data.author_id}
                                onChange={(e) => setData('author_id', e.target.value)}
                                className="mt-2 block w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">Unassigned</option>
                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>{author.name}</option>
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

                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={data.is_popular}
                                onChange={(e) => setData('is_popular', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            Popular
                        </label>

                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <Link
                            href="/admin/entertainment"
                            className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                        >
                            <Save className="h-4 w-4" strokeWidth={2} />
                            {processing ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}