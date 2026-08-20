<?php
// app/Models/EntertainmentPost.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
        'is_popular',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function postViews(): HasMany
    {
        return $this->hasMany(EntertainmentPostView::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderByDesc('published_at');
    }

    public function scopeMostViewed(Builder $query): Builder
    {
        return $query->orderByDesc('views');
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->orderByDesc('is_popular')->orderByDesc('views');
    }

    public function scopeTrending(Builder $query, int $days = 7): Builder
    {
        return $query
            ->withCount(['postViews as trending_views_count' => function ($q) use ($days) {
                $q->where('created_at', '>=', now()->subDays($days));
            }])
            ->orderByDesc('trending_views_count')
            ->orderByDesc('views');
    }

    public function registerView(?string $ip = null): void
    {
        $this->increment('views');
        $this->postViews()->create(['ip_address' => $ip]);
    }

    protected function featuredImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset(ltrim($value, '/')) : null,
        );
    }
}