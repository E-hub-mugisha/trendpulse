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
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                        {eyebrow}
                    </p>
                )}

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            {linkText && linkHref && (
                <a
                    href={linkHref}
                    className="text-sm font-bold text-black underline decoration-gray-300 underline-offset-4 hover:decoration-black"
                >
                    {linkText} →
                </a>
            )}

        </div>
    );
}