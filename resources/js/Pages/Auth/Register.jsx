import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="grid min-h-[680px] overflow-hidden rounded-3xl bg-white lg:grid-cols-2">

                {/* Brand panel */}
                <div className="hidden flex-col justify-between bg-black p-10 text-white lg:flex">

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            TrendPulse
                        </p>
                        <h1 className="mt-6 text-4xl font-black leading-tight">
                            Real stories. Real people. Real community.
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-gray-400">
                            Create an account to share your story, follow what's trending,
                            and be part of the conversation.
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            Share your own story with the community
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            Like and comment on posts you care about
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            Free forever — takes less than a minute
                        </div>
                    </div>

                </div>

                {/* Form panel */}
                <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        Get started
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-black underline underline-offset-2"
                        >
                            Log in
                        </Link>
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">

                        <div>
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-2 block w-full rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 block w-full rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 block w-full rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Confirm Password
                            </label>

                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-2 block w-full rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-40"
                        >
                            {processing ? 'Creating account…' : 'Create account'}
                        </button>

                        <p className="text-center text-xs leading-5 text-gray-400">
                            By creating an account you agree to our{' '}
                            <span className="font-bold text-gray-500">Terms</span> and{' '}
                            <span className="font-bold text-gray-500">Privacy Policy</span>.
                        </p>

                    </form>

                </div>

            </div>
        </GuestLayout>
    );
}