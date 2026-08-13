<?php

namespace Database\Seeders;

use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunityPostSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            User::firstOrCreate(
                ['email' => 'sarah@example.com'],
                ['name' => 'Sarah', 'password' => bcrypt('password')]
            ),

            User::firstOrCreate(
                ['email' => 'david@example.com'],
                ['name' => 'David', 'password' => bcrypt('password')]
            ),

            User::firstOrCreate(
                ['email' => 'grace@example.com'],
                ['name' => 'Grace', 'password' => bcrypt('password')]
            ),
        ];

        $posts = [
            'What is one relationship lesson you wish you had learned earlier?',
            'Sometimes walking away is not giving up. It is choosing yourself.',
            'What makes a relationship last beyond the honeymoon stage?',
            'What is one life experience that completely changed you?',
        ];

        foreach ($posts as $index => $content) {
            CommunityPost::updateOrCreate(
                [
                    'content' => $content,
                ],
                [
                    'user_id' => $users[$index % count($users)]->id,
                    'status' => 'published',
                ]
            );
        }
    }
}