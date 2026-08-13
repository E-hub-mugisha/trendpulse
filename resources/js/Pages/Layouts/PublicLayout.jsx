import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({
    children,
    title = 'TrendPulse',
}) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-[#fafafa] text-gray-950">
                <Navbar />

                <main>
                    {children}
                </main>

                <Footer />
            </div>
        </>
    );
}