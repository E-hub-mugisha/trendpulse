<?php
// app/Http/Controllers/Admin/DashboardController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommunityPost;
use App\Models\EntertainmentPost;
use App\Models\PeopleStory;
use App\Models\StorySubmission;
use App\Models\User;
use App\Models\YoutubeVideo;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'users' => User::count(),
            'usersThisWeek' => User::where('created_at', '>=', now()->subDays(7))->count(),
            'communityPosts' => CommunityPost::count(),
            'communityPostsThisWeek' => CommunityPost::where('created_at', '>=', now()->subDays(7))->count(),
            'comments' => Comment::count(),
            'pendingStories' => StorySubmission::where('status', 'pending')->count(),
            'youtubeVideos' => YoutubeVideo::count(),
            'entertainmentPosts' => EntertainmentPost::count(),
            'peopleStories' => PeopleStory::count(),
        ];

        $recentActivity = collect()
            ->concat(
                CommunityPost::with('user:id,name')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(fn ($post) => [
                        'type' => 'community_post',
                        'label' => 'New community post',
                        'detail' => \Illuminate\Support\Str::limit($post->content, 60),
                        'user' => $post->user?->name,
                        'created_at' => $post->created_at,
                    ])
            )
            ->concat(
                StorySubmission::latest()
                    ->take(5)
                    ->get()
                    ->map(fn ($submission) => [
                        'type' => 'story_submission',
                        'label' => 'Story submitted',
                        'detail' => $submission->title ?? 'Untitled submission',
                        'user' => $submission->name ?? null,
                        'created_at' => $submission->created_at,
                    ])
            )
            ->concat(
                User::latest()
                    ->take(5)
                    ->get()
                    ->map(fn ($user) => [
                        'type' => 'user_joined',
                        'label' => 'New user joined',
                        'detail' => $user->email,
                        'user' => $user->name,
                        'created_at' => $user->created_at,
                    ])
            )
            ->sortByDesc('created_at')
            ->take(8)
            ->values()
            ->map(fn ($item) => [
                ...$item,
                'created_at' => $item['created_at']->diffForHumans(),
            ]);

        $topPeopleStories = PeopleStory::query()
            ->published()
            ->mostViewed()
            ->take(5)
            ->get(['id', 'slug', 'title', 'views']);

        $topEntertainmentPosts = EntertainmentPost::query()
            ->published()
            ->mostViewed()
            ->take(5)
            ->get(['id', 'slug', 'title', 'views']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'topPeopleStories' => $topPeopleStories,
            'topEntertainmentPosts' => $topEntertainmentPosts,
        ]);
    }
}