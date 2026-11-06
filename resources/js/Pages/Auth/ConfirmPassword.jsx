import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const EyeIcon = ({ off }) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [capsOn, setCapsOn] = useState(false);
    const [shake, setShake] = useState(false);

    const canSubmit = data.password !== '' && !processing;

    useEffect(() => {
        if (Object.keys(errors).length === 0) return;
        setShake(true);
        const t = setTimeout(() => setShake(false), 450);
        return () => clearTimeout(t);
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    const field =
        'peer block w-full rounded-xl border-0 bg-slate-100 px-3.5 pb-2 pt-5 pr-10 text-[13px] text-slate-900 ring-1 ring-transparent transition placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
    const label =
        'pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-semibold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-blue-600';

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className={`rounded-2xl bg-white p-6 shadow-[0_12px_40px_-16px_rgba(37,99,235,0.25)] sm:p-8 ${shake ? 'tp-shake' : ''}`}>
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                </div>

                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Confirm your password</h1>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                    This is a secure area. Enter your password to continue.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
                    <div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                autoComplete="current-password"
                                autoFocus
                                aria-invalid={!!errors.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onKeyDown={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                                onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                                onBlur={() => setCapsOn(false)}
                                className={`${field} ${errors.password ? '!ring-2 !ring-red-400' : ''}`}
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
                        {processing ? 'Confirming…' : 'Confirm'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}