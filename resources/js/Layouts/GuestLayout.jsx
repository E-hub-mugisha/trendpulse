import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f5] px-5 py-10 sm:px-6 lg:px-8">

            <Link href="/" className="mb-8 flex items-center gap-2">
                <img src="/assets/images/logo.png" alt="TrendPulse Logo" className="h-10 w-auto" />
                <span className="text-lg font-black tracking-tight">
                    TrendPulse
                </span>
            </Link>

            <div className="w-full max-w-5xl">
                {children}
            </div>

            <p className="mt-8 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} TrendPulse. All rights reserved.
            </p>

        </div>
    );
}