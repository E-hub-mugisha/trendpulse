<?php
// app/Models/PeopleStoryView.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeopleStoryView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'people_story_id',
        'ip_address',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(PeopleStory::class, 'people_story_id');
    }
}