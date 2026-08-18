<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YoutubeController extends Controller
{
    public function index(Request $request): Response
    {
        $activeCategory = $request->query('category');

        $baseQuery = YoutubeVideo::query()
            ->with('category')
            ->where('is_published', true)
            ->when($activeCategory, function ($query) use ($activeCategory) {
                $query->whereHas('category', function ($q) use ($activeCategory) {
                    $q->where('slug', $activeCategory);
                });
            });

        $featured = (clone $baseQuery)
            ->where('is_featured', true)
            ->latest('published_at')
            ->first() ?? (clone $baseQuery)->latest('published_at')->first();

        $trending = (clone $baseQuery)
            ->when($featured, fn ($query) => $query->where('id', '!=', $featured->id))
            ->orderByDesc('views')
            ->take(5)
            ->get();

        $popular = (clone $baseQuery)
            ->when($featured, fn ($query) => $query->where('id', '!=', $featured->id))
            ->orderByDesc('views')
            ->skip(5)
            ->take(6)
            ->get();

        $latest = (clone $baseQuery)
            ->when($featured, fn ($query) => $query->where('id', '!=', $featured->id))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(fn ($video) => $this->transform($video));

        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('youtubeVideos', function ($query) {
                $query->where('is_published', true);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('UserPages/Youtube/Index', [
            'featured' => $featured ? $this->transform($featured) : null,
            'trending' => $trending->map(fn ($video) => $this->transform($video))->values(),
            'popular' => $popular->map(fn ($video) => $this->transform($video))->values(),
            'latest' => $latest,
            'categories' => $categories,
            'activeCategory' => $activeCategory,
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
            'video' => $this->transform($video),
            'relatedVideos' => $relatedVideos->map(fn ($item) => $this->transform($item))->values(),
        ]);
    }

    private function transform(YoutubeVideo $video): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'slug' => $video->slug,
            'youtube_id' => $video->youtube_id,
            'thumbnail_url' => $video->thumbnail_url,
            'description' => $video->description,
            'category' => $video->category?->name,
            'category_slug' => $video->category?->slug,
            'views' => $video->views,
            'published_at' => $video->published_at?->format('M d, Y'),
        ];
    }
}