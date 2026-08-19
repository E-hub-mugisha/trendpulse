import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Us" />

            {/* Hero */}
            <section className="bg-[#0A599E] text-white">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

                    <div className="max-w-3xl">

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            About TrendPulse
                        </p>

                        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                            Stories that connect us.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
                            TrendPulse is a community-driven platform where
                            stories, entertainment, people, and conversations
                            come together.
                        </p>

                    </div>

                </div>
            </section>

            {/* Who We Are */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                                Who We Are
                            </p>

                            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                                A platform built around real people and real stories.
                            </h2>

                            <p className="mt-6 leading-8 text-gray-600">
                                TrendPulse is a digital platform created to
                                bring people closer through the stories they
                                share, the people they admire, the
                                entertainment they enjoy, and the conversations
                                that matter to them.
                            </p>

                            <p className="mt-5 leading-8 text-gray-600">
                                We believe that everyone has a story worth
                                hearing. From personal experiences and
                                relationships to inspiring journeys and
                                everyday moments, TrendPulse gives people a
                                place to share their voices and connect with
                                others.
                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="rounded-3xl bg-gray-50 p-7">
                                <div className="text-3xl">🎥</div>

                                <h3 className="mt-5 text-lg font-black">
                                    Stories
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Discover stories from our community and
                                    YouTube channel.
                                </p>
                            </div>

                            <div className="mt-8 rounded-3xl bg-gray-50 p-7">
                                <div className="text-3xl">🎭</div>

                                <h3 className="mt-5 text-lg font-black">
                                    Entertainment
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Stay connected with the latest conversations
                                    and entertainment.
                                </p>
                            </div>

                            <div className="rounded-3xl bg-gray-50 p-7">
                                <div className="text-3xl">❤️</div>

                                <h3 className="mt-5 text-lg font-black">
                                    People
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Hear experiences and perspectives from real
                                    people.
                                </p>
                            </div>

                            <div className="mt-8 rounded-3xl bg-gray-50 p-7">
                                <div className="text-3xl">💬</div>

                                <h3 className="mt-5 text-lg font-black">
                                    Community
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Join conversations, share ideas and connect
                                    with others.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Mission */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="mx-auto max-w-3xl text-center">

                        <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                            Our Mission
                        </p>

                        <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Giving every voice a place to be heard.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Our mission is to create a welcoming digital space
                            where people can discover meaningful stories,
                            express themselves, engage with others, and build
                            genuine connections.
                        </p>

                    </div>

                </div>
            </section>

            {/* What We Do */}
            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="mb-12">

                        <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                            What We Do
                        </p>

                        <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            More than just a content platform.
                        </h2>

                    </div>

                    <div className="grid gap-6 md:grid-cols-3">

                        <div className="rounded-3xl border border-gray-100 p-7 shadow-sm">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                                ▶
                            </div>

                            <h3 className="mt-6 text-xl font-black">
                                YouTube Stories
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                Watch stories and conversations from the
                                TrendPulse YouTube channel.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-gray-100 p-7 shadow-sm">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                                📰
                            </div>

                            <h3 className="mt-6 text-xl font-black">
                                Entertainment
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                Explore news, entertainment and stories that
                                keep our community connected.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-gray-100 p-7 shadow-sm">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                                👥
                            </div>

                            <h3 className="mt-6 text-xl font-black">
                                Community
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                Share your thoughts, interact with others and
                                become part of the conversation.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* Values */}
            <section className="bg-gray-50">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="grid gap-12 lg:grid-cols-2">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                                Our Values
                            </p>

                            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
                                What guides us
                            </h2>

                            <p className="mt-5 leading-8 text-gray-600">
                                We want TrendPulse to be a platform where people
                                feel comfortable sharing, listening and engaging
                                with one another.
                            </p>

                        </div>

                        <div className="space-y-5">

                            <div className="rounded-2xl bg-white p-6">

                                <h3 className="font-black">
                                    Authenticity
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    We value genuine experiences and honest
                                    conversations.
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white p-6">

                                <h3 className="font-black">
                                    Community
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    We believe people are stronger when they
                                    connect and support one another.
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white p-6">

                                <h3 className="font-black">
                                    Respect
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Every person and every perspective deserves
                                    to be treated with respect.
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white p-6">

                                <h3 className="font-black">
                                    Creativity
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    We encourage people to express themselves
                                    through stories, ideas and conversations.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="bg-[#0A599E]">

                <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8 lg:py-20">

                    <h2 className="text-3xl font-black text-white sm:text-4xl">
                        Your story matters.
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
                        Have an experience, journey or story you'd like to
                        share? Become part of the TrendPulse community.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            href="/share-your-story"
                            className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0A599E] transition hover:bg-gray-100"
                        >
                            Share Your Story
                        </Link>

                        <Link
                            href="/community"
                            className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                            Join the Community
                        </Link>

                    </div>

                </div>

            </section>

        </PublicLayout>
    );
}