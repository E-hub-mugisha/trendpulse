import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Film, MessagesSquare, Newspaper, Users } from 'lucide-react';
import PublicLayout from '../Layouts/PublicLayout';
import Hero from '../../Components/Hero';
import SectionHeading from '../../Components/SectionHeading';
import VideoCard from '../../Components/VideoCard';
import NewsCard from '../../Components/NewsCard';
import PeopleStoryCard from '../../Components/PeopleStoryCard';
import CommunityPost from '../../Components/CommunityPost';
import ShareStoryCTA from '../../Components/ShareStoryCTA';

export default function Home({
    featuredVideos = [],
    latestVideos = [],
    latestNews = [],
    featuredStories = [],
    communityPosts = [],
}) {
    return (
        <PublicLayout>
            <Hero />

            <VideoSection videos={latestVideos} />
            <EntertainmentSection posts={latestNews} />
            <PeopleSection stories={featuredStories} />
            <CommunitySection posts={communityPosts} />

            <ShareStoryCTA />
        </PublicLayout>
    );
}

/* ---------------------------- Watch (tabs) ---------------------------- */

function VideoSection({ videos }) {
    const categories = useMemo(() => ['All', ...new Set(videos.map((v) => v.category).filter(Boolean))], [videos]);
    const [category, setCategory] = useState('All');

    const filtered = useMemo(
        () => (category === 'All' ? videos : videos.filter((v) => v.category === category)),
        [videos, category],
    );
    const [first, ...others] = filtered;
    const rest = others.slice(0, 4);

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
                eyebrow="Watch"
                title="Latest stories"
                description="Real conversations, experiences and stories from our YouTube channel."
                linkText="View all videos"
                linkHref="/youtube"
            />

            {videos.length > 0 ? (
                <>
                    {categories.length > 2 && (
                        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter videos by category">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    role="tab"
                                    aria-selected={category === c}
                                    onClick={() => setCategory(c)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] ${
                                        category === c ? 'bg-[#0A599E] text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#0A599E] hover:ring-[#0A599E]/40'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}

                    {first && (
                        <div key={category} className="tp-slide-up grid gap-6 lg:grid-cols-12 lg:gap-8">
                            <div className={rest.length ? 'lg:col-span-7' : 'lg:col-span-12'}>
                                <VideoCard video={first} variant="featured" />
                            </div>
                            {rest.length > 0 && (
                                <div className="flex flex-col gap-1 lg:col-span-5">
                                    <p className="px-2 pb-1 text-sm font-semibold text-slate-400">Up next</p>
                                    {rest.map((v) => (
                                        <VideoCard key={v.id} video={v} variant="compact" />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <EmptyState icon={Film} title="Stories are coming soon" text="Our latest YouTube stories will appear here." />
            )}
        </section>
    );
}

/* ------------------------- Entertainment (mirror) ------------------------- */

function EntertainmentSection({ posts }) {
    const [first, ...rest] = posts.slice(0, 3);

    return (
        <section className="border-y border-slate-200/70 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <SectionHeading
                    eyebrow="Entertainment"
                    title="What’s happening"
                    description="The latest entertainment, lifestyle and culture stories."
                    linkText="Explore entertainment"
                    linkHref="/entertainment"
                />

                {first ? (
                    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                        {rest.length > 0 && (
                            <div className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-5">
                                {rest.map((p) => (
                                    <NewsCard key={p.id} post={p} variant="compact" />
                                ))}
                            </div>
                        )}
                        <div className={`order-1 lg:order-2 ${rest.length ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                            <NewsCard post={first} variant="featured" />
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={Newspaper} title="No stories yet" text="Entertainment stories will appear here." />
                )}
            </div>
        </section>
    );
}

/* --------------------------- People (dark carousel) --------------------------- */

function PeopleSection({ stories }) {
    const scroller = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const list = stories.slice(0, 6);

    const update = () => {
        const el = scroller.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 8);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };

    useEffect(() => {
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [list.length]);

    const scrollBy = (dir) => {
        const el = scroller.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: reduce ? 'auto' : 'smooth' });
    };

    const navBtn =
        'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white hover:text-[#07406F] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

    return (
        <section className="relative overflow-hidden bg-[#07406F]">
            <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#0A599E]/50 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                        tone="dark"
                        className="flex-1"
                        eyebrow="People"
                        title="Real relationships. Real experiences."
                        description="Meet people who are willing to share the stories behind their relationships and journeys."
                    />
                    <div className="flex items-center gap-2">
                        <Link href="/people" className="mr-2 hidden items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white sm:inline-flex">
                            Meet our people <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous stories" className={navBtn}><ChevronLeft className="h-5 w-5" /></button>
                        <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next stories" className={navBtn}><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </div>

                {list.length > 0 ? (
                    <div
                        ref={scroller}
                        onScroll={update}
                        className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
                        tabIndex={0}
                        role="region"
                        aria-label="People stories"
                    >
                        {list.map((s) => (
                            <div key={s.id} className="w-[75%] shrink-0 snap-start sm:w-[300px]">
                                <PeopleStoryCard story={s} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8">
                        <EmptyState dark icon={Users} title="Stories from our people are coming" text="Relationship and life stories will appear here." />
                    </div>
                )}

                <Link href="/people" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white sm:hidden">
                    Meet our people <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

/* ------------------------- Community (sticky intro + feed) ------------------------- */

function CommunitySection({ posts }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
                        <SectionHeading
                            className="mb-6"
                            eyebrow="Community"
                            title="Join the conversation"
                            description="Ask questions, share experiences and connect with people in the community."
                        />
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/community"
                                className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#0A599E] px-6 text-sm font-semibold text-white transition hover:bg-[#07406F] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A599E] focus-visible:ring-offset-2"
                            >
                                Visit community
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    {posts.length > 0 ? (
                        <div className="space-y-5">
                            {posts.slice(0, 4).map((post) => (
                                <CommunityPost key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={MessagesSquare} title="The community is waiting for you" text="Be one of the first people to start a conversation." />
                    )}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------- Empty state -------------------------------- */

function EmptyState({ icon: Icon, title, text, dark = false }) {
    return (
        <div className={`rounded-3xl border border-dashed px-6 py-14 text-center ${dark ? 'border-white/25 bg-white/5' : 'border-[#0A599E]/25 bg-[#0A599E]/5'}`}>
            <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-[#0A599E]/10 text-[#0A599E]'}`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className={`mt-4 text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <p className={`mx-auto mt-1.5 max-w-md text-sm ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{text}</p>
        </div>
    );
}