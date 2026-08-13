<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class YoutubeVideo extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'youtube_id',
        'thumbnail',
        'description',
        'category_id',
        'views',
        'is_featured',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getThumbnailUrlAttribute(): string
    {
        return $this->thumbnail
            ?: "https://img.youtube.com/vi/{$this->youtube_id}/hqdefault.jpg";
    }
}