<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('UserPages/Home', [
        'featuredVideos' => [],
        'latestVideos' => [],
        'latestNews' => [],
        'featuredStories' => [],
        'communityPosts' => [],
    ]);
})->name('home');

Route::get('/youtube', function () {
    return Inertia::render('UserPages/Youtube');
})->name('youtube.index');

Route::get('/entertainment', function () {
    return Inertia::render('UserPages/Entertainment/Index');
})->name('entertainment.index');

Route::get('/people', function () {
    return Inertia::render('UserPages/People/Index');
})->name('people.index');

Route::get('/community', function () {
    return Inertia::render('UserPages/Community/Index');
})->name('community.index');

Route::get('/share-your-story', function () {
    return Inertia::render('UserPages/Stories/Create');
})->name('stories.create');