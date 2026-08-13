<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PeopleStory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PeopleStorySeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'relationships')->first();

        $stories = [
            [
                'title' => 'We Met When We Least Expected It',
                'person_name' => 'Sarah',
                'excerpt' => 'A story about unexpected love and the courage to start again.',
                'story' => 'Sometimes the most meaningful relationships begin when we stop looking for them. This is Sarah’s story of finding love when she least expected it.',
                'relationship_status' => 'In a relationship',
            ],
            [
                'title' => 'What My Relationship Taught Me',
                'person_name' => 'David',
                'excerpt' => 'Lessons about communication, trust and growing together.',
                'story' => 'Relationships are not always easy. David shares what years of experience taught him about communication, trust and understanding.',
                'relationship_status' => 'Married',
            ],
            [
                'title' => 'Starting Over Was the Best Decision',
                'person_name' => 'Grace',
                'excerpt' => 'A powerful story about healing and finding yourself again.',
                'story' => 'Grace shares her journey of rebuilding her life and learning to put herself first.',
                'relationship_status' => 'Single',
            ],
        ];

        foreach ($stories as $story) {
            PeopleStory::updateOrCreate(
                ['title' => $story['title']],
                [
                    'category_id' => $category?->id,
                    'slug' => Str::slug($story['title']),
                    'person_name' => $story['person_name'],
                    'excerpt' => $story['excerpt'],
                    'story' => $story['story'],
                    'relationship_status' => $story['relationship_status'],
                    'views' => rand(100, 5000),
                    'is_featured' => true,
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}