import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

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

            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">

                    <div className="grid gap-16 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <p className="text-sm font-bold uppercase tracking-widest text-[#0A599E]">
                                Get in touch
                            </p>

                            <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                                Contact Us
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                                Have a question, suggestion, partnership idea,
                                or simply want to talk to us? We'd love to hear
                                from you.
                            </p>

                            <div className="mt-10 space-y-6">

                                <div className="flex gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                        ✉
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Email
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Send us a message through the form.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                        💬
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Community
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Join the TrendPulse community and
                                            share your voice.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Form */}
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 sm:p-8">

                            {flash?.success && (
                                <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">
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
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-blue-100"
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
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-blue-100"
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
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-blue-100"
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
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#0A599E] focus:ring-2 focus:ring-blue-100"
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