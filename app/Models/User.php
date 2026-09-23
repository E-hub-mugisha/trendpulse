<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'cover_photo',
        'bio',
        'location',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'avatar_url',
        'cover_photo_url',
    ];

    /**
     * Avatar URL.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset(
                'storage/' .
                ltrim(
                    str_replace(
                        '/storage/',
                        '',
                        $this->avatar
                    ),
                    '/'
                )
            );
        }

        return 'https://ui-avatars.com/api/?name=' .
            urlencode($this->name) .
            '&background=0A599E&color=fff&size=256';
    }

    /**
     * Cover photo URL.
     */
    public function getCoverPhotoUrlAttribute(): ?string
    {
        if (!$this->cover_photo) {
            return null;
        }

        return asset(
            'storage/' .
            ltrim(
                str_replace(
                    '/storage/',
                    '',
                    $this->cover_photo
                ),
                '/'
            )
        );
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}