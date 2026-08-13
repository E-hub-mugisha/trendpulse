<?php

use App\Http\Controllers\UserPage\CommunityController;
use App\Http\Controllers\UserPage\EntertainmentController;
use App\Http\Controllers\UserPage\HomeController;
use App\Http\Controllers\UserPage\PeopleController;
use App\Http\Controllers\UserPage\StorySubmissionController;
use App\Http\Controllers\UserPage\YoutubeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])
    ->name('home');

Route::get('/youtube', [YoutubeController::class, 'index'])
    ->name('youtube.index');

Route::get('/youtube/{video}', [YoutubeController::class, 'show'])
    ->name('youtube.show');

Route::get('/entertainment', [EntertainmentController::class, 'index'])
    ->name('entertainment.index');

Route::get('/entertainment/{post}', [EntertainmentController::class, 'show'])
    ->name('entertainment.show');

Route::get('/people', [PeopleController::class, 'index'])
    ->name('people.index');

Route::get('/people/{story}', [PeopleController::class, 'show'])
    ->name('people.show');

Route::get('/community', [CommunityController::class, 'index'])
    ->name('community.index');

Route::get('/share-your-story', [StorySubmissionController::class, 'create'])
    ->name('stories.create');

Route::post('/share-your-story', [StorySubmissionController::class, 'store'])
    ->name('stories.store');