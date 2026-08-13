<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\YoutubeVideo;
use Inertia\Inertia;
use Inertia\Response;

class YoutubeController extends Controller
{
    public function index(): Response
    {
        $videos = YoutubeVideo::query()
            ->with('category')
            ->where('is_published', true)
            ->latest('published_at')
            ->paginate(12)
            ->through(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'slug' => $video->slug,
                    'youtube_id' => $video->youtube_id,
                    'thumbnail_url' => $video->thumbnail_url,
                    'description' => $video->description,
                    'category' => $video->category?->name,
                    'views' => $video->views,
                    'published_at' => $video->published_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('UserPages/Youtube/Index', [
            'videos' => $videos,
        ]);
    }

    public function show(YoutubeVideo $video): Response
    {
        abort_unless($video->is_published, 404);

        $video->increment('views');

        $relatedVideos = YoutubeVideo::query()
            ->where('id', '!=', $video->id)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(4)
            ->get();

        return Inertia::render('UserPages/Youtube/Show', [
            'video' => [
                'id' => $video->id,
                'title' => $video->title,
                'slug' => $video->slug,
                'youtube_id' => $video->youtube_id,
                'thumbnail_url' => $video->thumbnail_url,
                'description' => $video->description,
                'category' => $video->category?->name,
                'views' => $video->views,
                'published_at' => $video->published_at?->format('M d, Y'),
            ],

            'relatedVideos' => $relatedVideos,
        ]);
    }
}
