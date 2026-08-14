<?php
// database/migrations/2026_08_14_000002_create_people_story_views_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('people_story_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('people_story_id')->constrained('people_stories')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['people_story_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('people_story_views');
    }
};