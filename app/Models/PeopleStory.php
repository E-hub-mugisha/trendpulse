<?php
// app/Models/PeopleStory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PeopleStory extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'person_name',
        'featured_image',
        'excerpt',
        'story',
        'relationship_status',
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

    public function storyViews(): HasMany
    {
        return $this->hasMany(PeopleStoryView::class);
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

    /**
     * Trending = most views within the last $days, computed from the
     * view log rather than a manually-set flag, so it stays accurate
     * without any scheduled job.
     */
    public function scopeTrending(Builder $query, int $days = 7): Builder
    {
        return $query
            ->withCount(['storyViews as trending_views_count' => function ($q) use ($days) {
                $q->where('created_at', '>=', now()->subDays($days));
            }])
            ->orderByDesc('trending_views_count')
            ->orderByDesc('views');
    }

    public function registerView(?string $ip = null): void
    {
        $this->increment('views');
        $this->storyViews()->create(['ip_address' => $ip]);
    }

    protected function featuredImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset(ltrim($value, '/')) : null,
        );
    }
}
