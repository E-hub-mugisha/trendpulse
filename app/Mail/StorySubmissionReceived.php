<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StorySubmissionReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $submission,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New story submission: ' . $this->submission['title'],
            replyTo: [$this->submission['email'] => $this->submission['name']],
            to: [config('mail.story_submissions_to')],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.story-submission',
        );
    }
}