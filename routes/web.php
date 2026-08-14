<?php

use App\Http\Controllers\UserPage\CommunityController;
use App\Http\Controllers\UserPage\EntertainmentController;
use App\Http\Controllers\UserPage\HomeController;
use App\Http\Controllers\UserPage\PeopleController;
use App\Http\Controllers\UserPage\StorySubmissionController;
use App\Http\Controllers\UserPage\YoutubeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


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
Route::middleware('auth')->group(function () {
    Route::post('/community', [CommunityController::class, 'store'])->name('community.store');
    Route::post('/community/{post}/like', [CommunityController::class, 'toggleLike'])->name('community.like');
    Route::post('/community/{post}/comments', [CommunityController::class, 'storeComment'])->name('community.comments.store');
    Route::post('/community/comments/{comment}/like', [CommunityController::class, 'toggleCommentLike'])->name('community.comments.like');
});
Route::get('/share-your-story', [StorySubmissionController::class, 'create'])
    ->name('stories.create');

Route::post('/share-your-story', [StorySubmissionController::class, 'store'])
    ->name('stories.store');