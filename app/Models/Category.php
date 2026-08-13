<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function youtubeVideos(): HasMany
    {
        return $this->hasMany(YoutubeVideo::class);
    }

    public function entertainmentPosts(): HasMany
    {
        return $this->hasMany(EntertainmentPost::class);
    }

    public function peopleStories(): HasMany
    {
        return $this->hasMany(PeopleStory::class);
    }

    public function storySubmissions(): HasMany
    {
        return $this->hasMany(StorySubmission::class);
    }
}