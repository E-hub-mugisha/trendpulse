<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile edit page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update account information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Display the authenticated user's public profile.
     */
    public function show(Request $request): Response
    {
        $user = $request->user()->load([
            'communityPosts' => function ($query) {
                $query
                    ->where('status', 'published')
                    ->latest()
                    ->withCount([
                        'likes',
                        'comments' => fn ($q) =>
                            $q->where('status', 'approved'),
                    ]);
            },
        ]);

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio,
                'location' => $user->location,
                'avatar_url' => $user->avatar_url,
                'cover_photo_url' => $user->cover_photo_url,

                'community_posts' => $user->communityPosts->map(
                    function ($post) {
                        return [
                            'id' => $post->id,
                            'content' => $post->content,
                            'image' => $post->image
                                ? asset(
                                    'storage/' .
                                    ltrim(
                                        str_replace(
                                            '/storage/',
                                            '',
                                            $post->image
                                        ),
                                        '/'
                                    )
                                )
                                : null,

                            'created_at' => $post->created_at
                                ? $post->created_at->diffForHumans()
                                : null,

                            'likes_count' => $post->likes_count,
                            'comments_count' => $post->comments_count,
                        ];
                    }
                )->values(),
            ],
        ]);
    }

    /**
     * Update profile information from the profile modal.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'bio' => [
                'nullable',
                'string',
                'max:500',
            ],

            'location' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $request->user()->update($validated);

        return back()->with(
            'success',
            'Your profile has been updated successfully.'
        );
    }

    /**
     * Update avatar.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete(
                $user->avatar
            );
        }

        $path = $request
            ->file('avatar')
            ->store('avatars', 'public');

        $user->update([
            'avatar' => $path,
        ]);

        return back()->with(
            'success',
            'Profile photo updated successfully.'
        );
    }

    /**
     * Update cover photo.
     */
    public function updateCover(Request $request): RedirectResponse
    {
        $request->validate([
            'cover_photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:6144',
            ],
        ]);

        $user = $request->user();

        if ($user->cover_photo) {
            Storage::disk('public')->delete(
                $user->cover_photo
            );
        }

        $path = $request
            ->file('cover_photo')
            ->store('covers', 'public');

        $user->update([
            'cover_photo' => $path,
        ]);

        return back()->with(
            'success',
            'Cover photo updated successfully.'
        );
    }

    /**
     * Delete user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => [
                'required',
                'current_password',
            ],
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete(
                $user->avatar
            );
        }

        if ($user->cover_photo) {
            Storage::disk('public')->delete(
                $user->cover_photo
            );
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}