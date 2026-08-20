<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\EntertainmentPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EntertainmentPostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::whereIn('slug', [
            'relationships', 'love-dating', 'life-stories', 'family-parenting',
        ])->get()->keyBy('slug');

        $posts = [
            [
                // Image: friends laughing together while looking at a smartphone
                // Download: https://images.pexels.com/photos/3764496/pexels-photo-3764496.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/happy-diverse-friends-laughing-with-smartphone-at-home-3764496/
                'title' => 'The conversations everyone is talking about this week',
                'excerpt' => 'From viral moments to quiet cultural shifts, here are the stories dominating timelines and group chats right now.',
                'content' => "Every week brings a fresh wave of conversations that ripple across social media, group chats, and dinner tables alike. This week was no exception. A handful of moments — some funny, some heartfelt, some controversial — managed to cut through the noise and get people talking.\n\nWhat makes these moments stick isn't just the content itself, but the way communities engage with it: remixing it, debating it, and making it their own. That's the real story behind entertainment culture today.\n\nWe rounded up the most talked-about threads so you don't have to dig through your feed to catch up.",
                'is_popular' => true,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: streaming computer setup with dual monitors and mic
                // Download: https://images.pexels.com/photos/10782398/pexels-photo-10782398.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/streaming-computer-setup-10782398/
                'title' => 'Inside the trends quietly reshaping entertainment culture',
                'excerpt' => 'Short-form storytelling, creator-led shows, and audience-driven plots are changing what "entertainment" even means.',
                'content' => "The entertainment industry has always evolved with technology, but the pace of change over the last few years has been especially dramatic. Audiences no longer wait for a weekly episode — they expect content on demand, shaped in real time by their own reactions.\n\nCreators are responding by building narratives collaboratively with their communities, testing ideas in short-form formats before expanding them into longer projects.\n\nWe explore what this means for the next generation of shows, music releases, and viral moments.",
                'is_popular' => false,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: hand holding phone showing social media app icons
                // Download: https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/person-holding-iphone-showing-social-networks-folder-607812/
                'title' => 'What is trending this week? Your quick catch-up',
                'excerpt' => 'A fast-moving roundup of the stories, releases, and moments shaping conversations across the community.',
                'content' => "If you only have five minutes to catch up on what's happening in entertainment and culture, this is for you. We've pulled together the releases, debates, and standout moments that defined the week.\n\nFrom surprise announcements to community reactions that took on a life of their own, entertainment doesn't happen in a vacuum — it's shaped by real people responding and sharing.\n\nCheck back every week for a fresh rundown of what's worth your attention.",
                'is_popular' => true,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: film crew working on set with camera and boom mic
                // Download: https://images.pexels.com/photos/19224452/pexels-photo-19224452.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/crew-working-on-filmset-19224452/
                'title' => 'Behind the scenes: how viral moments actually happen',
                'excerpt' => 'It rarely starts with a big studio push. Most viral entertainment moments begin small, then snowball.',
                'content' => "Ever wonder why some clips explode overnight while others, seemingly just as good, disappear without a trace? The answer usually has less to do with production value and more to do with timing, relatability, and the first few hundred shares.\n\nWe spoke to creators about the moments that unexpectedly took off, and a pattern emerged: authenticity beats polish almost every time.\n\nUnderstanding this shift is key for anyone trying to make sense of today's entertainment landscape.",
                'is_popular' => false,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: group of friends hanging out together
                // Download: https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/group-of-friends-hanging-out-933964/
                'title' => 'The rise of community-driven storytelling',
                'excerpt' => 'Fans aren\'t just watching stories anymore — they\'re shaping them, one comment and remix at a time.',
                'content' => "Storytelling used to be a one-way street: a writer or studio created content, and audiences consumed it. That model is shifting fast. Increasingly, fans are co-authors, influencing plot directions and even casting decisions through sheer collective voice.\n\nThis new dynamic creates a tighter feedback loop between creators and their communities, but it also raises questions about creative ownership.\n\nWe look at a few standout examples of community-driven projects and what they reveal about the future of entertainment.",
                'is_popular' => false,
                'category_slug' => 'relationships',
            ],
            [
                // Image: smartphone screen showing app notification badges
                // Download: https://images.pexels.com/photos/32944547/pexels-photo-32944547.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/smartphone-display-with-app-notifications-32944547/
                'title' => 'Five moments from this month that broke the internet',
                'excerpt' => 'A recap of the biggest, most shared, most debated entertainment moments of the month.',
                'content' => "Some months are quiet. This one wasn't. From unexpected reunions to plot twists nobody saw coming, entertainment delivered no shortage of talking points over the past few weeks.\n\nWe've rounded up five moments that stood out — not just for their reach, but for how they sparked genuine conversation across different communities.\n\nWhether you followed along in real time or are catching up after the fact, here's everything worth knowing.",
                'is_popular' => true,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: old retro television displaying static
                // Download: https://images.pexels.com/photos/5197107/pexels-photo-5197107.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/old-television-5197107/
                'title' => 'Why nostalgia keeps winning in entertainment',
                'excerpt' => 'Reboots, reunions, and throwback content keep topping charts. Here\'s why the past sells so well.',
                'content' => "Nostalgia has become one of the most reliable forces in entertainment. Reboots, reunion specials, and throwback playlists consistently draw huge engagement, even when the original material is decades old.\n\nPart of the appeal is comfort — familiar stories and faces offer an emotional anchor in an otherwise fast-changing media landscape.\n\nWe dig into why this trend shows no signs of slowing down, and what it means for creators building new content today.",
                'is_popular' => false,
                'category_slug' => 'family-parenting',
            ],
            [
                // Image: man filming himself with a smartphone and ring light
                // Download: https://images.pexels.com/photos/8276358/pexels-photo-8276358.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/man-sitting-in-front-of-a-ring-light-8276358/
                'title' => 'Micro-celebrities and the new face of influence',
                'excerpt' => 'You don\'t need millions of followers to shape culture anymore. Small, tight-knit audiences are just as powerful.',
                'content' => "The old idea of celebrity — massive reach, mainstream recognition — is being challenged by a new class of micro-influencers who hold outsized sway within smaller, highly engaged communities.\n\nThis shift has changed how entertainment brands think about reach, prioritizing depth of connection over raw numbers.\n\nWe explore what this means for the next wave of entertainment marketing and community building.",
                'is_popular' => false,
                'category_slug' => 'life-stories',
            ],
            [
                // Image: singer performing on stage, back view with crowd and lights
                // Download: https://images.pexels.com/photos/15012072/pexels-photo-15012072.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/back-view-of-singer-on-stage-15012072/
                'title' => 'The comeback stories fans can\'t stop talking about',
                'excerpt' => 'From career revivals to unexpected reunions, comeback stories are having a moment across entertainment.',
                'content' => "There's something universally compelling about a comeback story. Whether it's an artist returning after years away or a show getting a surprise revival, these moments tap into a shared hope that it's never too late for a second act.\n\nThis week, several comeback stories dominated conversations, each with its own unique angle.\n\nWe look at what makes these stories resonate so deeply, and why audiences keep rooting for the underdog to return.",
                'is_popular' => true,
                'category_slug' => 'relationships',
            ],
            [
                // Image: lively concert crowd under stage lights
                // Download: https://images.pexels.com/photos/154147/pexels-photo-154147.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/people-in-concert-154147/
                'title' => 'How live moments are reclaiming the spotlight',
                'excerpt' => 'In a world of on-demand everything, live events and real-time reactions are more valuable than ever.',
                'content' => "With so much entertainment available on demand, you'd expect live moments to matter less. Instead, the opposite is happening. Live events are becoming some of the most valuable entertainment experiences precisely because they can't be replayed or predicted.\n\nThere's a shared energy in experiencing something as it happens, together with thousands of others reacting in real time.\n\nWe explore why live moments are making a comeback, and what it means for how entertainment is consumed.",
                'is_popular' => false,
                'category_slug' => 'life-stories',
            ],
        ];

        foreach ($posts as $index => $post) {
            EntertainmentPost::updateOrCreate(
                ['title' => $post['title']],
                [
                    'category_id' => $categories->get($post['category_slug'])?->id,
                    'slug' => Str::slug($post['title']),
                    'featured_image' => 'storage/entertainment/' . Str::slug($post['title']) . '.jpg',
                    'excerpt' => $post['excerpt'],
                    'content' => $post['content'],
                    'author_id' => 1,
                    'views' => rand(100, 5000),
                    'is_featured' => $index < 3,
                    'is_popular' => $post['is_popular'],
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 30)),
                ]
            );
        }
    }
}