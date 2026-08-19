<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Mail\StorySubmissionReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class StorySubmissionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('UserPages/Stories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'story' => ['required', 'string', 'min:50', 'max:10000'],
            'allow_contact' => ['boolean'],
            'allow_publication' => ['boolean'],
        ]);

        $validated['allow_contact'] = $request->boolean('allow_contact');
        $validated['allow_publication'] = $request->boolean('allow_publication', true);

        try {
            Mail::to(config('mail.story_submissions_to'))
                ->send(new StorySubmissionReceived($validated));
        } catch (Throwable $e) {
            Log::error('Story submission email failed to send.', [
                'error' => $e->getMessage(),
                'email' => $validated['email'],
                'title' => $validated['title'],
            ]);

            return back()->with(
                'error',
                'Sorry, something went wrong sending your story. Please try again in a moment.'
            );
        }

        return back()->with(
            'success',
            'Thank you! Your story has been sent and is awaiting review.'
        );
    }
}
