<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function index(): Response
    {
        $posts = CommunityPost::query()
            ->with('user')
            ->withCount([
                'likes',
                'comments',
            ])
            ->where('status', 'published')
            ->latest()
            ->paginate(10)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'image' => $post->image,
                    'created_at' => $post->created_at->diffForHumans(),

                    'user' => [
                        'name' => $post->user->name,
                    ],

                    'likes_count' => $post->likes_count,
                    'comments_count' => $post->comments_count,
                ];
            });

        return Inertia::render('UserPages/Community/Index', [
            'posts' => $posts,
        ]);
    }
}
