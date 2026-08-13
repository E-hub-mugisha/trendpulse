<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('story_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');

            $table->string('title');

            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->longText('story');

            $table->string('status')->default('pending');

            $table->boolean('allow_contact')->default(false);
            $table->boolean('allow_publication')->default(true);

            $table->text('admin_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('story_submissions');
    }
};
