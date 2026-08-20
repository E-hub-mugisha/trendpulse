import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import PublicLayout from "../../Layouts/PublicLayout";

/**
 * Carousel images — download these from Freepik (free tier, attribution required)
 * and drop them into /public/images/story-carousel/ using the filenames below.
 * Good search terms on freepik.com to match the mood of this page:
 *   - "african family storytelling"
 *   - "community storytelling circle"
 *   - "happy african family portrait"
 *   - "grandmother telling story to children"
 * Freepik's free license requires a visible credit line (already added in the footer below) —
 * see https://www.freepik.com/free-license for the exact wording once you pick your images.
 */
const CAROUSEL_SLIDES = [
    {
        image: "/assets/images/story-carousel/family-1.jpg",
        caption: "Every family carries a story worth telling.",
    },
    {
        image: "/assets/images/story-carousel/community-1.jpg",
        caption: "Stories that travel from one generation to the next.",
    },
    {
        image: "/assets/images/story-carousel/elders-1.jpg",
        caption: "Wisdom, shared out loud.",
    },
    {
        image: "/assets/images/story-carousel/children-1.jpg",
        caption: "The next chapter starts with you.",
    },
];

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

    // --- Carousel state ---
    const [slide, setSlide] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5000);
        return () => clearInterval(timerRef.current);
    }, []);

    const goToSlide = (index) => {
        clearInterval(timerRef.current);
        setSlide(index);
        timerRef.current = setInterval(() => {
            setSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5000);
    };

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

                    /* --- Banner carousel --- */
                    .story-page .banner-carousel {
                        position: relative;
                        height: 62vh;
                        min-height: 420px;
                        max-height: 620px;
                        overflow: hidden;
                        background: var(--ink);
                    }

                    .story-page .banner-slide {
                        position: absolute;
                        inset: 0;
                        background-size: cover;
                        background-position: center;
                        opacity: 0;
                        transition: opacity 1s ease-in-out;
                    }

                    .story-page .banner-slide.is-active {
                        opacity: 1;
                    }

                    .story-page .banner-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(
                            180deg,
                            rgba(10, 10, 10, 0.35) 0%,
                            rgba(10, 10, 10, 0.15) 40%,
                            rgba(10, 10, 10, 0.75) 100%
                        );
                    }

                    .story-page .banner-content {
                        position: relative;
                        z-index: 2;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding: 3rem 1.5rem 3.5rem;
                        color: #fff;
                    }

                    .story-page .banner-caption {
                        font-family: 'Fraunces', serif;
                        font-weight: 480;
                        font-style: italic;
                        font-size: 1.15rem;
                        opacity: 0.9;
                        min-height: 1.6em;
                    }

                    .story-page .banner-dots {
                        position: absolute;
                        z-index: 3;
                        right: 1.5rem;
                        bottom: 1.75rem;
                        display: flex;
                        gap: 0.5rem;
                    }

                    .story-page .banner-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 999px;
                        background: rgba(255, 255, 255, 0.4);
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        padding: 0;
                    }

                    .story-page .banner-dot.is-active {
                        width: 22px;
                        background: #fff;
                    }

                    .story-page .image-credit {
                        font-size: 0.68rem;
                        color: #9AA1A8;
                        letter-spacing: 0.02em;
                    }

                    .story-page .content-col {
                        position: relative;
                    }

                    @media (min-width: 1024px) {
                        .story-page .form-col {
                            position: sticky;
                            top: 2rem;
                            align-self: start;
                        }
                    }
                `}</style>
            </Head>

            <div className="story-page">
                {/* BANNER CAROUSEL */}
                <div className="banner-carousel">
                    {CAROUSEL_SLIDES.map((s, i) => (
                        <div
                            key={s.image}
                            className={`banner-slide${i === slide ? " is-active" : ""}`}
                            style={{ backgroundImage: `url(${s.image})` }}
                        />
                    ))}
                    <div className="banner-overlay" />
                    <div className="banner-content mx-auto w-full max-w-5xl">
                        <p className="eyebrow" style={{ color: "#fff", opacity: 0.85 }}>
                            Your voice matters
                        </p>
                        <h1 className="display mt-3 text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
                            Every life writes a chapter{" "}
                            <span style={{ fontStyle: "italic" }}>worth reading</span>.
                        </h1>
                        <p className="banner-caption mt-4">
                            {CAROUSEL_SLIDES[slide].caption}
                        </p>
                    </div>
                    <div className="banner-dots">
                        {CAROUSEL_SLIDES.map((s, i) => (
                            <button
                                key={s.image}
                                type="button"
                                aria-label={`Go to slide ${i + 1}`}
                                className={`banner-dot${i === slide ? " is-active" : ""}`}
                                onClick={() => goToSlide(i)}
                            />
                        ))}
                    </div>
                </div>
                <p className="image-credit mx-auto max-w-5xl px-5 pt-2 sm:px-6 lg:px-8">
                    Photos via Freepik
                </p>

                {/* CONTENT + FORM GRID */}
                <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
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

                    <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
                        {/* LEFT: content / why share */}
                        <div className="content-col lg:col-span-2">
                            <p className="eyebrow">Why share your story</p>
                            <div className="hero-rule mt-4 mb-8" />

                            <p
                                className="text-lg leading-8"
                                style={{ color: "var(--ink-soft)" }}
                            >
                                Tell us about a relationship, a turning point, a
                                lesson learned the hard way, or a journey still
                                in progress. We read every submission, and
                                yours could be the one that reaches someone who
                                needs it.
                            </p>

                            <div className="mt-10 space-y-8">
                                <div className="reason-card pt-5">
                                    <span className="quote-mark">"</span>
                                    <p className="display mt-1 text-lg leading-snug">
                                        Your journey might be the exact
                                        encouragement someone else is looking
                                        for today.
                                    </p>
                                </div>

                                <div className="reason-card pt-5">
                                    <span className="quote-mark">"</span>
                                    <p className="display mt-1 text-lg leading-snug">
                                        Join a community that treats every
                                        kind of experience as worth telling.
                                    </p>
                                </div>

                                <div className="reason-card pt-5">
                                    <span className="quote-mark">"</span>
                                    <p className="display mt-1 text-lg leading-snug">
                                        What you've lived through can become
                                        someone else's wisdom further down the
                                        road.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: form */}
                        <div className="form-col lg:col-span-3">
                            <form
                                onSubmit={submit}
                                className="manuscript-card rounded-2xl p-6 sm:p-10"
                            >
                                <p className="eyebrow mb-8">Share your story</p>

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
                                            I agree that my story may be
                                            published after review.
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
                                            You may contact me about my
                                            submission.
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
                        </div>
                    </div>
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