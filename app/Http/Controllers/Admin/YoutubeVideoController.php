<?php
// app/Http/Controllers/Admin/YoutubeVideoController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\YoutubeVideo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class YoutubeVideoController extends Controller
{
    public function index(Request $request): Response
    {
        $videos = YoutubeVideo::query()
            ->with('category:id,name')
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
                    default => null,
                };
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($video) => [
                'id' => $video->id,
                'slug' => $video->slug,
                'title' => $video->title,
                'thumbnail_url' => $video->thumbnail_url,
                'category' => $video->category?->name,
                'views' => $video->views,
                'is_featured' => $video->is_featured,
                'is_published' => $video->is_published,
                'published_at' => $video->published_at?->format('M j, Y'),
            ]);

        return Inertia::render('Admin/Youtube/Index', [
            'videos' => $videos,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'category', 'status']),
            'stats' => [
                'total' => YoutubeVideo::count(),
                'published' => YoutubeVideo::where('is_published', true)->count(),
                'draft' => YoutubeVideo::where('is_published', false)->count(),
                'totalViews' => YoutubeVideo::sum('views'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Youtube/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'youtube_id' => ['required', 'string', 'max:20'],
            'thumbnail' => ['nullable', 'url'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['published_at'] = $validated['is_published']
            ? ($validated['published_at'] ?? now())
            : $validated['published_at'];

        YoutubeVideo::create($validated);

        return redirect()->route('admin.youtube.index')
            ->with('success', 'Video added successfully.');
    }

    public function edit(YoutubeVideo $video): Response
    {
        return Inertia::render('Admin/Youtube/Edit', [
            'video' => $video,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, YoutubeVideo $video): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'youtube_id' => ['required', 'string', 'max:20'],
            'thumbnail' => ['nullable', 'url'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($validated['title'] !== $video->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $video->id);
        }

        if ($validated['is_published'] && ! $video->is_published && ! $validated['published_at']) {
            $validated['published_at'] = now();
        }

        $video->update($validated);

        return redirect()->route('admin.youtube.index')
            ->with('success', 'Video updated successfully.');
    }

    public function destroy(YoutubeVideo $video): RedirectResponse
    {
        $video->delete();

        return back()->with('success', 'Video deleted.');
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            YoutubeVideo::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}