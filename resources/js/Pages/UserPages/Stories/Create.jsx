import PublicLayout from "../../Layouts/PublicLayout";

export default function Create() {
    return (
        <PublicLayout title="Share Your Story">

            <section className="mx-auto max-w-4xl px-5 py-20 sm:px-6 lg:px-8">

                <div className="max-w-2xl">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        Your voice matters
                    </p>

                    <h1 className="mt-3 text-5xl font-black tracking-tight">
                        Share Your Story
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-gray-500">
                        Tell us about your experience, relationship,
                        journey or lesson. Your story could inspire someone.
                    </p>

                </div>

                <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">

                    <div className="grid gap-6 sm:grid-cols-2">

                        <div>
                            <label className="text-sm font-semibold">
                                Your Name
                            </label>

                            <input
                                type="text"
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                placeholder="you@example.com"
                            />
                        </div>

                    </div>

                    <div className="mt-6">

                        <label className="text-sm font-semibold">
                            Story Title
                        </label>

                        <input
                            type="text"
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                            placeholder="Give your story a title"
                        />

                    </div>

                    <div className="mt-6">

                        <label className="text-sm font-semibold">
                            Your Story
                        </label>

                        <textarea
                            rows="8"
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                            placeholder="Tell us your story..."
                        />

                    </div>

                    <div className="mt-6">

                        <label className="text-sm font-semibold">
                            Story Category
                        </label>

                        <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black">
                            <option value="">
                                Select category
                            </option>
                            <option value="relationship">
                                Relationship
                            </option>
                            <option value="life">
                                Life Experience
                            </option>
                            <option value="inspiration">
                                Inspiration
                            </option>
                            <option value="family">
                                Family
                            </option>
                            <option value="other">
                                Other
                            </option>
                        </select>

                    </div>

                    <button
                        type="button"
                        className="mt-8 w-full rounded-full bg-black px-6 py-4 text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                        Submit My Story
                    </button>

                </div>

            </section>

        </PublicLayout>
    );
}