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
        $categories = Category::whereIn('slug', [
            'relationships', 'love-dating', 'life-stories', 'family-parenting',
        ])->get()->keyBy('slug');

        $videos = [
            [
                'title' => 'The story that had everyone talking — full breakdown',
                'youtube_id' => 'dQw4w9WgXcQ',
                'description' => 'We break down this week\'s most talked-about story and why it resonated with so many people.',
                'category' => 'life-stories',
            ],
            [
                'title' => 'Street interviews: what does love mean to you?',
                'youtube_id' => 'kJQP7kiw5Fk',
                'description' => 'We hit the streets to ask real people how they define love in their own words.',
                'category' => 'love-dating',
            ],
            [
                'title' => 'Reacting to the comeback everyone predicted',
                'youtube_id' => '3JZ_D3ELwOQ',
                'description' => 'Our team reacts live to the announcement that had the community buzzing all week.',
                'category' => 'life-stories',
            ],
            [
                'title' => 'Life advice from three generations in one family',
                'youtube_id' => 'e-ORhEE9VVg',
                'description' => 'Grandmother, mother, and daughter sit down together to share how their views on life have changed.',
                'category' => 'family-parenting',
            ],
            [
                'title' => 'Behind the scenes of our biggest community event yet',
                'youtube_id' => '2Vv-BfVoq4g',
                'description' => 'Take a look at everything that went into pulling off our latest community gathering.',
                'category' => 'life-stories',
            ],
            [
                'title' => 'Would you forgive them? Community reacts to real stories',
                'youtube_id' => 'CevxZvSJLk8',
                'description' => 'We shared real reader stories and asked the community how they\'d respond in the same situation.',
                'category' => 'relationships',
            ],
            [
                'title' => 'A day in the life: balancing work, family and everything else',
                'youtube_id' => 'RgKAFK5djSk',
                'description' => 'We follow one community member through a typical day to see how they juggle it all.',
                'category' => 'family-parenting',
            ],
            [
                'title' => 'Top 5 moments from this month you might have missed',
                'youtube_id' => 'fJ9rUzIMcZQ',
                'description' => 'A quick recap of the biggest stories and moments from the past month, all in one video.',
                'category' => 'life-stories',
            ],
            [
                'title' => 'How this couple built a business together without losing the relationship',
                'youtube_id' => 'YQHsXMglC9A',
                'description' => 'An honest conversation about the challenges and rewards of working with the person you love.',
                'category' => 'relationships',
            ],
            [
                'title' => 'Q&A: your questions about relationships, answered honestly',
                'youtube_id' => 'nfWlot6h_JM',
                'description' => 'We answer your most-asked questions about relationships, dating, and everything in between.',
                'category' => 'relationships',
            ],
        ];

        foreach ($videos as $index => $video) {
            $category = $categories->get($video['category']);

            YoutubeVideo::updateOrCreate(
                ['title' => $video['title']],
                [
                    'slug' => Str::slug($video['title']),
                    'youtube_id' => $video['youtube_id'],
                    'thumbnail' => "https://img.youtube.com/vi/{$video['youtube_id']}/hqdefault.jpg",
                    'description' => $video['description'],
                    'category_id' => $category?->id,
                    'views' => rand(200, 10000),
                    'is_featured' => $index < 3,
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 40)),
                ]
            );
        }
    }
}