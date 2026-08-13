<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\YoutubeVideo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class YoutubeVideoSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'life-stories')->first();

        $videos = [
            [
                'title' => 'The Story That Changed Everything',
                'youtube_id' => 'dQw4w9WgXcr',
                'description' => 'A powerful conversation about life, choices and growth.',
            ],
            [
                'title' => 'Love, Life and Lessons',
                'youtube_id' => 'dQw4w9WgXcQ',
                'description' => 'An honest conversation about relationships.',
            ],
            [
                'title' => 'What Nobody Tells You About Relationships',
                'youtube_id' => 'dQw4w9WgXew',
                'description' => 'Real experiences from real people.',
            ],
        ];

        foreach ($videos as $video) {
            YoutubeVideo::updateOrCreate(
                ['title' => $video['title']],
                [
                    'slug' => Str::slug($video['title']),
                    'youtube_id' => $video['youtube_id'],
                    'description' => $video['description'],
                    'category_id' => $category?->id,
                    'views' => rand(100, 5000),
                    'is_featured' => true,
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}