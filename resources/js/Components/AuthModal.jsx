// resources/js/Components/AuthModal.jsx
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'

    const loginForm = useForm({
        email: '',
        password: '',
        redirect_to: window.location.pathname,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        redirect_to: window.location.pathname,
    });

    if (!open) return null;

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post('/login', {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post('/register', {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-gray-400 hover:text-black"
                >
                    ✕
                </button>

                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setMode('login')}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                            mode === 'login' ? 'bg-[#0A599E] text-white' : 'text-gray-500'
                        }`}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                            mode === 'register' ? 'bg-[#0A599E] text-white' : 'text-gray-500'
                        }`}
                    >
                        Create account
                    </button>
                </div>

                {mode === 'login' ? (
                    <form onSubmit={submitLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginForm.data.email}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                            {loginForm.errors.email && (
                                <p className="mt-1 text-xs text-red-500">{loginForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginForm.data.password}
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                            {loginForm.errors.password && (
                                <p className="mt-1 text-xs text-red-500">{loginForm.errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loginForm.processing}
                            className="w-full rounded-full bg-[#0A599E] py-3 text-sm font-bold text-white disabled:opacity-40"
                        >
                            Sign in
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submitRegister} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={registerForm.data.name}
                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                            {registerForm.errors.name && (
                                <p className="mt-1 text-xs text-red-500">{registerForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={registerForm.data.email}
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                            {registerForm.errors.email && (
                                <p className="mt-1 text-xs text-red-500">{registerForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={registerForm.data.password}
                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                            {registerForm.errors.password && (
                                <p className="mt-1 text-xs text-red-500">{registerForm.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={registerForm.data.password_confirmation}
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0A599E]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={registerForm.processing}
                            className="w-full rounded-full bg-[#0A599E] py-3 text-sm font-bold text-white disabled:opacity-40"
                        >
                            Create account
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}