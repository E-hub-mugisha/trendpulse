<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\EntertainmentPost;
use Inertia\Inertia;
use Inertia\Response;

class EntertainmentController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');

        $categories = Category::query()
            ->whereHas('entertainmentPosts', fn ($q) => $q->published())
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $activeCategory = $categorySlug
            ? $categories->firstWhere('slug', $categorySlug)
            : null;

        $base = EntertainmentPost::query()
            ->with('category')
            ->published()
            ->when($activeCategory, fn ($q) => $q->where('category_id', $activeCategory->id));

        $transform = fn ($post) => [
            'id' => $post->id,
            'slug' => $post->slug,
            'title' => $post->title,
            'excerpt' => $post->excerpt,
            'featured_image' => $post->featured_image,
            'category' => $post->category?->name,
            'views' => $post->views,
            'is_featured' => $post->is_featured,
            'is_popular' => $post->is_popular,
            'published_at' => $post->published_at?->format('M j, Y'),
            'trending_views_count' => $post->trending_views_count ?? null,
        ];

        $latest = (clone $base)->latest()->take(7)->get()->map($transform);
        $trending = (clone $base)->trending(7)->take(6)->get()->map($transform);
        $mostViewed = (clone $base)->mostViewed()->take(6)->get()->map($transform);
        $popular = (clone $base)->popular()->take(6)->get()->map($transform);

        return Inertia::render('UserPages/Entertainment/Index', [
            'featured' => $latest->first(),
            'latest' => $latest->slice(1)->values(),
            'trending' => $trending,
            'mostViewed' => $mostViewed,
            'popular' => $popular,
            'categories' => $categories,
            'activeCategory' => $categorySlug,
        ]);
    }

    public function show(EntertainmentPost $post): Response
    {
        $post->registerView(request()->ip());
        $post->load(['category', 'author']);

        $relatedPosts = EntertainmentPost::query()
            ->published()
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->latest()
            ->take(3)
            ->get(['id', 'slug', 'title', 'excerpt']);

        $recentPosts = EntertainmentPost::query()
            ->published()
            ->where('id', '!=', $post->id)
            ->latest()
            ->take(5)
            ->get(['id', 'slug', 'title', 'featured_image', 'published_at']);

        $trendingPosts = EntertainmentPost::query()
            ->published()
            ->where('id', '!=', $post->id)
            ->trending(7)
            ->take(5)
            ->get(['id', 'slug', 'title', 'featured_image', 'views']);

        return Inertia::render('UserPages/Entertainment/Show', [
            'post' => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'featured_image' => $post->featured_image,
                'category' => $post->category?->name,
                'author_name' => $post->author?->name,
                'views' => $post->views,
                'date' => $post->published_at?->format('M j, Y'),
            ],
            'relatedPosts' => $relatedPosts,
            'recentPosts' => $recentPosts,
            'trendingPosts' => $trendingPosts,
        ]);
    }
}
