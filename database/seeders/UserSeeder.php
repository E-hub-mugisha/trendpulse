<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Sarah',
            'email' => 'sarah@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'name' => 'David',
            'email' => 'david@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'name' => 'Grace',
            'email' => 'grace@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
