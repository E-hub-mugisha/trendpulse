<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\EntertainmentPost;
use App\Models\PeopleStory;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featuredVideos = YoutubeVideo::query()
            ->where('is_published', true)
            ->where('is_featured', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        $latestVideos = YoutubeVideo::query()
            ->with('category')
            ->where('is_published', true)
            ->latest('published_at')
            ->take(6)
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'slug' => $video->slug,
                    'youtube_id' => $video->youtube_id,
                    'thumbnail_url' => $video->thumbnail_url,
                    'description' => $video->description,
                    'category' => $video->category?->name,
                    'views' => $video->views,
                ];
            });

        $latestNews = EntertainmentPost::query()
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        $featuredStories = PeopleStory::query()
            ->where('is_published', true)
            ->where('is_featured', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        $communityPosts = CommunityPost::query()
            ->where('status', 'published')
            ->with('user')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'created_at' => $post->created_at->diffForHumans(),
                    'user' => [
                        'name' => $post->user->name,
                    ],
                    'likes_count' => $post->likes()->count(),
                    'comments_count' => $post->comments()->count(),
                ];
            });

        return Inertia::render('UserPages/Home', [
            'featuredVideos' => $featuredVideos,
            'latestVideos' => $latestVideos,
            'latestNews' => $latestNews,
            'featuredStories' => $featuredStories,
            'communityPosts' => $communityPosts,
        ]);
    }

    public function about()
    {
        return Inertia::render('UserPages/About');
    }
}
