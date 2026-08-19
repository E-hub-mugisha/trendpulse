<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('UserPages/Contact');
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

            'subject' => [
                'required',
                'string',
                'max:200',
            ],

            'message' => [
                'required',
                'string',
                'max:5000',
            ],
        ]);

        Mail::to(
            config('mail.contact_address', config('mail.from.address'))
        )->send(
            new ContactMessageMail(
                name: $validated['name'],
                email: $validated['email'],
                contactSubject: $validated['subject'],
                contactMessage: $validated['message'],
            )
        );

        return back()->with(
            'success',
            'Thank you for contacting TrendPulse. Your message has been sent successfully.'
        );
    }
}