<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EntertainmentPost;
use Inertia\Inertia;
use Inertia\Response;

class EntertainmentController extends Controller
{
    public function index(): Response
    {
        $posts = EntertainmentPost::query()
            ->with('category')
            ->where('is_published', true)
            ->latest('published_at')
            ->paginate(9)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'featured_image' => $post->featured_image,
                    'excerpt' => $post->excerpt,
                    'category' => $post->category?->name,
                    'author_name' => $post->author_name,
                    'views' => $post->views,
                    'date' => $post->published_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('UserPages/Entertainment/Index', [
            'posts' => $posts,
        ]);
    }

    public function show(EntertainmentPost $post): Response
    {
        abort_unless($post->is_published, 404);

        $post->increment('views');

        $relatedPosts = EntertainmentPost::query()
            ->where('id', '!=', $post->id)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('UserPages/Entertainment/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'featured_image' => $post->featured_image,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'category' => $post->category?->name,
                'author_name' => $post->author_name,
                'views' => $post->views,
                'date' => $post->published_at?->format('M d, Y'),
            ],
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
