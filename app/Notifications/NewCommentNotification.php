<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'comment',
            'post_id' => $this->comment->commentable_id,
            'commenter_id' => $this->comment->user_id,
            'commenter_name' => $this->comment->user->name,
            'commenter_avatar' => $this->comment->user->avatar_url,
            'excerpt' => str($this->comment->content)->limit(80),
        ];
    }
}