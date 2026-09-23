<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommunityPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    /**
     * Display community posts.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        $posts = CommunityPost::query()
            ->where('status', 'published')
            ->with([
                'user:id,name,avatar',

                'comments' => function ($query) use ($userId) {
                    $query
                        ->whereNull('parent_id')
                        ->where('status', 'approved')
                        ->latest()
                        ->limit(3)
                        ->with([
                            'user:id,name,avatar',

                            'replies' => function ($replyQuery) use ($userId) {
                                $replyQuery
                                    ->where('status', 'approved')
                                    ->oldest()
                                    ->with('user:id,name,avatar')
                                    ->withCount('likes')
                                    ->when(
                                        $userId,
                                        fn ($q) => $q->with([
                                            'likes' => fn ($likeQuery) =>
                                                $likeQuery->where(
                                                    'user_id',
                                                    $userId
                                                ),
                                        ])
                                    );
                            },
                        ])
                        ->withCount('likes')
                        ->when(
                            $userId,
                            fn ($q) => $q->with([
                                'likes' => fn ($likeQuery) =>
                                    $likeQuery->where(
                                        'user_id',
                                        $userId
                                    ),
                            ])
                        );
                },
            ])
            ->withCount([
                'likes',
                'comments' => fn ($query) =>
                    $query->where('status', 'approved'),
            ])
            ->when(
                $userId,
                fn ($query) => $query->with([
                    'likes' => fn ($likeQuery) =>
                        $likeQuery->where('user_id', $userId),
                ])
            )
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($post) use ($userId) {
                return [
                    'id' => $post->id,

                    'content' => $post->content,

                    'image' => $post->image,

                    'created_at' => $post->created_at
                        ? $post->created_at->diffForHumans()
                        : null,

                    'user' => [
                        'name' => $post->user?->name,
                        'avatar' => $post->user?->avatar,
                    ],

                    'likes_count' => $post->likes_count,

                    'comments_count' => $post->comments_count,

                    'liked_by_user' => $userId
                        ? $post->likes->isNotEmpty()
                        : false,

                    'recent_comments' => $post->comments->map(
                        fn ($comment) =>
                            $this->transformComment(
                                $comment,
                                $userId
                            )
                    )->values(),
                ];
            });

        return Inertia::render(
            'UserPages/Community/Index',
            [
                'posts' => $posts,
            ]
        );
    }

    /**
     * Create a community post.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => [
                'required',
                'string',
                'max:2000',
            ],

            'image' => [
                'nullable',
                'image',
                'max:4096',
            ],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request
                ->file('image')
                ->store('community', 'public');
        }

        $request->user()
            ->communityPosts()
            ->create([
                'content' => $validated['content'],

                'image' => $imagePath
                    ? "/storage/{$imagePath}"
                    : null,

                'status' => 'published',
            ]);

        return back()->with(
            'success',
            'Your post has been published.'
        );
    }

    /**
     * Like / unlike a post.
     */
    public function toggleLike(
        CommunityPost $post
    ): RedirectResponse {
        $userId = request()->user()->id;

        $like = $post
            ->likes()
            ->where('user_id', $userId)
            ->first();

        if ($like) {
            $like->delete();
        } else {
            $newLike = $post->likes()->create([
                'user_id' => $userId,
            ]);

            if ($post->user_id !== $userId) {
                $post->user?->notify(
                    new \App\Notifications\NewLikeNotification(
                        $newLike
                    )
                );
            }
        }

        return back();
    }

    /**
     * Store a comment or reply.
     */
    public function storeComment(
        Request $request,
        CommunityPost $post
    ): RedirectResponse {
        $validated = $request->validate([
            'content' => [
                'required',
                'string',
                'max:1000',
            ],

            'parent_id' => [
                'nullable',
                'integer',
                'exists:comments,id',
            ],
        ]);

        $parentComment = null;

        /*
         * If this is a reply, make sure the parent comment
         * actually belongs to this community post.
         */
        if (!empty($validated['parent_id'])) {
            $parentComment = Comment::query()
                ->where('id', $validated['parent_id'])
                ->where(
                    'commentable_type',
                    CommunityPost::class
                )
                ->where(
                    'commentable_id',
                    $post->id
                )
                ->first();

            if (!$parentComment) {
                return back()->withErrors([
                    'content' =>
                        'The comment you are replying to is invalid.',
                ]);
            }
        }

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,

            'content' => $validated['content'],

            'parent_id' => $parentComment?->id,

            'status' => 'approved',
        ]);

        /*
         * Notify post owner.
         */
        if ($post->user_id !== $request->user()->id) {
            $post->user?->notify(
                new \App\Notifications\NewCommentNotification(
                    $comment
                )
            );
        }

        /*
         * Notify parent comment owner when this is a reply.
         */
        if (
            $parentComment &&
            $parentComment->user_id !== $request->user()->id
        ) {
            $parentComment->user?->notify(
                new \App\Notifications\NewCommentNotification(
                    $comment
                )
            );
        }

        return back()->with(
            'success',
            $parentComment
                ? 'Your reply has been posted.'
                : 'Your comment has been posted.'
        );
    }

    /**
     * Like / unlike a comment.
     */
    public function toggleCommentLike(
        Comment $comment
    ): RedirectResponse {
        $userId = request()->user()->id;

        $like = $comment
            ->likes()
            ->where('user_id', $userId)
            ->first();

        if ($like) {
            $like->delete();
        } else {
            $newLike = $comment->likes()->create([
                'user_id' => $userId,
            ]);

            if ($comment->user_id !== $userId) {
                $comment->user?->notify(
                    new \App\Notifications\NewLikeNotification(
                        $newLike
                    )
                );
            }
        }

        return back();
    }

    /**
     * Delete a community post.
     */
    public function destroy(
        CommunityPost $post
    ): RedirectResponse {
        abort_unless(
            $post->user_id === request()->user()->id,
            403
        );

        $post->delete();

        return back()->with(
            'success',
            'Post deleted successfully.'
        );
    }

    /**
     * Transform comments for Inertia.
     */
    private function transformComment(
        Comment $comment,
        ?int $userId
    ): array {
        return [
            'id' => $comment->id,

            'content' => $comment->content,

            'created_at' => $comment->created_at
                ? $comment->created_at->diffForHumans()
                : null,

            'user' => [
                'name' => $comment->user?->name,
                'avatar' => $comment->user?->avatar,
            ],

            'likes_count' => $comment->likes_count ?? 0,

            'liked_by_user' => $userId
                ? $comment->likes->isNotEmpty()
                : false,

            'replies' => $comment->relationLoaded('replies')
                ? $comment->replies
                    ->map(
                        fn ($reply) =>
                            $this->transformComment(
                                $reply,
                                $userId
                            )
                    )
                    ->values()
                : [],
        ];
    }
}