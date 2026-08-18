<?php
// app/Http/Controllers/Admin/EntertainmentPostController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\EntertainmentPost;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EntertainmentPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = EntertainmentPost::query()
            ->with(['category:id,name', 'author:id,name'])
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%");
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
            ->through(fn($post) => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'featured_image' => $post->featured_image,
                'category' => $post->category?->name,
                'author' => $post->author?->name,
                'views' => $post->views,
                'is_featured' => $post->is_featured,
                'is_popular' => $post->is_popular,
                'is_published' => $post->is_published,
                'published_at' => $post->published_at?->format('M j, Y'),
            ]);

        return Inertia::render('Admin/Entertainment/Index', [
            'posts' => $posts,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'category', 'status']),
            'stats' => [
                'total' => EntertainmentPost::count(),
                'published' => EntertainmentPost::where('is_published', true)->count(),
                'draft' => EntertainmentPost::where('is_published', false)->count(),
                'totalViews' => EntertainmentPost::sum('views'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Entertainment/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'authors' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'author_id' => ['nullable', 'exists:users,id'],
            'is_featured' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = '/storage/' . $request->file('featured_image')->store('entertainment', 'public');
        }

        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['author_id'] = $validated['author_id'] ?? $request->user()->id;
        $validated['published_at'] = $validated['is_published']
            ? ($validated['published_at'] ?? now())
            : $validated['published_at'];

        EntertainmentPost::create($validated);

        return redirect()->route('admin.entertainment.index')
            ->with('success', 'Post created successfully.');
    }

    // show
    public function show(EntertainmentPost $post): Response
    {
        $post->load(['category:id,name', 'author:id,name,email']);

        $viewsLast7Days = $post->postViews()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $viewsLast30Days = $post->postViews()
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $relatedPosts = EntertainmentPost::query()
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn($q) => $q->where('category_id', $post->category_id))
            ->latest()
            ->take(4)
            ->get(['id', 'slug', 'title', 'featured_image', 'is_published']);

        return Inertia::render('Admin/Entertainment/Show', [
            'post' => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'featured_image' => $post->featured_image,
                'category' => $post->category?->name,
                'author' => $post->author ? [
                    'name' => $post->author->name,
                    'email' => $post->author->email,
                ] : null,
                'views' => $post->views,
                'views_last_7_days' => $viewsLast7Days,
                'views_last_30_days' => $viewsLast30Days,
                'is_featured' => $post->is_featured,
                'is_popular' => $post->is_popular,
                'is_published' => $post->is_published,
                'published_at' => $post->published_at?->format('M j, Y \a\t g:i A'),
                'created_at' => $post->created_at->format('M j, Y \a\t g:i A'),
                'updated_at' => $post->updated_at->diffForHumans(),
            ],
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function edit(EntertainmentPost $post): Response
    {
        return Inertia::render('Admin/Entertainment/Edit', [
            'post' => $post,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'authors' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, EntertainmentPost $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'author_id' => ['nullable', 'exists:users,id'],
            'is_featured' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = '/storage/' . $request->file('featured_image')->store('entertainment', 'public');
        } else {
            unset($validated['featured_image']);
        }

        if ($validated['title'] !== $post->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $post->id);
        }

        if ($validated['is_published'] && ! $post->is_published && ! $validated['published_at']) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->route('admin.entertainment.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(EntertainmentPost $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post deleted.');
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            EntertainmentPost::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
