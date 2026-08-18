<?php
// app/Http/Controllers/Admin/PeopleStoryController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\PeopleStory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PeopleStoryController extends Controller
{
    public function index(Request $request): Response
    {
        $stories = PeopleStory::query()
            ->with('category:id,name')
            ->when($request->search, function ($q, $search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                        ->orWhere('person_name', 'like', "%{$search}%");
                });
            })
            ->when($request->category, function ($q, $categoryId) {
                $q->where('category_id', $categoryId);
            })
            ->when($request->status, function ($q, $status) {
                match ($status) {
                    'published' => $q->where('is_published', true),
                    'draft' => $q->where('is_published', false),
                    'featured' => $q->where('is_featured', true),
                    'popular' => $q->where('is_popular', true),
                    default => null,
                };
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($story) => [
                'id' => $story->id,
                'slug' => $story->slug,
                'title' => $story->title,
                'person_name' => $story->person_name,
                'featured_image' => $story->featured_image,
                'category' => $story->category?->name,
                'relationship_status' => $story->relationship_status,
                'views' => $story->views,
                'is_featured' => $story->is_featured,
                'is_popular' => $story->is_popular,
                'is_published' => $story->is_published,
                'published_at' => $story->published_at?->format('M j, Y'),
            ]);

        return Inertia::render('Admin/People/Index', [
            'stories' => $stories,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'category', 'status']),
            'stats' => [
                'total' => PeopleStory::count(),
                'published' => PeopleStory::where('is_published', true)->count(),
                'draft' => PeopleStory::where('is_published', false)->count(),
                'totalViews' => PeopleStory::sum('views'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/People/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'person_name' => ['required', 'string', 'max:255'],
            'relationship_status' => ['nullable', 'string', 'max:100'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'story' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = '/storage/' . $request->file('featured_image')->store('people', 'public');
        }

        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['published_at'] = $validated['is_published']
            ? ($validated['published_at'] ?? now())
            : $validated['published_at'];

        PeopleStory::create($validated);

        return redirect()->route('admin.people.index')
            ->with('success', 'Story created successfully.');
    }

    public function edit(PeopleStory $story): Response
    {
        return Inertia::render('Admin/People/Edit', [
            'story' => $story,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, PeopleStory $story): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'person_name' => ['required', 'string', 'max:255'],
            'relationship_status' => ['nullable', 'string', 'max:100'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'story' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = '/storage/' . $request->file('featured_image')->store('people', 'public');
        } else {
            unset($validated['featured_image']);
        }

        if ($validated['title'] !== $story->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $story->id);
        }

        if ($validated['is_published'] && ! $story->is_published && ! $validated['published_at']) {
            $validated['published_at'] = now();
        }

        $story->update($validated);

        return redirect()->route('admin.people.index')
            ->with('success', 'Story updated successfully.');
    }

    public function show(PeopleStory $story): Response
    {
        $story->load('category:id,name');

        $viewsLast7Days = $story->storyViews()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $viewsLast30Days = $story->storyViews()
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $relatedStories = PeopleStory::query()
            ->where('id', '!=', $story->id)
            ->when($story->category_id, fn ($q) => $q->where('category_id', $story->category_id))
            ->latest()
            ->take(4)
            ->get(['id', 'slug', 'title', 'featured_image', 'is_published']);

        return Inertia::render('Admin/People/Show', [
            'story' => [
                'id' => $story->id,
                'slug' => $story->slug,
                'title' => $story->title,
                'person_name' => $story->person_name,
                'relationship_status' => $story->relationship_status,
                'excerpt' => $story->excerpt,
                'story' => $story->story,
                'featured_image' => $story->featured_image,
                'category' => $story->category?->name,
                'views' => $story->views,
                'views_last_7_days' => $viewsLast7Days,
                'views_last_30_days' => $viewsLast30Days,
                'is_featured' => $story->is_featured,
                'is_popular' => $story->is_popular,
                'is_published' => $story->is_published,
                'published_at' => $story->published_at?->format('M j, Y \a\t g:i A'),
                'created_at' => $story->created_at->format('M j, Y \a\t g:i A'),
                'updated_at' => $story->updated_at->diffForHumans(),
            ],
            'relatedStories' => $relatedStories,
        ]);
    }

    public function destroy(PeopleStory $story): RedirectResponse
    {
        $story->delete();

        return back()->with('success', 'Story deleted.');
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            PeopleStory::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}