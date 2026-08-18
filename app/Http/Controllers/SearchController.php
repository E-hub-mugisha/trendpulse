<?php
// app/Http/Controllers/SearchController.php

namespace App\Http\Controllers;

use App\Models\EntertainmentPost;
use App\Models\PeopleStory;
use App\Models\YoutubeVideo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->get('q', ''));

        if (mb_strlen($query) < 2) {
            return response()->json([
                'people' => [],
                'entertainment' => [],
                'youtube' => [],
            ]);
        }

        $people = PeopleStory::query()
            ->published()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('person_name', 'like', "%{$query}%");
            })
            ->latest()
            ->take(4)
            ->get(['id', 'slug', 'title', 'featured_image'])
            ->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->featured_image,
                'url' => "/people/{$item->slug}",
            ]);

        $entertainment = EntertainmentPost::query()
            ->published()
            ->where('title', 'like', "%{$query}%")
            ->latest()
            ->take(4)
            ->get(['id', 'slug', 'title', 'featured_image'])
            ->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->featured_image,
                'url' => "/entertainment/{$item->slug}",
            ]);

        $youtube = YoutubeVideo::query()
            ->where('is_published', true)
            ->where('title', 'like', "%{$query}%")
            ->latest()
            ->take(4)
            ->get(['id', 'slug', 'title', 'thumbnail', 'youtube_id'])
            ->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->thumbnail_url,
                'url' => "/youtube/{$item->slug}",
            ]);

        return response()->json([
            'people' => $people,
            'entertainment' => $entertainment,
            'youtube' => $youtube,
        ]);
    }
}