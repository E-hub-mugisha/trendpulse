import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
    eyebrow,
    title,
    description,
    linkText,
    linkHref,
    tone = 'light', // 'light' | 'dark'
    className = 'mb-8 sm:flex-row sm:items-end sm:justify-between',
}) {
    const dark = tone === 'dark';

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="max-w-2xl">
                {eyebrow && (
                    <p
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            dark ? 'bg-white/10 text-[#9CCBF0]' : 'bg-[#0A599E]/10 text-[#0A599E]'
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#5BA3DB]' : 'bg-[#0A599E]'}`} />
                        {eyebrow}
                    </p>
                )}
                <h2 className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {title}
                </h2>
                {description && (
                    <p className={`mt-2 text-sm leading-6 sm:text-[15px] ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
                )}
            </div>

            {linkText && linkHref && (
                <Link
                    href={linkHref}
                    className={`group inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5BA3DB] sm:self-auto ${
                        dark
                            ? 'border-white/20 text-white hover:bg-white hover:text-[#07406F]'
                            : 'border-slate-200 text-slate-800 hover:border-[#0A599E] hover:bg-[#0A599E] hover:text-white'
                    }`}
                >
                    {linkText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </Link>
            )}
        </div>
    );
}