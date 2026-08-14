import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';
import VideoCard from '../../../Components/VideoCard';

export default function Index({ videos }) {
    return (
        <PublicLayout title="YouTube">

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Watch"
                    title="Our Stories on YouTube"
                    description="Real conversations, experiences and stories from our community."
                />

                {videos.data.length > 0 ? (

                    <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

                        {videos.data.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                            />
                        ))}

                    </div>

                ) : (

                    <div className="rounded-3xl bg-gray-100 p-20 text-center">
                        <h3 className="text-xl font-bold">
                            No videos yet
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Check back soon for new stories.
                        </p>
                    </div>

                )}

                {/* Pagination */}
                {videos.links && videos.links.length > 3 && (
                    <div className="mt-14 flex flex-wrap justify-center gap-2">

                        {videos.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm ${
                                    link.active
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-40'
                                        : ''
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