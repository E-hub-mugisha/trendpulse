<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PeopleStory;
use Inertia\Inertia;
use Inertia\Response;

class PeopleController extends Controller
{
    public function index(): Response
    {
        $stories = PeopleStory::query()
            ->with('category')
            ->where('is_published', true)
            ->latest('published_at')
            ->paginate(9)
            ->through(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'slug' => $story->slug,
                    'person_name' => $story->person_name,
                    'featured_image' => $story->featured_image,
                    'excerpt' => $story->excerpt,
                    'category' => $story->category?->name,
                    'relationship_status' => $story->relationship_status,
                    'views' => $story->views,
                    'date' => $story->published_at?->format('M d, Y'),
                ];
            });

        return Inertia::render('UserPages/People/Index', [
            'stories' => $stories,
        ]);
    }

    public function show(PeopleStory $story): Response
    {
        abort_unless($story->is_published, 404);

        $story->increment('views');

        $relatedStories = PeopleStory::query()
            ->where('id', '!=', $story->id)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('UserPages/People/Show', [
            'story' => [
                'id' => $story->id,
                'title' => $story->title,
                'slug' => $story->slug,
                'person_name' => $story->person_name,
                'featured_image' => $story->featured_image,
                'excerpt' => $story->excerpt,
                'story' => $story->story,
                'category' => $story->category?->name,
                'relationship_status' => $story->relationship_status,
                'views' => $story->views,
                'date' => $story->published_at?->format('M d, Y'),
            ],
            'relatedStories' => $relatedStories,
        ]);
    }
}
