import PublicLayout from "../Layouts/PublicLayout";

export default function Home() {
    return (
        <PublicLayout>
            <section className="min-h-[80vh] flex items-center">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="max-w-3xl">

                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
                            Stories • People • Community
                        </p>

                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Real Stories.
                            <br />
                            Real People.
                            <br />
                            Real Conversations.
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
                            Discover inspiring stories, entertainment,
                            relationships and conversations from our community.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href="/youtube"
                                className="rounded-full bg-black px-7 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                            >
                                Watch Stories
                            </a>

                            <a
                                href="/share-your-story"
                                className="rounded-full border border-gray-300 px-7 py-3.5 font-semibold transition hover:bg-gray-100"
                            >
                                Share Your Story
                            </a>
                        </div>

                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}