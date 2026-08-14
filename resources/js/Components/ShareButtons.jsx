// resources/js/Components/ShareButtons.jsx

const ICONS = {
    facebook: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.2-9.3L1 2h7.4l5 6.7L18.9 2Zm-1.3 18h1.9L7.5 4h-2l12.1 16Z" />
        </svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M17 14.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5L10 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2 0-.2-.2-.2-.5-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21H3.2V8.75Zm6.13 0H12.7v1.68h.05c.46-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.28 4.18 5.25V21h-3.5v-5.4c0-1.29-.02-2.94-1.8-2.94-1.8 0-2.08 1.4-2.08 2.85V21h-3.5V8.75Z" />
        </svg>
    ),
    link: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.5-1.5" strokeLinecap="round" />
        </svg>
    ),
};

export default function ShareButtons({ title, url }) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

    const links = [
        {
            key: 'facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            key: 'x',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            key: 'whatsapp',
            href: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
        },
        {
            key: 'linkedin',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    const copyLink = () => {
        navigator.clipboard?.writeText(shareUrl);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                Share
            </span>

            {links.map((link) => (
                <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 transition hover:bg-black hover:text-white"
                >
                    {ICONS[link.key]}
                </a>
            ))}

            <button
                type="button"
                onClick={copyLink}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 transition hover:bg-black hover:text-white"
                title="Copy link"
            >
                {ICONS.link}
            </button>
        </div>
    );
}