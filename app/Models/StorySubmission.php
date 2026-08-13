<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorySubmission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'title',
        'category_id',
        'story',
        'status',
        'allow_contact',
        'allow_publication',
        'admin_notes',
    ];

    protected $casts = [
        'allow_contact' => 'boolean',
        'allow_publication' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}