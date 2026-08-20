import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

const SOCIAL_LINKS = [
    { key: 'facebook', href: 'https://www.facebook.com/trendpulse05global', label: 'Facebook' },
    { key: 'x', href: 'https://x.com/TrendPulse024', label: 'X (Twitter)' },
    { key: 'instagram', href: 'https://www.instagram.com/trend_pulse05/', label: 'Instagram' },
    { key: 'youtube', href: 'https://www.youtube.com/@TrendPulse_Global/featured', label: 'YouTube' },
    { key: 'tiktok', href: 'https://www.tiktok.com/@trend.pulse20', label: 'TikTok' },
];

const SOCIAL_ICONS = {
    facebook: (
        <path d="M14 8.5h2V5.5h-2c-1.93 0-3.5 1.57-3.5 3.5v1.5H8.5v3H10.5V19h3v-6.5H16l.5-3H13.5V9c0-.28.22-.5.5-.5z" />
    ),
    x: (
        <path d="M6 5l5.2 6.86L6.2 19h1.86l4.15-5.06L15.7 19H18l-5.46-7.2L17.3 5h-1.86l-3.83 4.67L8.3 5H6z" />
    ),
    instagram: (
        <>
            <rect x="4.5" y="4.5" width="15" height="15" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="16.3" cy="7.7" r="0.9" />
        </>
    ),
    youtube: (
        <>
            <rect x="3.5" y="6.5" width="17" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 9.7v4.6l4-2.3z" />
        </>
    ),
    tiktok: (
        <path d="M14.5 4.5h2c.2 1.6 1.2 2.8 2.9 3v2c-1.1 0-2.1-.3-3-.9v4.8c0 2.6-2.1 4.6-4.7 4.6a4.7 4.7 0 0 1-1.4-9.2v2.1a2.6 2.6 0 1 0 3.4 2.5V4.5h.8z" />
    ),
};

const InfoIcon = ({ children }) => (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A599E] text-white">
        {children}
    </div>
);

export default function Contact() {
    const { flash } = usePage().props;

    const form = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();

        form.post('/contact', {
            preserveScroll: true,

            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <PublicLayout>

            <Head title="Contact Us" />

            {/* Header */}
            <section className="bg-black text-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0A599E]">
                        Get in touch
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                        Contact us
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                        Questions, ideas, or a story to share? We'd love to
                        hear from you.
                    </p>
                </div>
            </section>

            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="grid gap-16 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <h2 className="text-2xl font-black tracking-tight text-gray-900">
                                Reach us directly
                            </h2>

                            <div className="mt-8 space-y-6">

                                <a href="mailto:trendpulse023@gmail.com" className="flex items-center gap-4">
                                    <InfoIcon>
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
                                            <path d="M4.5 7l7.5 6 7.5-6" />
                                        </svg>
                                    </InfoIcon>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Email
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            trendpulse023@gmail.com
                                        </p>
                                    </div>
                                </a>

                                <a href="tel:+250781824473" className="flex items-center gap-4">
                                    <InfoIcon>
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M6.5 4.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3c0 1-1 1.7-2 1.5-6-1-11-6-12-12-.2-1 .5-2 1-2z" />
                                        </svg>
                                    </InfoIcon>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Phone
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            +250 781 824 473
                                        </p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4">
                                    <InfoIcon>
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M5 5.5h14v9H9.5L6 18v-3.5H5z" />
                                        </svg>
                                    </InfoIcon>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Community
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Join TrendPulse and share your voice.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-10 border-t border-gray-100 pt-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                    Follow us
                                </h3>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {SOCIAL_LINKS.map((social) => (
                                        <a
                                            key={social.key}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#0A599E] hover:text-[#0A599E]"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                                {SOCIAL_ICONS[social.key]}
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Form */}
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 sm:p-8">

                            {flash?.success && (
                                <div className="mb-6 rounded-2xl border border-[#0A599E]/20 bg-white p-4 text-sm font-medium text-[#0A599E]">
                                    {flash.success}
                                </div>
                            )}

                            <form
                                onSubmit={submit}
                                className="space-y-5"
                            >

                                {/* Name */}
                                <div>

                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Your Name
                                    </label>

                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your name"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/15"
                                    />

                                    {form.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.name}
                                        </p>
                                    )}

                                </div>

                                {/* Email */}
                                <div>

                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) =>
                                            form.setData(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/15"
                                    />

                                    {form.errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.email}
                                        </p>
                                    )}

                                </div>

                                {/* Subject */}
                                <div>

                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        value={form.data.subject}
                                        onChange={(e) =>
                                            form.setData(
                                                'subject',
                                                e.target.value
                                            )
                                        }
                                        placeholder="How can we help?"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/15"
                                    />

                                    {form.errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.subject}
                                        </p>
                                    )}

                                </div>

                                {/* Message */}
                                <div>

                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Message
                                    </label>

                                    <textarea
                                        rows="6"
                                        value={form.data.message}
                                        onChange={(e) =>
                                            form.setData(
                                                'message',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Write your message..."
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-[#0A599E]/15"
                                    />

                                    {form.errors.message && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.message}
                                        </p>
                                    )}

                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full rounded-xl bg-[#0A599E] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#084b85] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Sending...'
                                        : 'Send Message'}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </section>

        </PublicLayout>
    );
}