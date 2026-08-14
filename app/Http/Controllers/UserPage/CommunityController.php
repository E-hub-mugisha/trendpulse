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
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        $posts = CommunityPost::query()
            ->where('status', 'published')
            ->with([
                'user:id,name,avatar',
                'comments' => fn ($q) => $q
                    ->whereNull('parent_id')
                    ->where('status', 'approved')
                    ->latest()
                    ->with([
                        'user:id,name,avatar',
                        'replies' => fn ($r) => $r
                            ->where('status', 'approved')
                            ->oldest()
                            ->with('user:id,name,avatar')
                            ->withCount('likes')
                            ->when($userId, fn ($l) => $l->with(['likes' => fn ($x) => $x->where('user_id', $userId)])),
                    ])
                    ->withCount('likes')
                    ->when($userId, fn ($l) => $l->with(['likes' => fn ($x) => $x->where('user_id', $userId)]))
                    ->limit(3),
            ])
            ->withCount([
                'likes',
                'comments' => fn ($q) => $q->where('status', 'approved'),
            ])
            ->when($userId, function ($q) use ($userId) {
                $q->with(['likes' => fn ($l) => $l->where('user_id', $userId)]);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($post) => [
                'id' => $post->id,
                'content' => $post->content,
                'image' => $post->image,
                'created_at' => $post->created_at->diffForHumans(),
                'user' => [
                    'name' => $post->user?->name,
                    'avatar' => $post->user?->avatar,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'liked_by_user' => $userId ? $post->likes->isNotEmpty() : false,
                'recent_comments' => $post->comments->map(fn ($comment) => $this->transformComment($comment, $userId)),
            ]);

        return Inertia::render('UserPages/Community/Index', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('community', 'public');
        }

        $request->user()->communityPosts()->create([
            'content' => $validated['content'],
            'image' => $imagePath ? "/storage/{$imagePath}" : null,
            'status' => 'published',
        ]);

        return back();
    }

    public function toggleLike(CommunityPost $post): RedirectResponse
    {
        $like = $post->likes()->where('user_id', request()->user()->id)->first();

        if ($like) {
            $like->delete();
        } else {
            $post->likes()->create(['user_id' => request()->user()->id]);
        }

        return back();
    }

    public function storeComment(Request $request, CommunityPost $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
        ]);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
            'status' => 'approved',
        ]);

        return back();
    }

    public function toggleCommentLike(Comment $comment): RedirectResponse
    {
        $like = $comment->likes()->where('user_id', request()->user()->id)->first();

        if ($like) {
            $like->delete();
        } else {
            $comment->likes()->create(['user_id' => request()->user()->id]);
        }

        return back();
    }

    private function transformComment(Comment $comment, ?int $userId): array
    {
        return [
            'id' => $comment->id,
            'content' => $comment->content,
            'created_at' => $comment->created_at->diffForHumans(),
            'user' => [
                'name' => $comment->user?->name,
                'avatar' => $comment->user?->avatar,
            ],
            'likes_count' => $comment->likes_count,
            'liked_by_user' => $userId ? $comment->likes->isNotEmpty() : false,
            'replies' => $comment->relationLoaded('replies')
                ? $comment->replies->map(fn ($reply) => $this->transformComment($reply, $userId))
                : [],
        ];
    }
}
