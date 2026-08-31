import { Link, router } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { Heart, MessageCircle, CheckCheck } from 'lucide-react';

export default function Index({ notifications }) {
    const markAllRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const openNotification = (n) => {
        if (!n.read_at) {
            router.post(`/notifications/${n.id}/read`, {}, { preserveScroll: true });
        }
        router.visit(`/community#post-${n.data.post_id}`);
    };

    return (
        <PublicLayout title="Notifications">
            <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6">

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-black">Notifications</h1>
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0A599E] hover:underline"
                    >
                        <CheckCheck className="h-4 w-4" strokeWidth={2} />
                        Mark all as read
                    </button>
                </div>

                {notifications.data.length === 0 ? (
                    <p className="text-sm text-gray-400">You're all caught up.</p>
                ) : (
                    <div className="space-y-2">
                        {notifications.data.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => openNotification(n)}
                                className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition hover:bg-gray-50 ${
                                    !n.read_at ? 'bg-[#0A599E]/5' : ''
                                }`}
                            >
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                                    {n.type === 'like' ? (
                                        <Heart className="h-4 w-4" strokeWidth={2} />
                                    ) : (
                                        <MessageCircle className="h-4 w-4" strokeWidth={2} />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold text-black">
                                            {n.type === 'like' ? n.data.liker_name : n.data.commenter_name}
                                        </span>{' '}
                                        {n.type === 'like'
                                            ? 'liked your post'
                                            : `commented: "${n.data.excerpt}"`}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">{n.created_at}</p>
                                </div>

                                {!n.read_at && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0A599E]" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}