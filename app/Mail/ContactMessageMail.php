<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $contactSubject,
        public string $contactMessage,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'TrendPulse Contact: ' . $this->contactSubject,

            replyTo: [
                new Address(
                    $this->email,
                    $this->name
                ),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
        );
    }
}