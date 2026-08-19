<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class StorySubmissionReceived extends Mailable
{
    public function __construct(
        public array $submission,
    ) {}

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.story-submission',
        );
    }
}