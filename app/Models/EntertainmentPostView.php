<?php
// app/Models/EntertainmentPostView.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntertainmentPostView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'entertainment_post_id',
        'ip_address',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(EntertainmentPost::class, 'entertainment_post_id');
    }
}