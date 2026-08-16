import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    Users,
    MessageCircle,
    MessagesSquare,
    PenSquare,
    PlayCircle,
    Newspaper,
    UserRound,
    Plus,
    ArrowRight,
    TrendingUp,
    Activity,
    UserPlus,
    FileText,
    CheckCircle2,
} from 'lucide-react';

export default function Dashboard({ stats, recentActivity, topPeopleStories, topEntertainmentPosts }) {

    const cards = [
        {
            title: 'Users',
            value: stats.users,
            delta: stats.usersThisWeek,
            icon: Users,
        },
        {
            title: 'Community Posts',
            value: stats.communityPosts,
            delta: stats.communityPostsThisWeek,
            icon: MessageCircle,
        },
        {
            title: 'Comments',
            value: stats.comments,
            icon: MessagesSquare,
        },
        {
            title: 'Pending Stories',
            value: stats.pendingStories,
            icon: PenSquare,
            highlight: stats.pendingStories > 0,
        },
        {
            title: 'YouTube Videos',
            value: stats.youtubeVideos,
            icon: PlayCircle,
        },
        {
            title: 'Entertainment',
            value: stats.entertainmentPosts,
            icon: Newspaper,
        },
        {
            title: 'People Stories',
            value: stats.peopleStories,
            icon: UserRound,
        },
    ];

    const activityIcons = {
        community_post: MessageCircle,
        story_submission: FileText,
        user_joined: UserPlus,
    };

    return (
        <AdminLayout title="Dashboard">

            <div>

                <div className="mb-8">

                    <p className="text-sm font-semibold text-red-600">
                        OVERVIEW
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight">
                        Welcome to TrendPulse
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage your content and community from one place.
                    </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                                    card.highlight ? 'border-red-200' : 'border-gray-100'
                                }`}
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            {card.title}
                                        </p>

                                        <p className="mt-3 text-3xl font-black">
                                            {card.value}
                                        </p>

                                        {typeof card.delta === 'number' && (
                                            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                                                <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                +{card.delta} this week
                                            </p>
                                        )}

                                    </div>

                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            card.highlight ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" strokeWidth={2} />
                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">

                    {/* Quick actions */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 lg:col-span-2">

                        <h2 className="text-lg font-black">
                            Quick Actions
                        </h2>

                        <div className="mt-5 grid grid-cols-2 gap-3">

                            <Link
                                href="/admin/youtube/create"
                                className="flex items-center gap-2 rounded-xl bg-black p-4 text-sm font-bold text-white transition hover:bg-gray-800"
                            >
                                <Plus className="h-4 w-4" strokeWidth={2.5} />
                                Add YouTube Video
                            </Link>

                            <Link
                                href="/admin/entertainment/create"
                                className="flex items-center gap-2 rounded-xl border border-gray-200 p-4 text-sm font-bold transition hover:bg-gray-50"
                            >
                                <Plus className="h-4 w-4" strokeWidth={2.5} />
                                Add News
                            </Link>

                            <Link
                                href="/admin/people/create"
                                className="flex items-center gap-2 rounded-xl border border-gray-200 p-4 text-sm font-bold transition hover:bg-gray-50"
                            >
                                <Plus className="h-4 w-4" strokeWidth={2.5} />
                                Add People Story
                            </Link>

                            <Link
                                href="/admin/story-submissions"
                                className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 p-4 text-sm font-bold transition hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                    Review Stories
                                </span>
                                {stats.pendingStories > 0 && (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                                        {stats.pendingStories}
                                    </span>
                                )}
                            </Link>

                        </div>

                        {/* Top content */}
                        <div className="mt-8 grid gap-6 sm:grid-cols-2">

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-700">
                                        Top People Stories
                                    </h3>
                                    <Link
                                        href="/admin/people"
                                        className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black"
                                    >
                                        View all
                                        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    {topPeopleStories.length > 0 ? (
                                        topPeopleStories.map((story, i) => (
                                            <Link
                                                key={story.id}
                                                href={`/admin/people/${story.slug}/edit`}
                                                className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-gray-50"
                                            >
                                                <span className="w-4 shrink-0 text-xs font-bold text-gray-300">
                                                    {i + 1}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate font-medium text-gray-700">
                                                    {story.title}
                                                </span>
                                                <span className="shrink-0 text-xs text-gray-400">
                                                    {story.views.toLocaleString()}
                                                </span>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="px-2 py-2 text-xs text-gray-400">No stories yet.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-700">
                                        Top Entertainment
                                    </h3>
                                    <Link
                                        href="/admin/entertainment"
                                        className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black"
                                    >
                                        View all
                                        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    {topEntertainmentPosts.length > 0 ? (
                                        topEntertainmentPosts.map((post, i) => (
                                            <Link
                                                key={post.id}
                                                href={`/admin/entertainment/${post.slug}/edit`}
                                                className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-gray-50"
                                            >
                                                <span className="w-4 shrink-0 text-xs font-bold text-gray-300">
                                                    {i + 1}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate font-medium text-gray-700">
                                                    {post.title}
                                                </span>
                                                <span className="shrink-0 text-xs text-gray-400">
                                                    {post.views.toLocaleString()}
                                                </span>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="px-2 py-2 text-xs text-gray-400">No posts yet.</p>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right column: Platform status + Activity */}
                    <div className="space-y-6">

                        <div className="rounded-2xl border border-gray-100 bg-white p-6">

                            <h2 className="text-lg font-black">
                                Platform
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Website
                                    </span>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                        Online
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Community
                                    </span>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                        Active
                                    </span>
                                </div>

                            </div>

                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-6">

                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                <h2 className="text-lg font-black">
                                    Recent Activity
                                </h2>
                            </div>

                            <div className="mt-5 space-y-4">

                                {recentActivity.length > 0 ? (
                                    recentActivity.map((item, i) => {
                                        const Icon = activityIcons[item.type] || Activity;

                                        return (
                                            <div key={i} className="flex gap-3">

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-800">
                                                        {item.label}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-500">
                                                        {item.detail}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        {item.user ? `${item.user} · ` : ''}{item.created_at}
                                                    </p>
                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-gray-400">No recent activity.</p>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </AdminLayout>
    );
}