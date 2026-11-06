import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const EyeIcon = ({ off }) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [capsOn, setCapsOn] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [shake, setShake] = useState(false);

    const emailInvalid = emailTouched && data.email !== '' && !/^\S+@\S+\.\S+$/.test(data.email);
    const canSubmit = data.email !== '' && data.password !== '' && !processing;

    useEffect(() => {
        if (Object.keys(errors).length === 0) return;
        setShake(true);
        const t = setTimeout(() => setShake(false), 450);
        return () => clearTimeout(t);
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const field =
        'peer block w-full rounded-xl border-0 bg-slate-100 px-3.5 pb-2 pt-5 text-[13px] text-slate-900 ring-1 ring-transparent transition placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
    const label =
        'pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-semibold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-blue-600';

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className={`rounded-2xl bg-white p-6 shadow-[0_12px_40px_-16px_rgba(37,99,235,0.25)] sm:p-8 ${shake ? 'tp-shake' : ''}`}>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Log in</h1>
                <p className="mt-1 text-xs text-slate-500">
                    New here?{' '}
                    <Link href={route('register')} className="font-semibold text-blue-600 hover:underline">
                        Create an account
                    </Link>
                </p>

                {status && (
                    <div role="status" className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
                    <div>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Email"
                                autoComplete="username"
                                autoFocus
                                aria-invalid={!!errors.email || emailInvalid}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                className={`${field} ${errors.email || emailInvalid ? '!ring-2 !ring-red-400' : ''}`}
                            />
                            <label htmlFor="email" className={label}>Email</label>
                        </div>
                        {emailInvalid && !errors.email && (
                            <p className="tp-fade mt-1.5 text-xs text-red-600">Enter a full email, like name@example.com.</p>
                        )}
                        <InputError message={errors.email} className="mt-1.5 text-xs" />
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                autoComplete="current-password"
                                aria-invalid={!!errors.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onKeyDown={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                                onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                                onBlur={() => setCapsOn(false)}
                                className={`${field} pr-10 ${errors.password ? '!ring-2 !ring-red-400' : ''}`}
                            />
                            <label htmlFor="password" className={label}>Password</label>
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                                <EyeIcon off={showPassword} />
                            </button>
                        </div>
                        {capsOn && <p role="status" className="tp-fade mt-1.5 text-xs font-medium text-amber-700">Caps Lock is on.</p>}
                        <InputError message={errors.password} className="mt-1.5 text-xs" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                            />
                            Remember me
                        </label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-xs font-semibold text-slate-500 hover:text-blue-600">
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13px] font-bold text-white transition active:scale-[0.98] enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        {processing && (
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                        {processing ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}