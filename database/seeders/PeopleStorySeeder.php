<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PeopleStory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PeopleStorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::whereIn('slug', [
            'relationships', 'love-dating', 'life-stories', 'family-parenting',
        ])->get()->keyBy('slug');

        $stories = [
            [
                // Image: smiling woman looking at her smartphone
                // Download: https://images.pexels.com/photos/9429449/pexels-photo-9429449.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/smiling-black-woman-with-smartphone-9429449/
                'title' => 'She waited three years for a reply that finally came',
                'person_name' => 'Aline Uwase',
                'category' => 'love-dating',
                'relationship_status' => 'In a relationship',
                'excerpt' => 'A message sent in 2022 finally got a reply this year — and it changed everything.',
                'story' => "Aline never expected an answer. The message she'd sent years earlier had gone unread for so long she'd stopped checking. Then, out of nowhere, a reply landed in her inbox.\n\nWhat followed was a slow, careful reconnection — late-night calls, old memories resurfacing, and a question neither of them had dared to ask the first time around. \"I wasn't looking for closure,\" she says. \"I was looking for an answer. I just didn't expect it to open a new door instead of closing an old one.\"\n\nToday, the two are figuring out what comes next, one conversation at a time.",
            ],
            [
                // Image: two men hugging each other
                // Download: https://images.pexels.com/photos/1149359/pexels-photo-1149359.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/two-man-hugging-each-other-1149359/
                'title' => 'The apology that took ten years to write',
                'person_name' => 'Eric Nshimiyimana',
                'category' => 'relationships',
                'relationship_status' => 'Reconciled',
                'excerpt' => 'A falling out between brothers lasted a decade. It took one letter to undo it.',
                'story' => "For ten years, Eric and his older brother didn't speak. What started as a disagreement over their late father's land turned into a silence neither of them knew how to break.\n\nIt was Eric's daughter, born after the rift began, who unknowingly pushed things forward — asking why she'd never met her uncle. That question sat with Eric for weeks until he finally wrote the letter he'd been avoiding for a decade.\n\nThe reply came faster than he expected. \"We'd both been waiting for the other person to go first,\" he says. \"Neither of us wanted to anymore.\"",
            ],
            [
                // Image: diverse graduates throwing caps in the air
                // Download: https://images.pexels.com/photos/7942466/pexels-photo-7942466.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/group-of-people-wearing-black-academic-dress-throwing-academic-caps-7942466/
                'title' => 'A single mother\'s promise she almost couldn\'t keep',
                'person_name' => 'Claudine Mukamana',
                'category' => 'family-parenting',
                'relationship_status' => 'Single parent',
                'excerpt' => 'She promised her son a graduation gift she couldn\'t afford — until the community stepped in.',
                'story' => "When Claudine's son was accepted into university, she made a promise she wasn't sure she could keep: a proper celebration, something he'd remember. Raising him alone had never been easy, and the extra cost felt impossible.\n\nWhat she didn't expect was for neighbors, former coworkers, and even her son's old teachers to quietly chip in once word got around. On graduation day, the gathering was bigger than she'd imagined.\n\n\"I always told him effort matters more than money,\" she says. \"That day, I learned community matters just as much.\"",
            ],
            [
                // Image: man proposing to a woman in a garden
                // Download: https://images.pexels.com/photos/20181855/pexels-photo-20181855.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/engagement-of-man-and-woman-20181855/
                'title' => 'He proposed the way she always dreamed — thanks to strangers online',
                'person_name' => 'Jean Paul Habimana',
                'category' => 'love-dating',
                'relationship_status' => 'Engaged',
                'excerpt' => 'A modest budget and an online community turned into the proposal of a lifetime.',
                'story' => "Jean Paul wanted to propose somewhere meaningful, but the venue his partner had once mentioned in passing was far outside his budget. Not knowing where else to turn, he shared his situation in an online community for advice.\n\nWithin days, people he'd never met offered decorations, photography, and even a discounted booking through a friend of a friend. What started as a modest plan became something neither of them will forget.\n\n\"I went looking for a discount,\" he laughs. \"I found a small army of people who just wanted to help.\"",
            ],
            [
                // Image: smiling woman waving during a video call
                // Download: https://images.pexels.com/photos/12912121/pexels-photo-12912121.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/smiling-woman-sitting-in-an-office-and-waving-to-a-laptop-screen-12912121/
                'title' => 'The friendship that survived two continents',
                'person_name' => 'Divine Iradukunda',
                'category' => 'relationships',
                'relationship_status' => 'Long-distance friendship',
                'excerpt' => 'Fifteen years, two continents, and one unbroken friendship.',
                'story' => "Divine and her childhood best friend haven't lived in the same country for over a decade. Time zones, careers, and life changes could easily have pulled them apart — and for a while, it seemed like they might.\n\nWhat kept them close wasn't grand gestures, but small consistent ones: a weekly voice note, remembering each other's important dates, showing up — even virtually — when it mattered most.\n\n\"Distance tests a friendship,\" Divine says. \"It doesn't have to end it.\"",
            ],
            [
                // Image: elderly couple smiling while looking at each other
                // Download: https://images.pexels.com/photos/8317680/pexels-photo-8317680.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/an-elderly-couple-smiling-while-looking-at-each-other-8317680/
                'title' => 'A second chance at love after loss',
                'person_name' => 'Immaculee Nyirahabimana',
                'category' => 'love-dating',
                'relationship_status' => 'Widowed, now remarried',
                'excerpt' => 'After losing her husband, she never expected to fall in love again — until she did.',
                'story' => "After her husband passed, Immaculee assumed that chapter of her life had closed for good. She focused on raising her children and rebuilding a sense of normalcy, love the furthest thing from her mind.\n\nIt was a chance conversation at a community event that changed things. Slowly, cautiously, something unexpected began to grow. \"I didn't go looking for it,\" she says. \"It found me when I was ready, even though I didn't know I was.\"\n\nToday she describes her second marriage not as a replacement, but as its own story entirely.",
            ],
            [
                // Image: father posing with his children, black and white
                // Download: https://images.pexels.com/photos/16369000/pexels-photo-16369000.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/father-posing-with-children-in-black-and-white-16369000/
                'title' => 'Raising three kids alone taught him what strength really means',
                'person_name' => 'Patrick Byiringiro',
                'category' => 'family-parenting',
                'relationship_status' => 'Single parent',
                'excerpt' => 'After his wife\'s passing, Patrick had to learn fatherhood and motherhood at once.',
                'story' => "When Patrick lost his wife, he suddenly found himself solely responsible for three children under the age of ten. He describes the first year as a blur of routines he'd never learned and emotions he didn't have time to process.\n\nWhat got him through, he says, was leaning on his community — aunties who helped with school runs, friends who checked in without being asked, and his children themselves, who taught him patience he didn't know he had.\n\n\"I thought I had to do it all myself,\" he says. \"I learned asking for help isn't weakness.\"",
            ],
            [
                // Image: wedding couple in a garden
                // Download: https://images.pexels.com/photos/18807708/pexels-photo-18807708.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/wedding-couple-in-a-garden-18807708/
                'title' => 'They met at a wedding and got married a year later',
                'person_name' => 'Grace Umutoni',
                'category' => 'love-dating',
                'relationship_status' => 'Married',
                'excerpt' => 'A chance seating arrangement at a friend\'s wedding led to their own.',
                'story' => "Grace almost didn't attend the wedding where she met her now-husband — she'd nearly skipped it after a long week. A last-minute seating change put her next to him, and what began as small talk turned into a conversation that lasted the entire reception.\n\nA year of dating later, they were married in a ceremony not far from where they'd first met. \"People always ask if it was love at first sight,\" she says. \"Honestly, it was more like relief — finally talking to someone who felt easy.\"",
            ],
            [
                // Image: warm embrace between two women
                // Download: https://images.pexels.com/photos/37741524/pexels-photo-37741524.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/warm-embrace-between-two-women-in-nature-37741524/
                'title' => 'The sisters who rebuilt their bond after years of rivalry',
                'person_name' => 'Beatrice Ingabire',
                'category' => 'relationships',
                'relationship_status' => 'Reconciled',
                'excerpt' => 'Childhood competition turned to years of distance — until one crisis brought them back together.',
                'story' => "Beatrice and her sister grew up constantly compared to one another, and the rivalry followed them into adulthood, eventually turning into years of near-silence. It took a family health scare to force them back into the same room.\n\nSitting together in a hospital waiting area, old tension gave way to something neither expected — honesty. \"We finally said the things we'd been avoiding for a decade,\" Beatrice says.\n\nThey now speak weekly, something that once felt unimaginable.",
            ],
            [
                // Image: two men standing together, casual and friendly
                // Download: https://images.pexels.com/photos/1587510/pexels-photo-1587510.jpeg?auto=compress&cs=tinysrgb&w=1600
                // Source page: https://www.pexels.com/photo/two-men-standing-beside-each-other-1587510/
                'title' => 'He drove six hours just to say he was sorry',
                'person_name' => 'Emmanuel Rugamba',
                'category' => 'relationships',
                'relationship_status' => 'Reconciled',
                'excerpt' => 'A misunderstanding cost him a friendship of twenty years — until he decided distance wasn\'t an excuse.',
                'story' => "Emmanuel and his closest friend hadn't spoken in over a year after a misunderstanding neither of them had properly addressed. Texts felt insufficient, and calls kept getting postponed.\n\nEventually, Emmanuel decided the conversation needed to happen in person, even if it meant a six-hour drive. \"I didn't want an apology that could be ignored,\" he says. \"I wanted him to see that I meant it.\"\n\nThe friendship, he says, is stronger now than it was before the falling out.",
            ],
        ];

        foreach ($stories as $index => $story) {
            $category = $categories->get($story['category']);

            PeopleStory::updateOrCreate(
                ['title' => $story['title']],
                [
                    'category_id' => $category?->id,
                    'slug' => Str::slug($story['title']),
                    'person_name' => $story['person_name'],
                    'featured_image' => 'storage/people/' . Str::slug($story['title']) . '.jpg',
                    'excerpt' => $story['excerpt'],
                    'story' => $story['story'],
                    'relationship_status' => $story['relationship_status'],
                    'views' => rand(150, 8000),
                    'is_featured' => $index < 3,
                    'is_popular' => rand(0, 1),
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 45)),
                ]
            );
        }
    }
}