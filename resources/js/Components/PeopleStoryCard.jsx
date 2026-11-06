import { Link } from '@inertiajs/react';
import { ArrowRight, Eye, Flame, TrendingUp } from 'lucide-react';

export default function PeopleStoryCard({ story }) {
    const badge = story.is_popular
        ? { label: 'Popular', Icon: Flame }
        : story.trending_views_count > 0
        ? { label: 'Trending', Icon: TrendingUp }
        : null;

    return (
        <Link
            href={`/people/${story.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E]"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                {story.featured_image ? (
                    <img
                        src={story.featured_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0A599E]/15 to-slate-100 text-sm text-slate-400">Story</div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

                {badge && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#0A599E] shadow-sm backdrop-blur">
                        <badge.Icon className="h-3 w-3" strokeWidth={2.5} /> {badge.label}
                    </span>
                )}

                {typeof story.views === 'number' && (
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur">
                        <Eye className="h-3 w-3" /> {story.views.toLocaleString()}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold text-[#0A599E]">{story.category || 'Relationship'}</p>
                <h3 className="mt-1.5 line-clamp-2 text-lg font-bold leading-6 text-slate-900">{story.title}</h3>
                {story.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{story.excerpt}</p>}

                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-slate-900 transition-all group-hover:gap-2.5 group-hover:text-[#0A599E]">
                    Read their story <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </span>
            </div>
        </Link>
    );
}