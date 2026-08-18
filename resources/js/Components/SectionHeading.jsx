export default function SectionHeading({
    eyebrow,
    title,
    description,
    linkText,
    linkHref,
}) {
    return (
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
                {eyebrow && (
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0A599E]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0A599E]" />
                        {eyebrow}
                    </p>
                )}

                <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {linkText && linkHref && (
                
                <a    href={linkHref}
                    className="text-sm font-bold text-black underline decoration-gray-300 underline-offset-4 transition hover:text-[#0A599E] hover:decoration-[#0A599E]"
                >
                    {linkText} →
                </a>
            )}

        </div>
    );
}