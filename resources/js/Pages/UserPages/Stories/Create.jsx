import { Head, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";

export default function Create({ categories }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        title: "",
        story: "",
        allow_contact: false,
        allow_publication: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post("/share-your-story", {
            onSuccess: () => reset(),
        });
    };

    const storyLength = data.story.trim().length;
    const meetsMinimum = storyLength >= 50;

    return (
        <PublicLayout title="Share Your Story">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,480;0,9..144,600;1,9..144,480&family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    .story-page {
                        --paper: #FFFFFF;
                        --paper-line: #E4E9EF;
                        --ink: #0A0A0A;
                        --ink-soft: #4A4A4A;
                        --blue: #0A599E;
                        --blue-dark: #07406F;
                        --blue-tint: #EAF1F8;
                        --card: #FFFFFF;
                        font-family: 'Inter', sans-serif;
                        background: var(--paper);
                        color: var(--ink);
                    }

                    .story-page .display {
                        font-family: 'Fraunces', serif;
                    }

                    .story-page .eyebrow {
                        font-family: 'Inter', sans-serif;
                        font-weight: 600;
                        font-size: 0.72rem;
                        letter-spacing: 0.22em;
                        text-transform: uppercase;
                        color: var(--blue);
                    }

                    .story-page .hero-rule {
                        width: 46px;
                        height: 2px;
                        background: var(--ink);
                    }

                    .story-page .quote-mark {
                        font-family: 'Fraunces', serif;
                        font-size: 3.25rem;
                        line-height: 1;
                        color: var(--blue);
                        opacity: 0.4;
                    }

                    .story-page .reason-card {
                        border-top: 2px solid var(--ink);
                        background: transparent;
                    }

                    .story-page .manuscript-card {
                        background: var(--card);
                        border: 1px solid #E1E5EA;
                        box-shadow: 0 30px 60px -35px rgba(10, 10, 10, 0.25);
                        position: relative;
                    }

                    // .story-page .manuscript-card::before {
                    //     content: '';
                    //     position: absolute;
                    //     top: 0;
                    //     left: 34px;
                    //     width: 1px;
                    //     height: 100%;
                    //     background: var(--blue-tint);
                    // }

                    .story-page label.field-label {
                        font-family: 'Fraunces', serif;
                        font-weight: 500;
                        font-size: 0.95rem;
                        color: var(--ink);
                    }

                    .story-page .field-input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        border-bottom: 1.5px solid #D8DDE3;
                        padding: 0.6rem 0.1rem;
                        outline: none;
                        font-family: 'Inter', sans-serif;
                        font-size: 0.98rem;
                        color: var(--ink);
                        transition: border-color 0.15s ease;
                    }

                    .story-page .field-input::placeholder {
                        color: #9AA1A8;
                    }

                    .story-page .field-input:focus {
                        border-color: var(--blue);
                    }

                    .story-page select.field-input {
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%234A4A4A'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 0.2rem center;
                        background-size: 1.1rem;
                        padding-right: 1.5rem;
                    }

                    .story-page .manuscript-textarea {
                        width: 100%;
                        min-height: 260px;
                        border: none;
                        outline: none;
                        resize: vertical;
                        font-family: 'Fraunces', serif;
                        font-weight: 340;
                        font-size: 1.05rem;
                        line-height: 2.15rem;
                        color: var(--ink);
                        background-image: repeating-linear-gradient(
                            to bottom,
                            transparent 0,
                            transparent 2.1rem,
                            var(--paper-line) 2.1rem,
                            var(--paper-line) calc(2.1rem + 1px)
                        );
                        background-position: 0 0.9rem;
                        padding-top: 0.15rem;
                    }

                    .story-page .manuscript-textarea::placeholder {
                        color: #A6ADB4;
                        font-style: italic;
                    }

                    .story-page .checkbox-row input[type='checkbox'] {
                        appearance: none;
                        width: 1.1rem;
                        height: 1.1rem;
                        border: 1.5px solid #C4CAD1;
                        border-radius: 3px;
                        flex-shrink: 0;
                        margin-top: 2px;
                        display: inline-grid;
                        place-content: center;
                        cursor: pointer;
                    }

                    .story-page .checkbox-row input[type='checkbox']::before {
                        content: '';
                        width: 0.6rem;
                        height: 0.6rem;
                        transform: scale(0);
                        transition: transform 0.1s ease-in;
                        box-shadow: inset 1rem 1rem var(--blue);
                        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                    }

                    .story-page .checkbox-row input[type='checkbox']:checked::before {
                        transform: scale(1);
                    }

                    .story-page .submit-btn {
                        background: var(--blue);
                        transition: background 0.15s ease, transform 0.1s ease;
                    }

                    .story-page .submit-btn:hover:not(:disabled) {
                        background: var(--blue-dark);
                    }

                    .story-page .submit-btn:active:not(:disabled) {
                        transform: scale(0.99);
                    }
                `}</style>
            </Head>

            <div className="story-page">
                {/* HERO */}
                <section className="mx-auto max-w-5xl px-5 pt-20 pb-16 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="eyebrow">Your voice matters</p>
                        <div className="hero-rule mt-4 mb-6" />

                        <h1 className="display mt-2 text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
                            Every life
                            <br />
                            writes a chapter{" "}
                            <span
                                style={{
                                    color: "var(--blue)",
                                    fontStyle: "italic",
                                }}
                            >
                                worth reading
                            </span>
                            .
                        </h1>

                        <p
                            className="mt-6 text-lg leading-8"
                            style={{ color: "var(--ink-soft)" }}
                        >
                            Tell us about a relationship, a turning point, a
                            lesson learned the hard way, or a journey still in
                            progress. We read every submission, and yours could
                            be the one that reaches someone who needs it.
                        </p>
                    </div>
                </section>

                {/* WHY SHARE — marginalia, not a numbered sequence */}
                <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-10 sm:grid-cols-3">
                        <div className="reason-card pt-5">
                            <span className="quote-mark">“</span>
                            <p className="display mt-1 text-lg leading-snug">
                                Your journey might be the exact encouragement
                                someone else is looking for today.
                            </p>
                        </div>

                        <div className="reason-card pt-5">
                            <span className="quote-mark">“</span>
                            <p className="display mt-1 text-lg leading-snug">
                                Join a community that treats every kind of
                                experience as worth telling.
                            </p>
                        </div>

                        <div className="reason-card pt-5">
                            <span className="quote-mark">“</span>
                            <p className="display mt-1 text-lg leading-snug">
                                What you've lived through can become someone
                                else's wisdom further down the road.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FORM */}
                <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div
                            className="mb-8 rounded-lg border px-5 py-4 text-sm font-medium"
                            style={{
                                borderColor: "var(--blue)",
                                background: "var(--blue-tint)",
                                color: "var(--blue-dark)",
                            }}
                        >
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div
                            className="mb-8 rounded-lg border px-5 py-4 text-sm font-medium"
                            style={{
                                borderColor: "#c0392b",
                                background: "#fdecea",
                                color: "#c0392b",
                            }}
                        >
                            {flash.error}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="manuscript-card rounded-2xl p-6 sm:p-12"
                    >
                        <p className="eyebrow mb-8">Write your story</p>

                        <div className="grid gap-8 sm:grid-cols-2">
                            <Field label="Your name" error={errors.name}>
                                <input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Jane Doe"
                                    className="field-input"
                                />
                            </Field>

                            <Field label="Email" error={errors.email}>
                                <input
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    type="email"
                                    placeholder="you@example.com"
                                    className="field-input"
                                />
                            </Field>
                        </div>

                        <div className="mt-8">
                            <Field label="Story title" error={errors.title}>
                                <input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Give your story a title"
                                    className="field-input"
                                />
                            </Field>
                        </div>

                        <div className="mt-10">
                            <div className="flex items-baseline justify-between">
                                <label className="field-label">
                                    Your story
                                </label>
                                <span
                                    className="text-xs"
                                    style={{
                                        color: meetsMinimum
                                            ? "var(--blue)"
                                            : "#A6ADB4",
                                    }}
                                >
                                    {storyLength}/50 characters minimum
                                </span>
                            </div>

                            <div className="mt-3">
                                <textarea
                                    value={data.story}
                                    onChange={(e) =>
                                        setData("story", e.target.value)
                                    }
                                    placeholder="Once upon a time…"
                                    className="manuscript-textarea"
                                />
                            </div>

                            {errors.story && (
                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: "var(--blue)" }}
                                >
                                    {errors.story}
                                </p>
                            )}
                        </div>

                        <div
                            className="mt-10 space-y-4 border-t pt-8"
                            style={{ borderColor: "#E1E5EA" }}
                        >
                            <label className="checkbox-row flex cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.allow_publication}
                                    onChange={(e) =>
                                        setData(
                                            "allow_publication",
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span
                                    className="text-sm leading-6"
                                    style={{ color: "var(--ink-soft)" }}
                                >
                                    I agree that my story may be published after
                                    review.
                                </span>
                            </label>

                            <label className="checkbox-row flex cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.allow_contact}
                                    onChange={(e) =>
                                        setData(
                                            "allow_contact",
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span
                                    className="text-sm leading-6"
                                    style={{ color: "var(--ink-soft)" }}
                                >
                                    You may contact me about my submission.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="submit-btn mt-10 w-full rounded-full px-6 py-4 text-sm font-semibold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
                        >
                            {processing ? "Sending…" : "Submit my story"}
                        </button>
                    </form>
                </section>
            </div>
        </PublicLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="field-label">{label}</label>
            <div className="mt-2">{children}</div>
            {error && (
                <p className="mt-2 text-sm" style={{ color: "var(--blue)" }}>
                    {error}
                </p>
            )}
        </div>
    );
}
