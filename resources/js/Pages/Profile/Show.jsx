import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import { Camera, MapPin, Pencil } from 'lucide-react';

function EditProfileModal({ open, onClose, user }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        bio: user.bio || '',
        location: user.location || '',
    });

    if (!open) return null;

    const submit = (e) => {
        e.preventDefault();
        patch('/profile', {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8">
                <h2 className="text-xl font-black text-black">Edit profile</h2>

                <form onSubmit={submit} className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500">Name</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500">Bio</label>
                        <textarea
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                        />
                        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500">Location</label>
                        <input
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-full bg-[#0A599E] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Show({ profileUser }) {
    const [editOpen, setEditOpen] = useState(false);
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const avatarForm = useForm({ avatar: null });
    const coverForm = useForm({ cover_photo: null });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        avatarForm.setData('avatar', file);
        avatarForm.post('/profile/avatar', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        coverForm.setData('cover_photo', file);
        coverForm.post('/profile/cover', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout title={profileUser.name}>

            {/* Cover photo */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-[#0A599E] to-[#07406F] sm:h-72">
                {profileUser.cover_photo_url && (
                    <img
                        src={profileUser.cover_photo_url}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                )}

                <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-black/70"
                >
                    <Camera className="h-4 w-4" strokeWidth={2} />
                    Edit cover
                </button>
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                />
            </div>

            <div className="mx-auto max-w-4xl px-5 sm:px-6">

                {/* Avatar + name row */}
                <div className="relative -mt-16 flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">

                    <div className="relative">
                        <img
                            src={profileUser.avatar_url}
                            alt={profileUser.name}
                            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md sm:h-36 sm:w-36"
                        />
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A599E] text-white shadow-md transition hover:bg-[#07406F]"
                        >
                            <Camera className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="mt-4 flex flex-1 flex-col items-center gap-3 pb-4 text-center sm:mt-0 sm:flex-row sm:items-end sm:justify-between sm:text-left">
                        <div>
                            <h1 className="text-2xl font-black text-black">{profileUser.name}</h1>
                            {profileUser.location && (
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500 sm:justify-start">
                                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                                    {profileUser.location}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setEditOpen(true)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-[#0A599E] hover:text-[#0A599E]"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                            Edit profile
                        </button>
                    </div>
                </div>

                {profileUser.bio && (
                    <p className="mt-2 max-w-2xl text-center text-sm text-gray-600 sm:text-left">
                        {profileUser.bio}
                    </p>
                )}

                {/* Posts */}
                <div className="mt-10 border-t border-gray-100 pt-8">
                    <h2 className="mb-5 text-lg font-black text-black">Posts</h2>

                    {profileUser.community_posts?.length > 0 ? (
                        <div className="space-y-4">
                            {profileUser.community_posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="rounded-2xl border border-gray-100 p-5"
                                >
                                    <p className="text-sm text-gray-700">{post.content}</p>
                                    {post.image && (
                                        <img
                                            src={`/storage/${post.image}`}
                                            className="mt-3 max-h-80 w-full rounded-xl object-cover"
                                        />
                                    )}
                                    <div className="mt-3 flex gap-4 text-xs font-semibold text-gray-400">
                                        <span>{post.likes_count} likes</span>
                                        <span>{post.comments_count} comments</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No posts yet.</p>
                    )}
                </div>
            </div>

            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                user={profileUser}
            />

        </PublicLayout>
    );
}