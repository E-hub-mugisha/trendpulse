<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntertainmentPost extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'featured_image',
        'excerpt',
        'content',
        'author_id',
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

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
