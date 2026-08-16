import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="grid min-h-[600px] overflow-hidden rounded-3xl bg-white lg:grid-cols-2">

                {/* Brand panel */}
                <div className="hidden flex-col justify-between bg-black p-10 text-white lg:flex">

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            TrendPulse
                        </p>
                        <h1 className="mt-6 text-4xl font-black leading-tight">
                            Welcome back to the conversation.
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-gray-400">
                            Catch up on the latest stories, keep track of what's trending,
                            and join the community discussion.
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            People stories, entertainment &amp; trending news
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            Like, comment and share with the community
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                ✦
                            </span>
                            Your own space to share what matters to you
                        </div>
                    </div>

                </div>

                {/* Form panel */}
                <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        Sign in
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                        Log in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        New here?{' '}
                        <Link
                            href={route('register')}
                            className="font-bold text-black underline underline-offset-2"
                        >
                            Create an account
                        </Link>
                    </p>

                    {status && (
                        <div className="mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8 space-y-5">

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
                                autoFocus
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
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 block w-full rounded-2xl border-0 bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                Remember me
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-gray-500 hover:text-black"
                                >
                                    Forgot password?
                                </Link>
                            )}

                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-40"
                        >
                            {processing ? 'Logging in…' : 'Log in'}
                        </button>

                    </form>

                </div>

            </div>
        </GuestLayout>
    );
}