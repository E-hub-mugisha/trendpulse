import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function CommunityPost({
    post,
    isAuthenticated = false,
}) {
    const { auth } = usePage().props;

    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const {
        data,
        setData,
        post: submitComment,
        processing,
        errors,
        reset,
    } = useForm({
        content: "",
        parent_id: null,
    });

    /*
    |--------------------------------------------------------------------------
    | Submit comment
    |--------------------------------------------------------------------------
    */

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (!data.content.trim() || processing) {
            return;
        }

        submitComment(
            `/community/${post.id}/comments`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    reset();

                    setReplyingTo(null);

                    setShowComments(true);
                },

                onError: (formErrors) => {
                    console.error(
                        "Comment validation error:",
                        formErrors
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Like post
    |--------------------------------------------------------------------------
    */

    const handleLike = () => {
        if (!isAuthenticated) {
            return;
        }

        router.post(
            `/community/${post.id}/like`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Like comment
    |--------------------------------------------------------------------------
    */

    const handleCommentLike = (commentId) => {
        if (!isAuthenticated) {
            return;
        }

        router.post(
            `/community/comments/${commentId}/like`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Start reply
    |--------------------------------------------------------------------------
    */

    const handleReply = (comment) => {
        setReplyingTo(comment);

        setData({
            content: "",
            parent_id: comment.id,
        });

        setShowComments(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Cancel reply
    |--------------------------------------------------------------------------
    */

    const cancelReply = () => {
        setReplyingTo(null);

        setData({
            content: "",
            parent_id: null,
        });

        reset();
    };

    return (
        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* ==========================================================
                POST
            ========================================================== */}

            <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {post.user?.avatar ? (
                            <img
                                src={post.user.avatar}
                                alt={post.user.name || "User"}
                                className="h-11 w-11 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A599E] text-sm font-bold text-white">
                                {post.user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-bold text-black">
                                {post.user?.name ||
                                    "Anonymous"}
                            </h3>

                            <p className="mt-0.5 text-xs text-gray-400">
                                {post.created_at}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                        {post.content}
                    </p>

                    {post.image && (
                        <div className="mt-4 overflow-hidden rounded-2xl">
                            <img
                                src={post.image}
                                alt="Community post"
                                className="max-h-[600px] w-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-6 border-t border-gray-100 pt-4">
                    {/* Like */}
                    <button
                        type="button"
                        disabled={!isAuthenticated}
                        onClick={handleLike}
                        className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
                            post.liked_by_user
                                ? "text-[#0A599E]"
                                : "text-gray-500 hover:text-[#0A599E]"
                        }`}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill={
                                post.liked_by_user
                                    ? "currentColor"
                                    : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Zm0 0 4-7a2 2 0 0 1 4 1.2V7h5a2 2 0 0 1 2 2.3l-1 8A3 3 0 0 1 18 20H7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>
                            {post.likes_count || 0}
                        </span>
                    </button>

                    {/* Comments */}
                    <button
                        type="button"
                        onClick={() =>
                            setShowComments(
                                !showComments
                            )
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#0A599E]"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                d="M21 11.5a8.38 8.38 0 0 1-1 4.2 8.5 8.5 0 0 1-7.5 4.3 8.38 8.38 0 0 1-4.2-1L3 21l1.5-5.3a8.38 8.38 0 0 1-1-4.2 8.5 8.5 0 0 1 4.3-7.5 8.38 8.38 0 0 1 4.2-1h.5a8.5 8.5 0 0 1 8.5 8.5v.5Z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>
                            {post.comments_count || 0}
                        </span>
                    </button>
                </div>
            </div>

            {/* ==========================================================
                COMMENTS
            ========================================================== */}

            {showComments && (
                <div className="border-t border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                    {/* Comment form */}
                    {isAuthenticated && (
                        <form
                            onSubmit={
                                handleCommentSubmit
                            }
                        >
                            {/* Reply indicator */}
                            {replyingTo && (
                                <div className="mb-3 flex items-center justify-between rounded-xl bg-[#0A599E]/5 px-3 py-2">
                                    <span className="text-xs text-gray-600">
                                        Replying to{" "}
                                        <strong className="text-black">
                                            {
                                                replyingTo
                                                    .user
                                                    ?.name
                                            }
                                        </strong>
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            cancelReply
                                        }
                                        className="text-xs font-bold text-gray-500 transition hover:text-red-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {/* Avatar */}
                                {auth?.user?.avatar ? (
                                    <img
                                        src={
                                            auth.user
                                                .avatar
                                        }
                                        alt={
                                            auth.user
                                                .name
                                        }
                                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A599E] text-xs font-bold text-white">
                                        {auth?.user?.name
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase() ||
                                            "U"}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <textarea
                                        value={
                                            data.content
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "content",
                                                e.target.value
                                            )
                                        }
                                        placeholder={
                                            replyingTo
                                                ? "Write a reply..."
                                                : "Write a comment..."
                                        }
                                        rows={2}
                                        disabled={
                                            processing
                                        }
                                        className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/20 disabled:opacity-50"
                                    />

                                    {errors.content && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {
                                                errors.content
                                            }
                                        </p>
                                    )}

                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !data.content.trim()
                                            }
                                            className="rounded-full bg-[#0A599E] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#07406F] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {processing
                                                ? "Posting..."
                                                : replyingTo
                                                ? "Reply"
                                                : "Comment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* ==================================================
                        COMMENTS LIST
                    ================================================== */}

                    <div className="mt-6 space-y-5">
                        {post.recent_comments?.length > 0 ? (
                            post.recent_comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    isAuthenticated={isAuthenticated}
                                    onReply={handleReply}
                                    onLike={handleCommentLike}
                                />
                            ))
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-sm text-gray-400">
                                    No comments yet.
                                </p>

                                {isAuthenticated && (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Be the first to
                                        comment.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}


/*
|--------------------------------------------------------------------------
| Comment Component
|--------------------------------------------------------------------------
*/

function CommentItem({
    comment,
    isAuthenticated,
    onReply,
    onLike,
}) {
    return (
        <div>
            {/* Main comment */}
            <div className="flex gap-3">
                {/* Avatar */}
                {comment.user?.avatar ? (
                    <img
                        src={comment.user.avatar}
                        alt={
                            comment.user.name ||
                            "User"
                        }
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                        {comment.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {/* Comment bubble */}
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-black">
                                {comment.user?.name ||
                                    "Anonymous"}
                            </span>

                            <span className="text-[10px] text-gray-400">
                                {
                                    comment.created_at
                                }
                            </span>
                        </div>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-1 flex items-center gap-4 px-2">
                        <button
                            type="button"
                            disabled={
                                !isAuthenticated
                            }
                            onClick={() =>
                                onLike(comment.id)
                            }
                            className={`text-xs font-semibold transition ${
                                comment.liked_by_user
                                    ? "text-[#0A599E]"
                                    : "text-gray-400 hover:text-[#0A599E]"
                            }`}
                        >
                            Like
                            {comment.likes_count >
                                0 &&
                                ` (${comment.likes_count})`}
                        </button>

                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={() =>
                                    onReply(
                                        comment
                                    )
                                }
                                className="text-xs font-semibold text-gray-400 transition hover:text-[#0A599E]"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies */}
            {comment.replies?.length > 0 && (
                <div className="ml-12 mt-3 space-y-3">
                    {comment.replies.map(
                        (reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                isAuthenticated={
                                    isAuthenticated
                                }
                                onReply={onReply}
                                onLike={onLike}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}