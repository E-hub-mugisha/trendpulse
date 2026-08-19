<?php

namespace Database\Seeders;

use App\Models\CommunityPost;
use Illuminate\Database\Seeder;

class CommunityPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'content' => "Does anyone else feel like the best conversations happen at 1am when you're supposed to be asleep? Just had one of those tonight and I'm still thinking about it 😅",
                'image' => null,
            ],
            [
                'content' => "Reminder that it's okay to outgrow friendships that no longer serve you. Growth sometimes means walking a different path than the people you started with.",
                'image' => null,
            ],
            [
                'content' => "Made suya for the first time following a recipe I saw posted here last week. 10/10, would recommend to anyone who loves spice 🔥",
                'image' => 'storage/community/suya-post.jpg',
            ],
            [
                'content' => "Unpopular opinion: checking in on your 'strong' friend matters just as much as checking in on the ones who are visibly struggling. Strength doesn't mean okay.",
                'image' => null,
            ],
            [
                'content' => "Three months into my new job and I finally feel like I know what I'm doing. Small wins deserve celebration too, not just the big milestones.",
                'image' => null,
            ],
            [
                'content' => "Weekend hike with the crew was exactly what I needed. Sometimes the best therapy is fresh air and good company.",
                'image' => 'storage/community/weekend-hike.jpg',
            ],
            [
                'content' => "Anyone else find it hard to rest without feeling guilty? Working on unlearning that this year. Rest is productive too.",
                'image' => null,
            ],
            [
                'content' => "My little cousin just got accepted into her dream program and I am not okay 😭 so proud of her, she worked so hard for this.",
                'image' => null,
            ],
            [
                'content' => "Tried a new spot downtown for lunch today — small place, huge portions, even better prices. Will definitely be going back.",
                'image' => 'storage/community/lunch-spot.jpg',
            ],
            [
                'content' => "Sometimes the smallest acts of kindness stay with you the longest. A stranger paid for my coffee today and it completely turned my mood around.",
                'image' => null,
            ],
        ];

        foreach ($posts as $post) {
            CommunityPost::create([
                'user_id' => 1,
                'content' => $post['content'],
                'image' => $post['image'],
                'status' => 'published',
                'created_at' => now()->subDays(rand(0, 20)),
                'updated_at' => now(),
            ]);
        }
    }
}