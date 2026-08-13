export default function CommunityPost({ post }) {
    return (
        <article className="rounded-3xl border border-gray-100 bg-white p-6">

            <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 font-bold">
                    {post.user?.name?.charAt(0) || 'U'}
                </div>

                <div>
                    <p className="text-sm font-bold">
                        {post.user?.name || 'Community Member'}
                    </p>

                    <p className="text-xs text-gray-400">
                        {post.created_at || 'Recently'}
                    </p>
                </div>

            </div>

            <p className="mt-5 text-base leading-7 text-gray-700">
                {post.content}
            </p>

            <div className="mt-6 flex items-center gap-6 border-t border-gray-100 pt-5 text-sm font-semibold text-gray-500">
                <button className="transition hover:text-black">
                    ♡ {post.likes_count || 0}
                </button>

                <button className="transition hover:text-black">
                    💬 {post.comments_count || 0}
                </button>

                <button className="transition hover:text-black">
                    ↗ Share
                </button>
            </div>

        </article>
    );
}