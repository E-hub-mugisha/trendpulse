import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const COOLDOWN_SECONDS = 30;

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [emailTouched, setEmailTouched] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [shake, setShake] = useState(false);

    const emailInvalid = emailTouched && data.email !== '' && !/^\S+@\S+\.\S+$/.test(data.email);
    const canSubmit = data.email !== '' && !emailInvalid && !processing && cooldown === 0;

    // Resend countdown after a successful send
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    useEffect(() => {
        if (Object.keys(errors).length === 0) return;
        setShake(true);
        const t = setTimeout(() => setShake(false), 450);
        return () => clearTimeout(t);
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            preserveScroll: true,
            onSuccess: () => setCooldown(COOLDOWN_SECONDS),
        });
    };

    const field =
        'peer block w-full rounded-xl border-0 bg-slate-100 px-3.5 pb-2 pt-5 text-[13px] text-slate-900 ring-1 ring-transparent transition placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
    const label =
        'pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-semibold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-blue-600';

    const buttonText = processing
        ? 'Sending…'
        : cooldown > 0
        ? `Send again in ${cooldown}s`
        : status
        ? 'Send again'
        : 'Send reset link';

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className={`rounded-2xl bg-white p-6 shadow-[0_12px_40px_-16px_rgba(37,99,235,0.25)] sm:p-8 ${shake ? 'tp-shake' : ''}`}>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Reset your password</h1>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Enter your email and we’ll send you a link to choose a new password.
                </p>

                {status && (
                    <div
                        role="status"
                        className="tp-fade mt-4 flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                    >
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        <span>{status}</span>
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
                                autoComplete="email"
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
                        {buttonText}
                    </button>
                </form>

                <p className="mt-5 text-center text-xs text-slate-500">
                    Remembered it?{' '}
                    <Link href={route('login')} className="font-semibold text-blue-600 hover:underline">
                        Back to log in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}