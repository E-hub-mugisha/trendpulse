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
        Schema::create('people_stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->string('person_name');

            $table->string('featured_image')->nullable();

            $table->text('excerpt')->nullable();

            $table->longText('story');

            $table->string('relationship_status')->nullable();

            $table->unsignedBigInteger('views')->default(0);

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);

            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people_stories');
    }
};
