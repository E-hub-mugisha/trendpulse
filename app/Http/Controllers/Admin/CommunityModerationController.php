<?php
// app/Http/Controllers/Admin/CommunityModerationController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommunityPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommunityModerationController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = CommunityPost::query()
            ->with('user:id,name,email')
            ->withCount(['comments', 'likes'])
            ->when($request->search, function ($q, $search) {
                $q->where('content', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($post) => [
                'id' => $post->id,
                'content' => $post->content,
                'image' => $post->image,
                'status' => $post->status,
                'user' => [
                    'name' => $post->user?->name,
                    'email' => $post->user?->email,
                ],
                'comments_count' => $post->comments_count,
                'likes_count' => $post->likes_count,
                'created_at' => $post->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Community/Index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => CommunityPost::count(),
                'published' => CommunityPost::where('status', 'published')->count(),
                'pending' => CommunityPost::where('status', 'pending')->count(),
                'flagged' => CommunityPost::where('status', 'flagged')->count(),
                'totalComments' => Comment::count(),
                'pendingComments' => Comment::where('status', 'pending')->count(),
            ],
        ]);
    }

    public function show(CommunityPost $post): Response
    {
        $post->load('user:id,name,email');

        $comments = $post->comments()
            ->whereNull('parent_id')
            ->with([
                'user:id,name,email',
                'replies' => fn ($q) => $q->with('user:id,name,email')->withCount('likes'),
            ])
            ->withCount('likes')
            ->latest()
            ->get()
            ->map(fn ($comment) => $this->transformComment($comment));

        return Inertia::render('Admin/Community/Show', [
            'post' => [
                'id' => $post->id,
                'content' => $post->content,
                'image' => $post->image,
                'status' => $post->status,
                'user' => [
                    'name' => $post->user?->name,
                    'email' => $post->user?->email,
                ],
                'likes_count' => $post->likes()->count(),
                'created_at' => $post->created_at->format('M j, Y \a\t g:i A'),
            ],
            'comments' => $comments,
        ]);
    }

    public function updateStatus(Request $request, CommunityPost $post): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['published', 'pending', 'flagged'])],
        ]);

        $post->update($validated);

        return back()->with('success', 'Post status updated.');
    }

    public function destroy(CommunityPost $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('admin.community.index')
            ->with('success', 'Post deleted.');
    }

    public function updateCommentStatus(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['approved', 'pending', 'flagged'])],
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment status updated.');
    }

    public function destroyComment(Comment $comment): RedirectResponse
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }

    private function transformComment(Comment $comment): array
    {
        return [
            'id' => $comment->id,
            'content' => $comment->content,
            'status' => $comment->status,
            'likes_count' => $comment->likes_count,
            'user' => [
                'name' => $comment->user?->name,
                'email' => $comment->user?->email,
            ],
            'created_at' => $comment->created_at->diffForHumans(),
            'replies' => $comment->relationLoaded('replies')
                ? $comment->replies->map(fn ($reply) => $this->transformComment($reply))
                : [],
        ];
    }
}