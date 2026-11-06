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

const STRENGTH = [
    { label: '', bar: 'bg-slate-200', text: 'text-slate-400' },
    { label: 'Weak', bar: 'bg-red-400', text: 'text-red-600' },
    { label: 'Fair', bar: 'bg-amber-400', text: 'text-amber-700' },
    { label: 'Good', bar: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Strong', bar: 'bg-green-500', text: 'text-green-600' },
];

function scorePassword(p) {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) s++;
    return Math.max(s, 1);
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [shake, setShake] = useState(false);

    const emailInvalid = emailTouched && data.email !== '' && !/^\S+@\S+\.\S+$/.test(data.email);
    const strength = scorePassword(data.password);
    const hasConfirm = data.password_confirmation !== '';
    const matches = data.password === data.password_confirmation;
    const canSubmit =
        data.name !== '' && data.email !== '' && data.password !== '' && hasConfirm && matches && !processing;

    useEffect(() => {
        if (Object.keys(errors).length === 0) return;
        setShake(true);
        const t = setTimeout(() => setShake(false), 450);
        return () => clearTimeout(t);
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const field =
        'peer block w-full rounded-xl border-0 bg-slate-100 px-3.5 pb-2 pt-5 text-[13px] text-slate-900 ring-1 ring-transparent transition placeholder-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
    const label =
        'pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-semibold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-blue-600';
    const bad = '!ring-2 !ring-red-400';

    const toggle = (
        <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
            <EyeIcon off={showPassword} />
        </button>
    );

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className={`rounded-2xl bg-white p-6 shadow-[0_12px_40px_-16px_rgba(37,99,235,0.25)] sm:p-8 ${shake ? 'tp-shake' : ''}`}>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
                <p className="mt-1 text-xs text-slate-500">
                    Already have one?{' '}
                    <Link href={route('login')} className="font-semibold text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>

                <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
                    {/* Name */}
                    <div>
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder="Name"
                                autoComplete="name"
                                autoFocus
                                aria-invalid={!!errors.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`${field} ${errors.name ? bad : ''}`}
                            />
                            <label htmlFor="name" className={label}>Name</label>
                        </div>
                        <InputError message={errors.name} className="mt-1.5 text-xs" />
                    </div>

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Email"
                                autoComplete="username"
                                aria-invalid={!!errors.email || emailInvalid}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                className={`${field} ${errors.email || emailInvalid ? bad : ''}`}
                            />
                            <label htmlFor="email" className={label}>Email</label>
                        </div>
                        {emailInvalid && !errors.email && (
                            <p className="tp-fade mt-1.5 text-xs text-red-600">Enter a full email, like name@example.com.</p>
                        )}
                        <InputError message={errors.email} className="mt-1.5 text-xs" />
                    </div>

                    {/* Password + strength */}
                    <div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                autoComplete="new-password"
                                aria-invalid={!!errors.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`${field} pr-10 ${errors.password ? bad : ''}`}
                            />
                            <label htmlFor="password" className={label}>Password</label>
                            {toggle}
                        </div>

                        {data.password && (
                            <div className="tp-fade mt-2 flex items-center gap-2" role="status" aria-live="polite">
                                <div className="flex flex-1 gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <span
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? STRENGTH[strength].bar : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className={`w-11 text-right text-[11px] font-semibold ${STRENGTH[strength].text}`}>
                                    {STRENGTH[strength].label}
                                </span>
                            </div>
                        )}
                        <InputError message={errors.password} className="mt-1.5 text-xs" />
                    </div>

                    {/* Confirm */}
                    <div>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                aria-invalid={!!errors.password_confirmation || (hasConfirm && !matches)}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`${field} ${errors.password_confirmation || (hasConfirm && !matches) ? bad : ''}`}
                            />
                            <label htmlFor="password_confirmation" className={label}>Confirm password</label>
                        </div>
                        {hasConfirm && (
                            <p
                                role="status"
                                className={`tp-fade mt-1.5 text-xs font-medium ${matches ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {matches ? 'Passwords match.' : 'Passwords don’t match yet.'}
                            </p>
                        )}
                        <InputError message={errors.password_confirmation} className="mt-1.5 text-xs" />
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13px] font-bold text-white transition active:scale-[0.98] enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        {processing && (
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                        {processing ? 'Creating account…' : 'Create account'}
                    </button>

                    <p className="text-center text-[11px] leading-5 text-slate-400">
                        By creating an account you agree to our{' '}
                        <span className="font-semibold text-slate-500">Terms</span> and{' '}
                        <span className="font-semibold text-slate-500">Privacy Policy</span>.
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}