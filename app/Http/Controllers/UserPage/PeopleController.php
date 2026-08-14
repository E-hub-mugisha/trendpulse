<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\PeopleStory;
use Inertia\Inertia;
use Inertia\Response;

class PeopleController extends Controller
{
    private const TABS = ['latest', 'trending', 'most-viewed', 'popular'];

    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');

        $categories = Category::query()
            ->whereHas('peopleStories', fn ($q) => $q->published())
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $activeCategory = $categorySlug
            ? $categories->firstWhere('slug', $categorySlug)
            : null;

        $base = PeopleStory::query()
            ->with('category')
            ->published()
            ->when($activeCategory, fn ($q) => $q->where('category_id', $activeCategory->id));

        $transform = fn ($story) => [
            'id' => $story->id,
            'slug' => $story->slug,
            'title' => $story->title,
            'excerpt' => $story->excerpt,
            'featured_image' => $story->featured_image,
            'category' => $story->category?->name,
            'views' => $story->views,
            'is_featured' => $story->is_featured,
            'is_popular' => $story->is_popular,
            'published_at' => $story->published_at?->format('M j, Y'),
            'trending_views_count' => $story->trending_views_count ?? null,
        ];

        $latest = (clone $base)->latest()->take(7)->get()->map($transform);
        $trending = (clone $base)->trending(7)->take(6)->get()->map($transform);
        $mostViewed = (clone $base)->mostViewed()->take(6)->get()->map($transform);
        $popular = (clone $base)->popular()->take(6)->get()->map($transform);

        return Inertia::render('UserPages/People/Index', [
            'featured' => $latest->first(),
            'latest' => $latest->slice(1)->values(),
            'trending' => $trending,
            'mostViewed' => $mostViewed,
            'popular' => $popular,
            'categories' => $categories,
            'activeCategory' => $categorySlug,
        ]);
    }

    public function show(PeopleStory $story): Response
    {
        $story->registerView(request()->ip());
        $story->load('category');

        $relatedStories = PeopleStory::query()
            ->published()
            ->where('id', '!=', $story->id)
            ->when($story->category_id, fn ($q) => $q->where('category_id', $story->category_id))
            ->latest()
            ->take(3)
            ->get(['id', 'slug', 'title', 'excerpt']);

        $recentStories = PeopleStory::query()
            ->published()
            ->where('id', '!=', $story->id)
            ->latest()
            ->take(5)
            ->get(['id', 'slug', 'title', 'featured_image', 'published_at']);

        $trendingStories = PeopleStory::query()
            ->published()
            ->where('id', '!=', $story->id)
            ->trending(7)
            ->take(5)
            ->get(['id', 'slug', 'title', 'featured_image', 'views']);

        return Inertia::render('UserPages/People/Show', [
            'story' => [
                'id' => $story->id,
                'slug' => $story->slug,
                'title' => $story->title,
                'excerpt' => $story->excerpt,
                'story' => $story->story,
                'person_name' => $story->person_name,
                'featured_image' => $story->featured_image,
                'relationship_status' => $story->relationship_status,
                'category' => $story->category?->name,
                'views' => $story->views,
                'date' => $story->published_at?->format('M j, Y'),
            ],
            'relatedStories' => $relatedStories,
            'recentStories' => $recentStories,
            'trendingStories' => $trendingStories,
        ]);
    }
}
