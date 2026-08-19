<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Relationships',
            'Love & Dating',
            'Life Stories',
            'Inspiration',
            'Entertainment',
            'Lifestyle',
            'Culture',
            'Community',
            'Health & Wellness',
            'Personal Growth',
            'Family & Parenting',
            'Education',
            'Career & Work',
            'Travel & Adventure',
            'Food & Recipes',
            'Fashion & Beauty',
            'Technology & Gadgets',
            'Sports & Fitness',
            'Finance & Money',
            'Hobbies & Interests',
        ];

        foreach ($categories as $name) {
            Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => "Stories and conversations about {$name}.",
                    'is_active' => true,
                ]
            );
        }
    }
}