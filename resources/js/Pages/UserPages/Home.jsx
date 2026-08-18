import PublicLayout from '../Layouts/PublicLayout';
import Hero from '../../Components/Hero';
import SectionHeading from '../../Components/SectionHeading';
import VideoCard from '../../Components/VideoCard';
import NewsCard from '../../Components/NewsCard';
import PeopleStoryCard from '../../Components/PeopleStoryCard';
import CommunityPost from '../../Components/CommunityPost';
import ShareStoryCTA from '../../Components/ShareStoryCTA';

export default function Home({
    featuredVideos = [],
    latestVideos = [],
    latestNews = [],
    featuredStories = [],
    communityPosts = [],
}) {
    return (
        <PublicLayout>

            {/* Hero */}
            <Hero />

            {/* YouTube */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Watch"
                    title="Latest Stories"
                    description="Watch real conversations, experiences and stories from our YouTube channel."
                    linkText="View all videos"
                    linkHref="/youtube"
                />

                {latestVideos.length > 0 ? (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {latestVideos.slice(0, 6).map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Stories are coming soon"
                        text="Our latest YouTube stories will appear here."
                    />
                )}

            </section>

            {/* Entertainment */}
            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                    <SectionHeading
                        eyebrow="Entertainment"
                        title="What's happening"
                        description="The latest entertainment, lifestyle and culture stories."
                        linkText="Explore entertainment"
                        linkHref="/entertainment"
                    />

                    {latestNews.length > 0 ? (
                        <div className="grid gap-7 md:grid-cols-3">
                            {latestNews.slice(0, 3).map((post) => (
                                <NewsCard
                                    key={post.id}
                                    post={post}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No stories yet"
                            text="Entertainment stories will appear here."
                        />
                    )}

                </div>

            </section>

            {/* People */}
            <section className="bg-[#f1f1ef]">

                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                    <SectionHeading
                        eyebrow="People"
                        title="Real relationships. Real experiences."
                        description="Meet people who are willing to share the stories behind their relationships and journeys."
                        linkText="Meet our people"
                        linkHref="/people"
                    />

                    {featuredStories.length > 0 ? (
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredStories.slice(0, 3).map((story) => (
                                <PeopleStoryCard
                                    key={story.id}
                                    story={story}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Stories from our people are coming"
                            text="Relationship and life stories will appear here."
                        />
                    )}

                </div>

            </section>

            {/* Community */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Community"
                    title="Join the conversation"
                    description="Ask questions, share experiences and connect with people in the community."
                    linkText="Visit community"
                    linkHref="/community"
                />

                {communityPosts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {communityPosts.slice(0, 4).map((post) => (
                            <CommunityPost
                                key={post.id}
                                post={post}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="The community is waiting for you"
                        text="Be one of the first people to start a conversation."
                    />
                )}

            </section>

            {/* CTA */}
            <ShareStoryCTA />

        </PublicLayout>
    );
}

function EmptyState({ title, text }) {
    return (
        <div className="rounded-3xl border border-dashed border-[#0A599E]/25 bg-[#0A599E]/5 px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-black">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {text}
            </p>
        </div>
    );
}