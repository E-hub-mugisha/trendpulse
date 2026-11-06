import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import PublicLayout from "../../Layouts/PublicLayout";
import SectionHeading from "../../../Components/SectionHeading";
import CommunityPost from "../../../Components/CommunityPost";
import AuthModal from "../../../Components/AuthModal";

const MAX_LENGTH = 1000;
const MAX_IMAGE_MB = 5;

/* -------------------------------------------------------------------------
 | Small icon helpers (inline SVG, no extra dependencies)
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

const ImageIcon = (props) => (
    <Icon {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </Icon>
);

const CloseIcon = (props) => (
    <Icon {...props}>
        <path d="M18 6L6 18M6 6l12 12" />
    </Icon>
);

const SendIcon = (props) => (
    <Icon {...props}>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </Icon>
);

const SparkIcon = (props) => (
    <Icon {...props}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </Icon>
);

/* -------------------------------------------------------------------------
 | Page
 ------------------------------------------------------------------------- */

export default function Index({ posts }) {
    const { auth } = usePage().props;

    const [showAuth, setShowAuth] = useState(false);
    const [focused, setFocused] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [imageError, setImageError] = useState("");

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        content: "",
        image: null,
    });

    /* ----------------------------- derived ----------------------------- */

    const firstName = auth?.user?.name?.split(" ")[0] || "there";
    const initial = auth?.user?.name?.charAt(0)?.toUpperCase() || "U";

    const length = data.content.length;
    const remaining = MAX_LENGTH - length;
    const overLimit = remaining < 0;
    const canSubmit = !processing && data.content.trim().length > 0 && !overLimit;
    const expanded = focused || length > 0 || !!data.image;

    const totalPosts = posts?.total ?? posts?.data?.length ?? 0;

    /* ------------------------- image preview URL ------------------------ */

    const previewUrl = useMemo(
        () => (data.image ? URL.createObjectURL(data.image) : null),
        [data.image]
    );

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /* ------------------------ auto-growing textarea --------------------- */

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
    }, [data.content, expanded]);

    /* ------------------------------ helpers ----------------------------- */

    const pickImage = (file) => {
        setImageError("");

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please choose an image file.");
            return;
        }

        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setImageError(`Image must be smaller than ${MAX_IMAGE_MB} MB.`);
            return;
        }

        setData("image", file);
    };

    const removeImage = () => {
        setData("image", null);
        setImageError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const submit = (e) => {
        e?.preventDefault();

        if (!canSubmit) return;

        post("/community", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setImageError("");
                setFocused(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
        });
    };

    const onKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            submit(e);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickImage(e.dataTransfer.files?.[0]);
    };

    const counterColor = overLimit
        ? "text-red-500"
        : remaining <= 100
        ? "text-amber-500"
        : "text-gray-400";

    /* ------------------------------------------------------------------ */

    return (
        <PublicLayout title="Community">
            {/* Soft page backdrop */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0A599E]/[0.06] via-white to-white">
                <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#0A599E]/10 blur-3xl" />

                <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <SectionHeading
                        eyebrow="Community"
                        title="Join the conversation"
                        description="Share your thoughts, ask questions and connect with other people."
                    />

                    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                        {/* =============================================
                            MAIN COLUMN
                        ============================================= */}

                        <div className="min-w-0">
                            {/* ---------------- COMPOSER ---------------- */}

                            {auth?.user ? (
                                <form
                                    onSubmit={submit}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={onDrop}
                                    className={`relative mb-8 overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
                                        dragging
                                            ? "border-[#0A599E] shadow-xl shadow-[#0A599E]/20 ring-4 ring-[#0A599E]/15"
                                            : focused
                                            ? "border-[#0A599E]/40 shadow-lg shadow-[#0A599E]/10"
                                            : "border-gray-200 shadow-sm"
                                    }`}
                                >
                                    <div className="h-1.5 bg-gradient-to-r from-[#0A599E] via-[#1d7fd1] to-[#0A599E]" />

                                    {/* Drop overlay */}
                                    {dragging && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/90 text-[#0A599E] backdrop-blur-sm">
                                            <ImageIcon className="h-8 w-8" />
                                            <p className="text-[13px] font-medium">
                                                Drop your photo to attach it
                                            </p>
                                        </div>
                                    )}

                                    <div className="p-5 sm:p-7">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A599E] to-[#07406F] text-[13px] font-medium text-white shadow-md shadow-[#0A599E]/30">
                                                {initial}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <label
                                                    htmlFor="community-content"
                                                    className="block text-sm font-semibold text-black"
                                                >
                                                    Have something to say?
                                                </label>

                                                <p className="mt-0.5 text-[13px] text-gray-500">
                                                    Share your thoughts with the wider TrendPulse community.
                                                </p>

                                                {/* Textarea */}
                                                <textarea
                                                    id="community-content"
                                                    ref={textareaRef}
                                                    value={data.content}
                                                    onChange={(e) =>
                                                        setData("content", e.target.value)
                                                    }
                                                    onFocus={() => setFocused(true)}
                                                    onBlur={() => setFocused(false)}
                                                    onKeyDown={onKeyDown}
                                                    placeholder={`What's on your mind, ${firstName}?`}
                                                    rows={expanded ? 4 : 2}
                                                    disabled={processing}
                                                    aria-invalid={!!errors.content || overLimit}
                                                    className="mt-4 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed text-black outline-none transition-all placeholder:text-gray-400 focus:border-[#0A599E] focus:bg-white focus:ring-4 focus:ring-[#0A599E]/10 disabled:opacity-50"
                                                />

                                                {errors.content && (
                                                    <p
                                                        role="alert"
                                                        className="mt-2 text-[11px] font-medium text-red-500"
                                                    >
                                                        {errors.content}
                                                    </p>
                                                )}

                                                {/* Image preview */}
                                                {previewUrl && (
                                                    <div className="group relative mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Selected upload preview"
                                                            className="max-h-72 w-full object-cover"
                                                        />

                                                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                                                            <span className="truncate text-[11px] font-medium text-white">
                                                                {data.image?.name}
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            disabled={processing}
                                                            aria-label="Remove photo"
                                                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-50"
                                                        >
                                                            <CloseIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}

                                                {(imageError || errors.image) && (
                                                    <p
                                                        role="alert"
                                                        className="mt-2 text-[11px] font-medium text-red-500"
                                                    >
                                                        {imageError || errors.image}
                                                    </p>
                                                )}

                                                {/* Upload progress */}

                                                {/* Actions */}
                                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <label
                                                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] font-medium text-gray-700 transition hover:border-[#0A599E] hover:bg-[#0A599E]/5 hover:text-[#0A599E] ${
                                                                processing
                                                                    ? "pointer-events-none opacity-50"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <ImageIcon />
                                                            {data.image ? "Change photo" : "Add photo"}

                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) =>
                                                                    pickImage(e.target.files?.[0])
                                                                }
                                                            />
                                                        </label>

                                                        <span
                                                            className={`text-[11px] font-semibold tabular-nums transition-colors ${counterColor}`}
                                                            aria-live="polite"
                                                        >
                                                            {length > 0 ? remaining : ""}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <Link
                                                            href="/share-your-story"
                                                            className="hidden text-[11px] font-medium text-gray-400 transition hover:text-[#0A599E] sm:inline"
                                                        >
                                                            Write a full story instead →
                                                        </Link>

                                                        <button
                                                            type="submit"
                                                            disabled={!canSubmit}
                                                            className="inline-flex items-center gap-2 rounded-full bg-[#0A599E] px-6 py-2.5 text-[13px] font-medium text-white shadow-md shadow-[#0A599E]/25 transition hover:-translate-y-0.5 hover:bg-[#07406F] hover:shadow-lg active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                                                        >
                                                            {processing ? (
                                                                <>
                                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                                    Posting…
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Post
                                                                    <SendIcon />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {expanded && (
                                                    <p className="mt-3 hidden text-[10px] text-gray-400 sm:block">
                                                        Tip: press{" "}
                                                        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans font-semibold">
                                                            Ctrl
                                                        </kbd>{" "}
                                                        +{" "}
                                                        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans font-semibold">
                                                            Enter
                                                        </kbd>{" "}
                                                        to post, or drag a photo onto this card.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                /* ===========================================
                                   NOT AUTHENTICATED
                                =========================================== */

                                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#0b1c2c] to-[#07406F] text-white shadow-xl shadow-black/10">
                                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#0A599E]/40 blur-3xl" />

                                    <div className="relative p-7 sm:p-9">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
                                            <SparkIcon className="h-3 w-3" />
                                            Members only
                                        </span>

                                        <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
                                            Have something to say?
                                        </h2>

                                        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-gray-300">
                                            Sign in to post, like, and comment with the TrendPulse community.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setShowAuth(true)}
                                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-[#07406F] transition hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg"
                                        >
                                            Sign in to post →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ---------------- FEED HEADER ---------------- */}

                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-black">
                                    Latest posts
                                </h2>

                                {totalPosts > 0 && (
                                    <span className="rounded-full bg-[#0A599E]/10 px-3 py-1 text-[11px] font-medium text-[#0A599E]">
                                        {totalPosts} {totalPosts === 1 ? "post" : "posts"}
                                    </span>
                                )}
                            </div>

                            {/* ---------------- POSTS ---------------- */}

                            <div className="space-y-5">
                                {posts?.data?.length > 0 ? (
                                    posts.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="transition-transform duration-300 hover:-translate-y-0.5"
                                        >
                                            <CommunityPost
                                                post={item}
                                                isAuthenticated={!!auth?.user}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border-2 border-dashed border-[#0A599E]/25 bg-white/70 p-14 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A599E]/10 text-[#0A599E]">
                                            <SparkIcon className="h-6 w-6" />
                                        </div>

                                        <h3 className="mt-4 text-base font-semibold text-black">
                                            No community posts yet
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-xs text-[13px] text-gray-500">
                                            Be part of the first conversation. Your post could start something great.
                                        </p>

                                        {!auth?.user && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAuth(true)}
                                                className="mt-6 rounded-full bg-[#0A599E] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#07406F]"
                                            >
                                                Sign in to post
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ---------------- PAGINATION ---------------- */}

                            {posts?.links?.length > 3 && (
                                <nav
                                    aria-label="Pagination"
                                    className="mt-10 flex flex-wrap justify-center gap-2"
                                >
                                    {posts.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            preserveScroll
                                            aria-current={link.active ? "page" : undefined}
                                            className={`min-w-[2.5rem] rounded-xl px-4 py-2 text-center text-[13px] font-semibold transition ${
                                                link.active
                                                    ? "bg-[#0A599E] text-white shadow-md shadow-[#0A599E]/25"
                                                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#0A599E] hover:text-[#0A599E]"
                                            } ${
                                                !link.url
                                                    ? "pointer-events-none opacity-40"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </nav>
                            )}
                        </div>

                        {/* =============================================
                            SIDEBAR
                        ============================================= */}

                        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-black">
                                    Community guidelines
                                </h3>

                                <ul className="mt-4 space-y-3 text-[13px] text-gray-600">
                                    {[
                                        "Be kind and respectful to everyone.",
                                        "Stay on topic and keep it helpful.",
                                        "No spam, ads or misleading content.",
                                        "Respect people's privacy.",
                                    ].map((rule) => (
                                        <li key={rule} className="flex gap-3">
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-3 w-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A599E] to-[#07406F] p-6 text-white shadow-lg shadow-[#0A599E]/20">
                                <h3 className="text-base font-semibold">
                                    Got a bigger story?
                                </h3>

                                <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                                    Go beyond a quick post and write a full story for the community.
                                </p>

                                <Link
                                    href="/share-your-story"
                                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#07406F] transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    Share your story →
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>

            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </PublicLayout>
    );
}