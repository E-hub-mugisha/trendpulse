import { useForm, usePage } from "@inertiajs/react";
import {
    Camera,
    MapPin,
    Pencil,
    X,
    Loader2,
    Image as ImageIcon,
    Heart,
    MessageCircle,
    CalendarDays,
    UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PublicLayout from "../Layouts/PublicLayout";


/*
|--------------------------------------------------------------------------
| Edit Profile Modal
|--------------------------------------------------------------------------
*/

function EditProfileModal({ open, onClose, user }) {
    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm({
        name: user?.name || "",
        bio: user?.bio || "",
        location: user?.location || "",
    });

    const submit = (e) => {
        e.preventDefault();

        patch("/profile", {
            preserveScroll: true,

            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !processing) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A599E]">
                            Profile
                        </p>

                        <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                            Edit your profile
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update how your profile appears to the community.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="space-y-5 p-6 sm:p-7"
                >
                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-xs font-bold text-gray-700">
                            Full name
                        </label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData(
                                    "name",
                                    e.target.value
                                )
                            }
                            placeholder="Your name"
                            disabled={processing}
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#0A599E]/10 ${
                                errors.name
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-[#0A599E]"
                            }`}
                        />

                        {errors.name && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-xs font-bold text-gray-700">
                                Bio
                            </label>

                            <span className="text-[11px] text-gray-400">
                                {data.bio.length}/500
                            </span>
                        </div>

                        <textarea
                            value={data.bio}
                            onChange={(e) =>
                                setData(
                                    "bio",
                                    e.target.value
                                )
                            }
                            rows={4}
                            maxLength={500}
                            placeholder="Tell the community a little about yourself..."
                            disabled={processing}
                            className={`w-full resize-none rounded-2xl border bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#0A599E]/10 ${
                                errors.bio
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-[#0A599E]"
                            }`}
                        />

                        {errors.bio && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.bio}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="mb-2 block text-xs font-bold text-gray-700">
                            Location
                        </label>

                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData(
                                        "location",
                                        e.target.value
                                    )
                                }
                                placeholder="City, Country"
                                disabled={processing}
                                className={`w-full rounded-2xl border bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#0A599E]/10 ${
                                    errors.location
                                        ? "border-red-300 focus:border-red-400"
                                        : "border-gray-200 focus:border-[#0A599E]"
                                }`}
                            />
                        </div>

                        {errors.location && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-full px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A599E] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#07406F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {processing
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyPosts() {
    return (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>

            <h3 className="mt-5 text-base font-black text-gray-900">
                No posts yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Posts shared by this account will appear here.
            </p>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Post Card
|--------------------------------------------------------------------------
*/

function ProfilePost({ post }) {
    return (
        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

            <div className="p-5 sm:p-6">

                {/* Post meta */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A599E]/10 text-[#0A599E]">
                        <UserRound className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-900">
                            {post.created_at || "Recently"}
                        </p>

                        <p className="text-[11px] text-gray-400">
                            Community post
                        </p>
                    </div>
                </div>

                {/* Content */}
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {post.content}
                </p>

                {/* Image */}
                {post.image && (
                    <div className="mt-5 overflow-hidden rounded-2xl bg-gray-100">
                        <img
                            src={post.image}
                            alt="Post"
                            className="max-h-[520px] w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Stats */}
                <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likes_count || 0}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments_count || 0}
                    </span>
                </div>
            </div>
        </article>
    );
}


/*
|--------------------------------------------------------------------------
| Main Profile
|--------------------------------------------------------------------------
*/

export default function Show({ profileUser }) {
    const { flash } = usePage().props;

    const [editOpen, setEditOpen] = useState(false);

    const [avatarPreview, setAvatarPreview] =
        useState(null);

    const [coverPreview, setCoverPreview] =
        useState(null);

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const avatarForm = useForm({
        avatar: null,
    });

    const coverForm = useForm({
        cover_photo: null,
    });

    /*
    |--------------------------------------------------------------------------
    | Avatar
    |--------------------------------------------------------------------------
    */

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setAvatarPreview(
            URL.createObjectURL(file)
        );

        avatarForm.setData("avatar", file);

        avatarForm.post("/profile/avatar", {
            forceFormData: true,
            preserveScroll: true,

            onFinish: () => {
                if (avatarInputRef.current) {
                    avatarInputRef.current.value = "";
                }

                setAvatarPreview(null);
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Cover
    |--------------------------------------------------------------------------
    */

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setCoverPreview(
            URL.createObjectURL(file)
        );

        coverForm.setData("cover_photo", file);

        coverForm.post("/profile/cover", {
            forceFormData: true,
            preserveScroll: true,

            onFinish: () => {
                if (coverInputRef.current) {
                    coverInputRef.current.value = "";
                }

                setCoverPreview(null);
            },
        });
    };

    const avatarSrc =
        avatarPreview ||
        profileUser.avatar_url;

    const coverSrc =
        coverPreview ||
        profileUser.cover_photo_url;

    return (
        <PublicLayout title={profileUser.name}>

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="relative">

                {/* Cover */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#0A599E] via-[#0871B8] to-[#07406F] sm:h-80 lg:h-[360px]">

                    {coverSrc && (
                        <img
                            src={coverSrc}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                    {/* Cover controls */}
                    <div className="absolute bottom-5 right-5">
                        <button
                            type="button"
                            onClick={() =>
                                coverInputRef.current?.click()
                            }
                            disabled={
                                coverForm.processing
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {coverForm.processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}

                            {coverForm.processing
                                ? "Uploading..."
                                : "Edit cover"}
                        </button>

                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={
                                handleCoverChange
                            }
                        />
                    </div>
                </div>

                {/* Profile information */}
                <div className="mx-auto max-w-5xl px-5 sm:px-6">

                    <div className="relative -mt-20 sm:-mt-24">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                            {/* Avatar */}
                            <div className="relative w-fit">

                                <div className="rounded-full bg-white p-1.5 shadow-xl">
                                    <img
                                        src={avatarSrc}
                                        alt={
                                            profileUser.name
                                        }
                                        className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        avatarInputRef.current?.click()
                                    }
                                    disabled={
                                        avatarForm.processing
                                    }
                                    className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#0A599E] text-white shadow-md transition hover:bg-[#07406F] disabled:opacity-60"
                                    aria-label="Change profile photo"
                                >
                                    {avatarForm.processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                </button>

                                <input
                                    ref={
                                        avatarInputRef
                                    }
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={
                                        handleAvatarChange
                                    }
                                />
                            </div>

                            {/* Identity */}
                            <div className="flex flex-1 flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">

                                <div>
                                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                                        {profileUser.name}
                                    </h1>

                                    {profileUser.location && (
                                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 text-[#0A599E]" />

                                            <span>
                                                {
                                                    profileUser.location
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditOpen(true)
                                    }
                                    className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-[#0A599E] hover:text-[#0A599E]"
                                >
                                    <Pencil className="h-4 w-4" />

                                    Edit profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        PROFILE SUMMARY
                    ================================================= */}

                    <div className="mt-6 border-b border-gray-100 pb-8">

                        {profileUser.bio ? (
                            <p className="max-w-2xl text-sm leading-7 text-gray-600">
                                {profileUser.bio}
                            </p>
                        ) : (
                            <p className="text-sm italic text-gray-400">
                                Add a short bio to tell the community
                                about yourself.
                            </p>
                        )}

                        {/* Stats */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">

                            <div>
                                <p className="text-lg font-black text-gray-950">
                                    {
                                        profileUser
                                            .community_posts
                                            ?.length || 0
                                    }
                                </p>

                                <p className="text-xs font-medium text-gray-400">
                                    Posts
                                </p>
                            </div>

                            <div className="h-8 w-px bg-gray-200" />

                            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-400">
                                <CalendarDays className="h-4 w-4" />

                                Community member
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        POSTS
                    ================================================= */}

                    <div className="py-10">

                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A599E]">
                                    Activity
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                                    Posts
                                </h2>
                            </div>

                            {profileUser.community_posts?.length > 0 && (
                                <span className="text-xs font-semibold text-gray-400">
                                    {
                                        profileUser
                                            .community_posts
                                            .length
                                    }{" "}
                                    shared
                                </span>
                            )}
                        </div>

                        {profileUser.community_posts?.length > 0 ? (
                            <div className="space-y-5">
                                {profileUser.community_posts.map(
                                    (post) => (
                                        <ProfilePost
                                            key={
                                                post.id
                                            }
                                            post={post}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <EmptyPosts />
                        )}
                    </div>
                </div>
            </section>

            {/* Edit modal */}
            <EditProfileModal
                open={editOpen}
                onClose={() =>
                    setEditOpen(false)
                }
                user={profileUser}
            />
        </PublicLayout>
    );
}