import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import PeopleStoryCard from '../../../Components/PeopleStoryCard';

export default function Index({ stories }) {
    return (
        <PublicLayout title="People">

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="People"
                    title="Real people. Real experiences."
                    description="Stories about relationships, love, family and life."
                />

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                    {stories.data.map((story) => (
                        <PeopleStoryCard
                            key={story.id}
                            story={story}
                        />
                    ))}

                </div>

                {stories.links.length > 3 && (
                    <div className="mt-14 flex flex-wrap justify-center gap-2">

                        {stories.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100'
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}

                    </div>
                )}

            </section>

        </PublicLayout>
    );
}