// resources/js/Pages/Admin/Entertainment/Create.jsx
//
// Rich text editor: Tiptap (headless, works cleanly with Tailwind — no extra
// CSS framework required). Install before using this file:
//
//   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
//
// `data.content` is kept as an HTML string, same as a textarea would produce,
// so nothing on the Laravel/controller side needs to change.

import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { useRef, useState, useCallback } from 'react';
import { ArrowLeft, ImagePlus, Newspaper } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link_ from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link2,
    Link2Off,
    Undo2,
    Redo2,
} from 'lucide-react';

export default function Create({ categories, authors }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        excerpt: '',
        content: '',
        featured_image: null,
        category_id: '',
        author_id: '',
        is_featured: false,
        is_popular: false,
        is_published: true,
        published_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/entertainment', { forceFormData: true });
    };

    const handleImage = (e) => {
        const file = e.target.files[0] ?? null;
        setData('featured_image', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <AdminLayout title="Add Entertainment Post">

            <div className="mx-auto max-w-3xl">

                <Link
                    href="/admin/entertainment"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to posts
                </Link>

                <h1 className="text-2xl font-black tracking-tight">
                    Add Entertainment Post
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new entertainment or lifestyle article.
                </p>

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
                            placeholder="A short summary shown in cards and previews"
                            className="mt-2 block w-full resize-none rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Content
                        </label>
                        <RichTextEditor
                            value={data.content}
                            onChange={(html) => setData('content', html)}
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
                                <option value="">Default (me)</option>
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
                            <Newspaper className="h-4 w-4" strokeWidth={2} />
                            {processing ? 'Saving…' : 'Publish Post'}
                        </button>
                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* Rich text editor (Tiptap)                                                  */
/* -------------------------------------------------------------------------- */

function RichTextEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link_.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
            }),
            Placeholder.configure({
                placeholder: 'Write the article…',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'rte-content min-h-[280px] px-4 py-3 text-sm leading-6 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl ?? 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="mt-2 overflow-hidden rounded-xl border border-transparent bg-gray-100 focus-within:ring-2 focus-within:ring-black">
            <RteToolbar editor={editor} onSetLink={setLink} />
            <div className="border-t border-gray-200 bg-white">
                <EditorContent editor={editor} />
            </div>
            <RteStyles />
        </div>
    );
}

function RteToolbar({ editor, onSetLink }) {
    const buttons = [
        {
            icon: BoldIcon,
            label: 'Bold',
            active: editor.isActive('bold'),
            onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
            icon: ItalicIcon,
            label: 'Italic',
            active: editor.isActive('italic'),
            onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            icon: Strikethrough,
            label: 'Strikethrough',
            active: editor.isActive('strike'),
            onClick: () => editor.chain().focus().toggleStrike().run(),
        },
        { divider: true },
        {
            icon: Heading2,
            label: 'Heading',
            active: editor.isActive('heading', { level: 2 }),
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            icon: Heading3,
            label: 'Subheading',
            active: editor.isActive('heading', { level: 3 }),
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        { divider: true },
        {
            icon: List,
            label: 'Bullet list',
            active: editor.isActive('bulletList'),
            onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            icon: ListOrdered,
            label: 'Numbered list',
            active: editor.isActive('orderedList'),
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
            icon: Quote,
            label: 'Quote',
            active: editor.isActive('blockquote'),
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
        },
        { divider: true },
        {
            icon: Link2,
            label: 'Add link',
            active: editor.isActive('link'),
            onClick: onSetLink,
        },
        {
            icon: Link2Off,
            label: 'Remove link',
            active: false,
            disabled: !editor.isActive('link'),
            onClick: () => editor.chain().focus().unsetLink().run(),
        },
        { divider: true },
        {
            icon: Undo2,
            label: 'Undo',
            active: false,
            disabled: !editor.can().undo(),
            onClick: () => editor.chain().focus().undo().run(),
        },
        {
            icon: Redo2,
            label: 'Redo',
            active: false,
            disabled: !editor.can().redo(),
            onClick: () => editor.chain().focus().redo().run(),
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
            {buttons.map((btn, i) =>
                btn.divider ? (
                    <span key={i} className="mx-1 h-5 w-px bg-gray-300" />
                ) : (
                    <button
                        key={btn.label}
                        type="button"
                        title={btn.label}
                        disabled={btn.disabled}
                        onClick={btn.onClick}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            btn.active
                                ? 'bg-black text-white'
                                : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                        } disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
                    >
                        <btn.icon className="h-4 w-4" strokeWidth={2.25} />
                    </button>
                )
            )}
        </div>
    );
}

function RteStyles() {
    return (
        <style>{`
            .rte-content { outline: none; }
            .rte-content p { margin: 0 0 0.75em; }
            .rte-content p:last-child { margin-bottom: 0; }
            .rte-content h2 { font-size: 1.25rem; font-weight: 800; margin: 1.2em 0 0.5em; letter-spacing: -0.01em; }
            .rte-content h3 { font-size: 1.05rem; font-weight: 700; margin: 1em 0 0.4em; }
            .rte-content h2:first-child, .rte-content h3:first-child { margin-top: 0; }
            .rte-content ul, .rte-content ol { margin: 0 0 0.75em; padding-left: 1.4em; }
            .rte-content ul { list-style: disc; }
            .rte-content ol { list-style: decimal; }
            .rte-content li { margin: 0.2em 0; }
            .rte-content blockquote {
                margin: 0.75em 0;
                padding: 0.25em 0 0.25em 1em;
                border-left: 3px solid #111827;
                color: #4b5563;
                font-style: italic;
            }
            .rte-content a { color: #111827; text-decoration: underline; text-underline-offset: 2px; }
            .rte-content strong { font-weight: 800; }
            .rte-content code {
                background: #f3f4f6;
                border-radius: 4px;
                padding: 0.1em 0.35em;
                font-size: 0.85em;
            }
            .rte-content p.is-editor-empty:first-child::before {
                content: attr(data-placeholder);
                float: left;
                color: #9ca3af;
                pointer-events: none;
                height: 0;
            }
        `}</style>
    );
}