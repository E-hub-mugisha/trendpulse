<?php

namespace App\Notifications;

use App\Models\Like;
use App\Models\Comment;
use App\Models\CommunityPost;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewLikeNotification extends Notification
{
    use Queueable;

    public function __construct(public Like $like) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $likeable = $this->like->likeable;

        $postId = $likeable instanceof CommunityPost
            ? $likeable->id
            : ($likeable instanceof Comment ? $likeable->commentable_id : null);

        return [
            'type' => 'like',
            'target_type' => $likeable instanceof CommunityPost ? 'post' : 'comment',
            'post_id' => $postId,
            'comment_id' => $likeable instanceof Comment ? $likeable->id : null,
            'liker_id' => $this->like->user_id,
            'liker_name' => $this->like->user->name,
            'liker_avatar' => $this->like->user->avatar_url,
        ];
    }
}