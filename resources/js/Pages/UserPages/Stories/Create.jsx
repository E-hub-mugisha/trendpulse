import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import PublicLayout from "../../Layouts/PublicLayout";

/**
 * Carousel images — download these from Freepik (free tier, attribution required)
 * and drop them into /public/assets/images/story-carousel/ using the filenames below.
 * Freepik's free license requires a visible credit line (kept under the banner).
 * If an image is missing, the banner falls back to a blue gradient.
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

const STEPS = [
    { id: 1, label: "About you" },
    { id: 2, label: "Your story" },
    { id: 3, label: "Review" },
];

const PROMPTS = [
    "A turning point that changed my life was…",
    "Something I wish I had known sooner is…",
    "A person who changed everything for me…",
    "A challenge I'm still working through…",
];

const REASONS = [
    "Your journey might be the exact encouragement someone else is looking for today.",
    "Join a community that treats every kind of experience as worth telling.",
    "What you've lived through can become someone else's wisdom further down the road.",
];

const FAQS = [
    {
        q: "Will my story be published automatically?",
        a: "No. Your story is only published if you agree to publication, and only after it has been reviewed.",
    },
    {
        q: "Will you contact me?",
        a: "Only if you tick the contact box. You can leave it unticked and still submit your story.",
    },
    {
        q: "Can I come back to finish later?",
        a: "Yes. Your draft is saved in this browser as you type, so you can close the page and pick up where you left off.",
    },
];

const MIN_CHARS = 50;
const DRAFT_KEY = "story_draft_v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------------------
 | Small helpers
 ------------------------------------------------------------------------- */

const Icon = ({ children, className = "h-4 w-4" }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const ChevronLeft = (p) => (
    <Icon {...p}>
        <path d="M15 18l-6-6 6-6" />
    </Icon>
);
const ChevronRight = (p) => (
    <Icon {...p}>
        <path d="M9 18l6-6-6-6" />
    </Icon>
);
const CheckIcon = (p) => (
    <Icon {...p}>
        <path d="M5 13l4 4L19 7" />
    </Icon>
);
const PenIcon = (p) => (
    <Icon {...p}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Icon>
);
const PauseIcon = (p) => (
    <Icon {...p}>
        <path d="M8 5v14M16 5v14" />
    </Icon>
);
const PlayIcon = (p) => (
    <Icon {...p}>
        <path d="M7 4l13 8-13 8V4z" />
    </Icon>
);

function Reveal({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const [on, setOn] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setOn(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setOn(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal${on ? " is-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function Field({ id, label, error, hint, children }) {
    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="field-label">
                    {label}
                </label>
                {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
            </div>
            <div className="mt-1.5">{children}</div>
            {error && (
                <p role="alert" className="field-error mt-1.5 text-xs font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------
 | Page
 ------------------------------------------------------------------------- */

export default function Create() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        title: "",
        story: "",
        allow_contact: false,
        allow_publication: true,
    });

    const [step, setStep] = useState(1);
    const [clientErrors, setClientErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [restored, setRestored] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    // Carousel
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);

    const formRef = useRef(null);
    const textareaRef = useRef(null);
    const mounted = useRef(false);

    /* ----------------------------- derived ----------------------------- */

    const storyLength = data.story.trim().length;
    const meetsMinimum = storyLength >= MIN_CHARS;
    const words = data.story.trim() ? data.story.trim().split(/\s+/).length : 0;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));
    const progress = Math.min(1, storyLength / MIN_CHARS);
    const RING = 2 * Math.PI * 15;

    const errorFor = (key) => clientErrors[key] || errors[key];

    /* --------------------------- draft restore -------------------------- */

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(DRAFT_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved && (saved.story || saved.title || saved.name)) {
                    setData({
                        ...data,
                        name: saved.name || "",
                        email: saved.email || "",
                        title: saved.title || "",
                        story: saved.story || "",
                        allow_contact: !!saved.allow_contact,
                        allow_publication:
                            saved.allow_publication === undefined
                                ? true
                                : !!saved.allow_publication,
                    });
                    setRestored(true);
                }
            }
        } catch (e) {
            /* storage unavailable: ignore */
        }
        mounted.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------------------------- draft save --------------------------- */

    useEffect(() => {
        if (!mounted.current || submitted) return;

        const t = setTimeout(() => {
            try {
                if (data.name || data.email || data.title || data.story) {
                    window.localStorage.setItem(
                        DRAFT_KEY,
                        JSON.stringify({
                            name: data.name,
                            email: data.email,
                            title: data.title,
                            story: data.story,
                            allow_contact: data.allow_contact,
                            allow_publication: data.allow_publication,
                        })
                    );
                    setDraftSaved(true);
                } else {
                    window.localStorage.removeItem(DRAFT_KEY);
                    setDraftSaved(false);
                }
            } catch (e) {
                /* ignore */
            }
        }, 600);

        return () => clearTimeout(t);
    }, [data, submitted]);

    /* ----------------------- focus first field on step ------------------ */

    useEffect(() => {
        if (!mounted.current) return;
        const el = formRef.current?.querySelector("[data-autofocus]");
        if (el) el.focus({ preventScroll: true });
    }, [step]);

    /* ------------------------------ actions ----------------------------- */

    const update = (key, value) => {
        setData(key, value);
        if (clientErrors[key]) {
            setClientErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const validateStep = (n) => {
        const e = {};
        if (n === 1) {
            if (!data.name.trim()) e.name = "Please tell us your name.";
            if (!EMAIL_RE.test(data.email.trim()))
                e.email = "Enter a valid email address.";
        }
        if (n === 2) {
            if (!data.title.trim()) e.title = "Give your story a title.";
            if (storyLength < MIN_CHARS)
                e.story = `Your story needs at least ${MIN_CHARS} characters (${
                    MIN_CHARS - storyLength
                } to go).`;
        }
        return e;
    };

    const goTo = (target) => {
        // going back is always allowed; going forward requires valid steps
        if (target <= step) {
            setStep(target);
            return;
        }
        for (let n = step; n < target; n++) {
            const e = validateStep(n);
            if (Object.keys(e).length) {
                setClientErrors(e);
                setStep(n);
                return;
            }
        }
        setClientErrors({});
        setStep(target);
    };

    const next = () => {
        const e = validateStep(step);
        setClientErrors(e);
        if (Object.keys(e).length === 0) {
            setStep((s) => Math.min(3, s + 1));
            scrollToForm();
        }
    };

    const back = () => {
        setStep((s) => Math.max(1, s - 1));
        scrollToForm();
    };

    const submit = (event) => {
        event.preventDefault();

        if (step < 3) {
            next();
            return;
        }

        post("/share-your-story", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setClientErrors({});
                setStep(1);
                setSubmitted(true);
                setRestored(false);
                setDraftSaved(false);
                try {
                    window.localStorage.removeItem(DRAFT_KEY);
                } catch (e) {
                    /* ignore */
                }
                scrollToForm();
            },
            onError: (errs) => {
                if (errs.name || errs.email) setStep(1);
                else if (errs.title || errs.story) setStep(2);
            },
        });
    };

    const clearDraft = () => {
        reset();
        setClientErrors({});
        setStep(1);
        setRestored(false);
        setDraftSaved(false);
        try {
            window.localStorage.removeItem(DRAFT_KEY);
        } catch (e) {
            /* ignore */
        }
    };

    const insertPrompt = (text) => {
        const base = data.story.trim()
            ? `${data.story.replace(/\s+$/, "")}\n\n${text}`
            : text;
        update("story", base);
        setTimeout(() => {
            const el = textareaRef.current;
            if (el) {
                el.focus();
                el.setSelectionRange(base.length, base.length);
            }
        }, 0);
    };

    const onStoryKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            next();
        }
    };

    const nextSlide = () => setSlide((s) => (s + 1) % CAROUSEL_SLIDES.length);
    const prevSlide = () =>
        setSlide((s) => (s - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

    /* ------------------------------------------------------------------ */

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
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,480;0,9..144,600;1,9..144,480&family=Inter:wght@400;500;600&display=swap"
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
                        --danger: #C0392B;
                        font-family: 'Inter', sans-serif;
                        font-size: 13.5px;
                        background: var(--paper);
                        color: var(--ink);
                    }

                    .story-page .display { font-family: 'Fraunces', serif; }

                    .story-page .eyebrow {
                        font-weight: 500;
                        font-size: 0.68rem;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        color: var(--blue);
                    }

                    .story-page .hero-rule { width: 40px; height: 2px; background: var(--ink); }

                    /* ---------- Reveal ---------- */
                    .story-page .reveal {
                        opacity: 0;
                        transform: translateY(14px);
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }
                    .story-page .reveal.is-in { opacity: 1; transform: none; }

                    /* ---------- Banner ---------- */
                    .story-page .banner {
                        position: relative;
                        height: 58vh;
                        min-height: 400px;
                        max-height: 580px;
                        overflow: hidden;
                        background: linear-gradient(135deg, #07406F 0%, #0A599E 55%, #0b1c2c 100%);
                    }
                    .story-page .banner-slide {
                        position: absolute;
                        inset: 0;
                        background-size: cover;
                        background-position: center;
                        opacity: 0;
                        transform: scale(1);
                        transition: opacity 1s ease-in-out;
                    }
                    .story-page .banner-slide.is-active {
                        opacity: 1;
                        animation: sp-zoom 9s ease-out forwards;
                    }
                    .story-page .banner-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.12) 40%, rgba(10,10,10,0.78) 100%);
                    }
                    .story-page .banner-content {
                        position: relative;
                        z-index: 2;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding: 3rem 1.25rem 4.25rem;
                        color: #fff;
                    }
                    .story-page .banner-caption {
                        font-family: 'Fraunces', serif;
                        font-weight: 480;
                        font-style: italic;
                        font-size: 1rem;
                        opacity: 0.92;
                        min-height: 1.6em;
                        animation: sp-fade 0.7s ease both;
                    }
                    .story-page .banner-controls {
                        position: absolute;
                        z-index: 3;
                        left: 0; right: 0; bottom: 1.1rem;
                    }
                    .story-page .banner-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px; height: 32px;
                        border-radius: 999px;
                        border: 1px solid rgba(255,255,255,0.35);
                        background: rgba(255,255,255,0.12);
                        color: #fff;
                        backdrop-filter: blur(6px);
                        cursor: pointer;
                        transition: background 0.15s ease, transform 0.15s ease;
                    }
                    .story-page .banner-btn:hover { background: rgba(255,255,255,0.28); transform: scale(1.06); }
                    .story-page .banner-seg {
                        position: relative;
                        height: 3px;
                        flex: 1;
                        max-width: 56px;
                        border-radius: 999px;
                        background: rgba(255,255,255,0.3);
                        overflow: hidden;
                        cursor: pointer;
                        border: none;
                        padding: 0;
                    }
                    .story-page .banner-seg > span {
                        position: absolute;
                        inset: 0;
                        background: #fff;
                        transform-origin: left;
                        transform: scaleX(0);
                    }
                    .story-page .banner-seg.is-done > span { transform: scaleX(1); }
                    .story-page .banner-seg.is-active > span { animation: sp-bar 6s linear forwards; }
                    .story-page .banner.is-paused .banner-seg.is-active > span { animation-play-state: paused; }

                    .story-page .image-credit { font-size: 0.66rem; color: #9AA1A8; }

                    /* ---------- Reason cards ---------- */
                    .story-page .reason-card {
                        border-top: 2px solid var(--ink);
                        padding-top: 1rem;
                        transition: border-color 0.2s ease, transform 0.2s ease;
                    }
                    .story-page .reason-card:hover { border-color: var(--blue); transform: translateX(4px); }
                    .story-page .quote-mark {
                        font-family: 'Fraunces', serif;
                        font-size: 2.6rem;
                        line-height: 1;
                        color: var(--blue);
                        opacity: 0.4;
                    }

                    /* ---------- FAQ ---------- */
                    .story-page details.faq { border-bottom: 1px solid #E1E5EA; }
                    .story-page details.faq summary {
                        cursor: pointer;
                        list-style: none;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                        padding: 0.85rem 0;
                        font-weight: 500;
                        font-size: 0.85rem;
                    }
                    .story-page details.faq summary::-webkit-details-marker { display: none; }
                    .story-page details.faq summary::after {
                        content: '+';
                        font-size: 1.1rem;
                        color: var(--blue);
                        transition: transform 0.2s ease;
                    }
                    .story-page details.faq[open] summary::after { transform: rotate(45deg); }
                    .story-page details.faq p {
                        padding: 0 0 1rem;
                        color: var(--ink-soft);
                        line-height: 1.6;
                        animation: sp-fade 0.3s ease both;
                    }

                    /* ---------- Form card ---------- */
                    .story-page .manuscript-card {
                        background: #fff;
                        border: 1px solid #E1E5EA;
                        box-shadow: 0 30px 60px -38px rgba(10,10,10,0.28);
                        position: relative;
                        overflow: hidden;
                    }
                    .story-page .card-accent {
                        height: 3px;
                        background: linear-gradient(90deg, var(--blue), #1d7fd1);
                        transform-origin: left;
                        transition: transform 0.4s ease;
                    }

                    .story-page .stepper-btn {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0;
                        font-size: 0.75rem;
                        font-weight: 500;
                        color: #9AA1A8;
                        transition: color 0.2s ease;
                    }
                    .story-page .stepper-btn .dot {
                        width: 26px; height: 26px;
                        border-radius: 999px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border: 1.5px solid #D8DDE3;
                        font-size: 0.7rem;
                        font-weight: 600;
                        background: #fff;
                        transition: all 0.25s ease;
                    }
                    .story-page .stepper-btn.is-active { color: var(--ink); }
                    .story-page .stepper-btn.is-active .dot { border-color: var(--blue); color: var(--blue); box-shadow: 0 0 0 4px rgba(10,89,158,0.12); }
                    .story-page .stepper-btn.is-done { color: var(--ink-soft); }
                    .story-page .stepper-btn.is-done .dot { background: var(--blue); border-color: var(--blue); color: #fff; }
                    .story-page .stepper-line { flex: 1; height: 2px; background: #E1E5EA; border-radius: 2px; overflow: hidden; margin: 0 0.6rem; }
                    .story-page .stepper-line > span { display: block; height: 100%; background: var(--blue); width: 0; transition: width 0.4s ease; }
                    .story-page .stepper-line.is-done > span { width: 100%; }

                    .story-page .step-pane { animation: sp-step 0.35s ease both; }

                    .story-page label.field-label {
                        font-family: 'Fraunces', serif;
                        font-weight: 480;
                        font-size: 0.88rem;
                        color: var(--ink);
                    }
                    .story-page .field-error { color: var(--danger); animation: sp-fade 0.2s ease both; }

                    .story-page .field-input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        border-bottom: 1.5px solid #D8DDE3;
                        padding: 0.55rem 0.1rem;
                        outline: none;
                        font-family: 'Inter', sans-serif;
                        font-size: 0.9rem;
                        color: var(--ink);
                        transition: border-color 0.15s ease, box-shadow 0.15s ease;
                    }
                    .story-page .field-input::placeholder { color: #9AA1A8; }
                    .story-page .field-input:focus { border-color: var(--blue); box-shadow: 0 1px 0 0 var(--blue); }
                    .story-page .field-input.has-error { border-color: var(--danger); }

                    .story-page .manuscript-wrap {
                        border: 1px solid #E1E5EA;
                        border-radius: 14px;
                        padding: 0.75rem 1rem 0.5rem;
                        transition: border-color 0.2s ease, box-shadow 0.2s ease;
                        background: #FCFDFE;
                    }
                    .story-page .manuscript-wrap:focus-within {
                        border-color: var(--blue);
                        box-shadow: 0 0 0 4px rgba(10,89,158,0.08);
                        background: #fff;
                    }
                    .story-page .manuscript-wrap.has-error { border-color: var(--danger); }
                    .story-page .manuscript-textarea {
                        width: 100%;
                        min-height: 250px;
                        border: none;
                        outline: none;
                        resize: vertical;
                        background-color: transparent;
                        font-family: 'Fraunces', serif;
                        font-weight: 340;
                        font-size: 1rem;
                        line-height: 2.1rem;
                        color: var(--ink);
                        background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 2.05rem, var(--paper-line) 2.05rem, var(--paper-line) calc(2.05rem + 1px));
                        background-position: 0 0.85rem;
                        padding-top: 0.15rem;
                    }
                    .story-page .manuscript-textarea::placeholder { color: #A6ADB4; font-style: italic; }

                    .story-page .chip {
                        border: 1px solid #D8DDE3;
                        background: #fff;
                        border-radius: 999px;
                        padding: 0.35rem 0.8rem;
                        font-size: 0.72rem;
                        font-weight: 500;
                        color: var(--ink-soft);
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }
                    .story-page .chip:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-tint); transform: translateY(-1px); }

                    .story-page .checkbox-row input[type='checkbox'] {
                        appearance: none;
                        width: 1.1rem; height: 1.1rem;
                        border: 1.5px solid #C4CAD1;
                        border-radius: 4px;
                        flex-shrink: 0;
                        margin-top: 2px;
                        display: inline-grid;
                        place-content: center;
                        cursor: pointer;
                        transition: border-color 0.15s ease, background 0.15s ease;
                    }
                    .story-page .checkbox-row input[type='checkbox']:hover { border-color: var(--blue); }
                    .story-page .checkbox-row input[type='checkbox']::before {
                        content: '';
                        width: 0.6rem; height: 0.6rem;
                        transform: scale(0);
                        transition: transform 0.12s ease-in;
                        box-shadow: inset 1rem 1rem var(--blue);
                        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                    }
                    .story-page .checkbox-row input[type='checkbox']:checked::before { transform: scale(1); }
                    .story-page .checkbox-row input[type='checkbox']:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }

                    .story-page .btn-primary {
                        background: var(--blue);
                        color: #fff;
                        font-weight: 500;
                        font-size: 0.82rem;
                        border-radius: 999px;
                        padding: 0.8rem 1.6rem;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        box-shadow: 0 10px 24px -12px rgba(10,89,158,0.7);
                        transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
                    }
                    .story-page .btn-primary:hover:not(:disabled) { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 14px 28px -12px rgba(10,89,158,0.75); }
                    .story-page .btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.99); }
                    .story-page .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

                    .story-page .btn-ghost {
                        font-size: 0.8rem;
                        font-weight: 500;
                        color: var(--ink-soft);
                        padding: 0.8rem 1rem;
                        border-radius: 999px;
                        transition: background 0.15s ease, color 0.15s ease;
                    }
                    .story-page .btn-ghost:hover { background: var(--blue-tint); color: var(--blue); }

                    .story-page .summary-row {
                        display: flex;
                        gap: 1rem;
                        justify-content: space-between;
                        padding: 0.8rem 0;
                        border-bottom: 1px solid #EEF1F4;
                    }
                    .story-page .summary-edit {
                        font-size: 0.72rem;
                        font-weight: 500;
                        color: var(--blue);
                        cursor: pointer;
                        background: none;
                        border: none;
                        flex-shrink: 0;
                    }
                    .story-page .summary-edit:hover { text-decoration: underline; }

                    .story-page .spinner {
                        width: 14px; height: 14px;
                        border-radius: 999px;
                        border: 2px solid rgba(255,255,255,0.4);
                        border-top-color: #fff;
                        animation: sp-spin 0.7s linear infinite;
                    }

                    .story-page .thanks-check {
                        width: 64px; height: 64px;
                        border-radius: 999px;
                        background: var(--blue-tint);
                        color: var(--blue);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: sp-pop 0.5s cubic-bezier(.2,1.4,.4,1) both;
                    }

                    @keyframes sp-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                    @keyframes sp-zoom { from { transform: scale(1); } to { transform: scale(1.07); } }
                    @keyframes sp-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
                    @keyframes sp-step { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
                    @keyframes sp-pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
                    @keyframes sp-spin { to { transform: rotate(360deg); } }

                    @media (max-width: 640px) {
                        .story-page .field-input { font-size: 16px; }
                        .story-page .stepper-btn .label { display: none; }
                        .story-page .stepper-btn.is-active .label { display: inline; }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .story-page .reveal { opacity: 1; transform: none; transition: none; }
                        .story-page .banner-slide.is-active { animation: none; }
                        .story-page .banner-seg.is-active > span { animation: none; transform: scaleX(1); }
                        .story-page .step-pane { animation: none; }
                    }
                `}</style>
            </Head>

            <div className="story-page">
                {/* =====================================================
                    BANNER CAROUSEL
                ===================================================== */}

                <div
                    className={`banner${paused ? " is-paused" : ""}`}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Story inspiration"
                >
                    {CAROUSEL_SLIDES.map((s, i) => (
                        <div
                            key={s.image}
                            className={`banner-slide${i === slide ? " is-active" : ""}`}
                            style={{ backgroundImage: `url(${s.image})` }}
                            aria-hidden={i !== slide}
                        />
                    ))}

                    <div className="banner-overlay" />

                    <div className="banner-content mx-auto w-full max-w-5xl">
                        <p className="eyebrow" style={{ color: "#fff", opacity: 0.85 }}>
                            Your voice matters
                        </p>

                        <h1 className="display mt-3 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
                            Every life writes a chapter{" "}
                            <span style={{ fontStyle: "italic" }}>worth reading</span>.
                        </h1>

                        <p key={slide} className="banner-caption mt-3" aria-live="polite">
                            {CAROUSEL_SLIDES[slide].caption}
                        </p>

                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={scrollToForm}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#07406F] transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <PenIcon />
                                Start writing
                            </button>
                        </div>
                    </div>

                    <div className="banner-controls">
                        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-5 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                className="banner-btn"
                                onClick={prevSlide}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft />
                            </button>

                            <button
                                type="button"
                                className="banner-btn"
                                onClick={nextSlide}
                                aria-label="Next slide"
                            >
                                <ChevronRight />
                            </button>

                            <div className="flex flex-1 items-center gap-2">
                                {CAROUSEL_SLIDES.map((s, i) => (
                                    <button
                                        key={s.image}
                                        type="button"
                                        aria-label={`Go to slide ${i + 1}`}
                                        className={`banner-seg${
                                            i === slide
                                                ? " is-active"
                                                : i < slide
                                                ? " is-done"
                                                : ""
                                        }`}
                                        onClick={() => setSlide(i)}
                                    >
                                        {i === slide && (
                                            <span key={slide} onAnimationEnd={nextSlide} />
                                        )}
                                        {i !== slide && <span />}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="banner-btn"
                                onClick={() => setPaused((p) => !p)}
                                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                            >
                                {paused ? <PlayIcon className="h-3.5 w-3.5" /> : <PauseIcon className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="image-credit mx-auto max-w-5xl px-5 pt-2 sm:px-6 lg:px-8">
                    Photos via Freepik
                </p>

                {/* =====================================================
                    CONTENT + FORM
                ===================================================== */}

                <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
                    {flash?.success && !submitted && (
                        <div
                            className="mb-8 rounded-lg border px-5 py-3.5 text-[13px] font-medium"
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
                            className="mb-8 rounded-lg border px-5 py-3.5 text-[13px] font-medium"
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
                        {/* ---------------- LEFT: why share ---------------- */}
                        <div className="order-2 lg:order-1 lg:col-span-2">
                            <Reveal>
                                <p className="eyebrow">Why share your story</p>
                                <div className="hero-rule mb-6 mt-4" />

                                <p
                                    className="text-[14px] leading-7"
                                    style={{ color: "var(--ink-soft)" }}
                                >
                                    Tell us about a relationship, a turning point, a
                                    lesson learned the hard way, or a journey still in
                                    progress. We read every submission, and yours could
                                    be the one that reaches someone who needs it.
                                </p>
                            </Reveal>

                            <div className="mt-9 space-y-7">
                                {REASONS.map((text, i) => (
                                    <Reveal key={text} delay={i * 90}>
                                        <div className="reason-card">
                                            <span className="quote-mark">"</span>
                                            <p className="display mt-1 text-[15px] leading-snug">
                                                {text}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>

                            <Reveal className="mt-12">
                                <p className="eyebrow mb-2">Good to know</p>
                                <div>
                                    {FAQS.map((f) => (
                                        <details key={f.q} className="faq">
                                            <summary>{f.q}</summary>
                                            <p>{f.a}</p>
                                        </details>
                                    ))}
                                </div>
                            </Reveal>
                        </div>

                        {/* ---------------- RIGHT: form ---------------- */}
                        <div
                            ref={formRef}
                            className="order-1 scroll-mt-6 lg:order-2 lg:col-span-3"
                        >
                            {submitted ? (
                                /* ---------------- THANK YOU ---------------- */
                                <div className="manuscript-card rounded-2xl p-8 text-center sm:p-12">
                                    <div className="thanks-check mx-auto">
                                        <CheckIcon className="h-7 w-7" />
                                    </div>

                                    <h2 className="display mt-6 text-2xl font-medium">
                                        Thank you for sharing
                                    </h2>

                                    <p
                                        className="mx-auto mt-3 max-w-sm text-[13.5px] leading-6"
                                        style={{ color: "var(--ink-soft)" }}
                                    >
                                        {flash?.success ||
                                            "Your story has been received. We read every submission and will review it with care."}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubmitted(false);
                                            setStep(1);
                                        }}
                                        className="btn-primary mt-8"
                                    >
                                        <PenIcon />
                                        Share another story
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={submit}
                                    noValidate
                                    className="manuscript-card rounded-2xl"
                                >
                                    <div
                                        className="card-accent"
                                        style={{ transform: `scaleX(${step / 3})` }}
                                    />

                                    <div className="p-6 sm:p-9">
                                        {/* Stepper */}
                                        <ol className="mb-8 flex items-center">
                                            {STEPS.map((s, i) => (
                                                <li
                                                    key={s.id}
                                                    className="flex items-center"
                                                    style={{
                                                        flex:
                                                            i === STEPS.length - 1
                                                                ? "0 0 auto"
                                                                : "1 1 0",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => goTo(s.id)}
                                                        aria-current={
                                                            step === s.id ? "step" : undefined
                                                        }
                                                        className={`stepper-btn${
                                                            step === s.id
                                                                ? " is-active"
                                                                : step > s.id
                                                                ? " is-done"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span className="dot">
                                                            {step > s.id ? (
                                                                <CheckIcon className="h-3 w-3" />
                                                            ) : (
                                                                s.id
                                                            )}
                                                        </span>
                                                        <span className="label">{s.label}</span>
                                                    </button>

                                                    {i < STEPS.length - 1 && (
                                                        <div
                                                            className={`stepper-line${
                                                                step > s.id ? " is-done" : ""
                                                            }`}
                                                        >
                                                            <span />
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>

                                        {restored && (
                                            <div
                                                className="mb-6 flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-xs"
                                                style={{
                                                    background: "var(--blue-tint)",
                                                    color: "var(--blue-dark)",
                                                }}
                                            >
                                                <span>We restored your saved draft.</span>
                                                <button
                                                    type="button"
                                                    onClick={clearDraft}
                                                    className="font-medium underline-offset-2 hover:underline"
                                                >
                                                    Start fresh
                                                </button>
                                            </div>
                                        )}

                                        {/* ---------------- STEP 1 ---------------- */}
                                        {step === 1 && (
                                            <div key="s1" className="step-pane">
                                                <p className="eyebrow mb-1">Step 1 of 3</p>
                                                <h2 className="display text-xl font-medium">
                                                    First, tell us who you are
                                                </h2>

                                                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                                                    <Field
                                                        id="story-name"
                                                        label="Your name"
                                                        error={errorFor("name")}
                                                    >
                                                        <input
                                                            id="story-name"
                                                            data-autofocus
                                                            value={data.name}
                                                            onChange={(e) =>
                                                                update("name", e.target.value)
                                                            }
                                                            type="text"
                                                            autoComplete="name"
                                                            placeholder="Jane Doe"
                                                            className={`field-input${
                                                                errorFor("name") ? " has-error" : ""
                                                            }`}
                                                        />
                                                    </Field>

                                                    <Field
                                                        id="story-email"
                                                        label="Email"
                                                        error={errorFor("email")}
                                                    >
                                                        <input
                                                            id="story-email"
                                                            value={data.email}
                                                            onChange={(e) =>
                                                                update("email", e.target.value)
                                                            }
                                                            type="email"
                                                            autoComplete="email"
                                                            placeholder="you@example.com"
                                                            className={`field-input${
                                                                errorFor("email") ? " has-error" : ""
                                                            }`}
                                                        />
                                                    </Field>
                                                </div>
                                            </div>
                                        )}

                                        {/* ---------------- STEP 2 ---------------- */}
                                        {step === 2 && (
                                            <div key="s2" className="step-pane">
                                                <p className="eyebrow mb-1">Step 2 of 3</p>
                                                <h2 className="display text-xl font-medium">
                                                    Now, the story itself
                                                </h2>

                                                <div className="mt-7">
                                                    <Field
                                                        id="story-title"
                                                        label="Story title"
                                                        error={errorFor("title")}
                                                    >
                                                        <input
                                                            id="story-title"
                                                            data-autofocus
                                                            value={data.title}
                                                            onChange={(e) =>
                                                                update("title", e.target.value)
                                                            }
                                                            type="text"
                                                            placeholder="Give your story a title"
                                                            className={`field-input${
                                                                errorFor("title") ? " has-error" : ""
                                                            }`}
                                                        />
                                                    </Field>
                                                </div>

                                                <div className="mt-8">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <label
                                                            htmlFor="story-body"
                                                            className="field-label"
                                                        >
                                                            Your story
                                                        </label>

                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="text-[11px]"
                                                                style={{
                                                                    color: meetsMinimum
                                                                        ? "var(--blue)"
                                                                        : "#9AA1A8",
                                                                }}
                                                                aria-live="polite"
                                                            >
                                                                {meetsMinimum
                                                                    ? "Minimum reached"
                                                                    : `${storyLength}/${MIN_CHARS} min`}
                                                            </span>

                                                            <svg
                                                                viewBox="0 0 36 36"
                                                                className="h-6 w-6 -rotate-90"
                                                                aria-hidden="true"
                                                            >
                                                                <circle
                                                                    cx="18"
                                                                    cy="18"
                                                                    r="15"
                                                                    fill="none"
                                                                    stroke="#E1E5EA"
                                                                    strokeWidth="3"
                                                                />
                                                                <circle
                                                                    cx="18"
                                                                    cy="18"
                                                                    r="15"
                                                                    fill="none"
                                                                    stroke="#0A599E"
                                                                    strokeWidth="3"
                                                                    strokeLinecap="round"
                                                                    strokeDasharray={RING}
                                                                    strokeDashoffset={
                                                                        RING * (1 - progress)
                                                                    }
                                                                    style={{
                                                                        transition:
                                                                            "stroke-dashoffset 0.3s ease",
                                                                    }}
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Prompt chips */}
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        <span className="mr-1 self-center text-[11px] text-gray-400">
                                                            Need a spark?
                                                        </span>
                                                        {PROMPTS.map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                className="chip"
                                                                onClick={() => insertPrompt(p)}
                                                            >
                                                                {p.replace("…", "")}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div
                                                        className={`manuscript-wrap mt-3${
                                                            errorFor("story") ? " has-error" : ""
                                                        }`}
                                                    >
                                                        <textarea
                                                            id="story-body"
                                                            ref={textareaRef}
                                                            value={data.story}
                                                            onChange={(e) =>
                                                                update("story", e.target.value)
                                                            }
                                                            onKeyDown={onStoryKeyDown}
                                                            placeholder="Once upon a time…"
                                                            className="manuscript-textarea"
                                                        />

                                                        <div className="flex items-center justify-between border-t border-gray-100 py-2 text-[11px] text-gray-400">
                                                            <span>
                                                                {words} {words === 1 ? "word" : "words"}
                                                                {words > 0 &&
                                                                    ` · about ${readingMinutes} min read`}
                                                            </span>
                                                            <span
                                                                className={`transition-opacity ${
                                                                    draftSaved
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                }`}
                                                            >
                                                                Draft saved
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {errorFor("story") && (
                                                        <p
                                                            role="alert"
                                                            className="field-error mt-2 text-xs font-medium"
                                                        >
                                                            {errorFor("story")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* ---------------- STEP 3 ---------------- */}
                                        {step === 3 && (
                                            <div key="s3" className="step-pane">
                                                <p className="eyebrow mb-1">Step 3 of 3</p>
                                                <h2 className="display text-xl font-medium">
                                                    Review and send
                                                </h2>

                                                <div className="mt-6">
                                                    <div className="summary-row">
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                                From
                                                            </p>
                                                            <p className="mt-1 truncate font-medium">
                                                                {data.name}
                                                            </p>
                                                            <p
                                                                className="truncate"
                                                                style={{ color: "var(--ink-soft)" }}
                                                            >
                                                                {data.email}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="summary-edit"
                                                            onClick={() => setStep(1)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>

                                                    <div className="summary-row">
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                                Story
                                                            </p>
                                                            <p className="display mt-1 text-base font-medium">
                                                                {data.title}
                                                            </p>
                                                            <p
                                                                className="mt-1 whitespace-pre-line leading-6"
                                                                style={{ color: "var(--ink-soft)" }}
                                                            >
                                                                {data.story.trim().length > 280
                                                                    ? `${data.story.trim().slice(0, 280)}…`
                                                                    : data.story.trim()}
                                                            </p>
                                                            <p className="mt-2 text-[11px] text-gray-400">
                                                                {words} words · about {readingMinutes} min read
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="summary-edit"
                                                            onClick={() => setStep(2)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-6 space-y-4">
                                                    <label className="checkbox-row flex cursor-pointer gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.allow_publication}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "allow_publication",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <span
                                                            className="leading-6"
                                                            style={{ color: "var(--ink-soft)" }}
                                                        >
                                                            I agree that my story may be published
                                                            after review.
                                                        </span>
                                                    </label>

                                                    <label className="checkbox-row flex cursor-pointer gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.allow_contact}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "allow_contact",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <span
                                                            className="leading-6"
                                                            style={{ color: "var(--ink-soft)" }}
                                                        >
                                                            You may contact me about my submission.
                                                        </span>
                                                    </label>
                                                </div>

                                                {Object.keys(errors).length > 0 && (
                                                    <p
                                                        role="alert"
                                                        className="field-error mt-5 text-xs font-medium"
                                                    >
                                                        Something needs your attention. Please check
                                                        your details and try again.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* ---------------- NAV ---------------- */}
                                        <div className="mt-9 flex flex-col-reverse items-stretch gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                {step > 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={back}
                                                        disabled={processing}
                                                        className="btn-ghost inline-flex items-center gap-1.5"
                                                    >
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                        Back
                                                    </button>
                                                ) : (
                                                    draftSaved && (
                                                        <button
                                                            type="button"
                                                            onClick={clearDraft}
                                                            className="btn-ghost"
                                                        >
                                                            Clear draft
                                                        </button>
                                                    )
                                                )}
                                            </div>

                                            {step < 3 ? (
                                                <button type="submit" className="btn-primary">
                                                    Continue
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="btn-primary"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <span className="spinner" />
                                                            Sending…
                                                        </>
                                                    ) : (
                                                        "Submit my story"
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {step === 2 && (
                                            <p className="mt-3 hidden text-right text-[11px] text-gray-400 sm:block">
                                                Tip: press Ctrl + Enter to continue.
                                            </p>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}