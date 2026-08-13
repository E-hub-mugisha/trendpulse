import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Create({ categories }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        name: '',
        email: '',
        title: '',
        category_id: '',
        story: '',
        allow_contact: false,
        allow_publication: true,
    });

    const submit = (event) => {
        event.preventDefault();

        post('/share-your-story');
    };

    return (
        <PublicLayout title="Share Your Story">

            <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8">

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

                {recentlySuccessful && (
                    <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-medium text-green-800">
                        Thank you! Your story has been submitted successfully.
                        Our team will review it before publication.
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10"
                >

                    <div className="grid gap-6 sm:grid-cols-2">

                        <Field
                            label="Your Name"
                            error={errors.name}
                        >
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                type="text"
                                placeholder="Your name"
                                className="input"
                            />
                        </Field>

                        <Field
                            label="Email"
                            error={errors.email}
                        >
                            <input
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                type="email"
                                placeholder="you@example.com"
                                className="input"
                            />
                        </Field>

                    </div>

                    <div className="mt-6">

                        <Field
                            label="Story Title"
                            error={errors.title}
                        >
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                type="text"
                                placeholder="Give your story a title"
                                className="input"
                            />
                        </Field>

                    </div>

                    <div className="mt-6">

                        <Field
                            label="Category"
                            error={errors.category_id}
                        >
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className="input"
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                    </div>

                    <div className="mt-6">

                        <Field
                            label="Your Story"
                            error={errors.story}
                        >
                            <textarea
                                value={data.story}
                                onChange={(e) =>
                                    setData('story', e.target.value)
                                }
                                rows="10"
                                placeholder="Tell us your story..."
                                className="input resize-y"
                            />

                            <p className="mt-2 text-xs text-gray-400">
                                Minimum 50 characters.
                            </p>
                        </Field>

                    </div>

                    <div className="mt-8 space-y-4">

                        <label className="flex cursor-pointer gap-3">

                            <input
                                type="checkbox"
                                checked={data.allow_publication}
                                onChange={(e) =>
                                    setData(
                                        'allow_publication',
                                        e.target.checked
                                    )
                                }
                                className="mt-1"
                            />

                            <span className="text-sm leading-6 text-gray-600">
                                I agree that TrendPulse may publish my story
                                after review.
                            </span>

                        </label>

                        <label className="flex cursor-pointer gap-3">

                            <input
                                type="checkbox"
                                checked={data.allow_contact}
                                onChange={(e) =>
                                    setData(
                                        'allow_contact',
                                        e.target.checked
                                    )
                                }
                                className="mt-1"
                            />

                            <span className="text-sm leading-6 text-gray-600">
                                You may contact me about my submission.
                            </span>

                        </label>

                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-8 w-full rounded-full bg-black px-6 py-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing
                            ? 'Submitting...'
                            : 'Submit My Story'}
                    </button>

                </form>

            </section>

            <Head>
                <style>{`
                    .input {
                        width: 100%;
                        border-radius: 0.75rem;
                        border: 1px solid #e5e7eb;
                        padding: 0.75rem 1rem;
                        outline: none;
                        background: white;
                    }

                    .input:focus {
                        border-color: #000;
                    }
                `}</style>
            </Head>

        </PublicLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="text-sm font-semibold">
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}