<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\EntertainmentPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EntertainmentPostSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'entertainment')->first();

        $posts = [
            [
                'title' => 'The conversations everyone is talking about',
                'excerpt' => 'Here are the stories and conversations making waves this week.',
                'content' => 'Entertainment continues to bring people together through music, culture, conversations and experiences.',
            ],
            [
                'title' => 'Inside the latest trends shaping our culture',
                'excerpt' => 'A look at the trends influencing entertainment and everyday life.',
                'content' => 'From digital culture to entertainment, new trends are changing how people connect and share experiences.',
            ],
            [
                'title' => 'What is trending this week?',
                'excerpt' => 'The latest stories, conversations and moments you should know about.',
                'content' => 'Stay connected with the latest conversations happening across our community.',
            ],
        ];

        foreach ($posts as $post) {
            EntertainmentPost::updateOrCreate(
                ['title' => $post['title']],
                [
                    'category_id' => $category?->id,
                    'slug' => Str::slug($post['title']),
                    'excerpt' => $post['excerpt'],
                    'content' => $post['content'],
                    'author_id' => 1, // Assuming 'TrendPulse' corresponds to user with ID 1
                    'views' => rand(100, 5000),
                    'is_featured' => true,
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}