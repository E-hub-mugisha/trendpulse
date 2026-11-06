import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

/**
 * variant: 'default' (grid card) | 'featured' (large overlay) | 'compact' (horizontal row)
 */
export default function NewsCard({ post, variant = 'default' }) {
    const href = `/entertainment/${post.slug}`;
    const image = post.featured_image ? (
        <img
            src={post.featured_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
    ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0A599E]/10 to-slate-100 text-xs font-medium text-slate-400">
            Entertainment
        </div>
    );

    const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2';

    if (variant === 'featured') {
        return (
            <Link href={href} className={`group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 sm:aspect-[16/11] ${ring}`}>
                {image}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white px-3 py-1 text-[#0A599E]">{post.category || 'Entertainment'}</span>
                        <span className="text-white/70">{post.date || 'Latest'}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-extrabold leading-tight text-white sm:text-2xl">{post.title}</h3>
                    {post.excerpt && <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-white/75">{post.excerpt}</p>}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        Read story
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.4} />
                    </span>
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={href} className={`group flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 transition hover:border-[#0A599E]/40 hover:shadow-md ${ring}`}>
                <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:w-28">{image}</div>
                <div className="min-w-0 py-0.5">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#0A599E]">{post.category || 'Entertainment'}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400">{post.date || 'Latest'}</span>
                    </div>
                    <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 transition group-hover:text-[#0A599E]">{post.title}</h3>
                    {post.excerpt && <p className="mt-1 line-clamp-1 text-xs text-slate-500">{post.excerpt}</p>}
                </div>
            </Link>
        );
    }

    return (
        <Link href={href} className={`group block rounded-2xl ${ring}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">{image}</div>
            <div className="mt-3.5">
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#0A599E]">{post.category || 'Entertainment'}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">{post.date || 'Latest'}</span>
                </div>
                <h3 className="mt-1.5 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-[#0A599E]">{post.title}</h3>
                {post.excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>}
            </div>
        </Link>
    );
}