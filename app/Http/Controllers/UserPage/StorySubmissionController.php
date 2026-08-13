<?php

namespace App\Http\Controllers\UserPage;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\StorySubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorySubmissionController extends Controller
{
    public function create(): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('UserPages/Stories/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'category_id' => [
                'nullable',
                'exists:categories,id',
            ],

            'story' => [
                'required',
                'string',
                'min:50',
                'max:10000',
            ],

            'allow_contact' => [
                'boolean',
            ],

            'allow_publication' => [
                'boolean',
            ],
        ]);

        StorySubmission::create([
            ...$validated,
            'status' => 'pending',
            'allow_contact' => $request->boolean('allow_contact'),
            'allow_publication' => $request->boolean('allow_publication', true),
        ]);

        return back()->with(
            'success',
            'Thank you! Your story has been submitted and is awaiting review.'
        );
    }
}
