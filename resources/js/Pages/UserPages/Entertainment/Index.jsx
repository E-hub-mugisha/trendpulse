import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';

export default function Index() {
    return (
        <PublicLayout title="Entertainment">
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="Entertainment"
                    title="What's happening"
                    description="Entertainment, lifestyle, culture and trending stories."
                />

                <div className="rounded-3xl bg-gray-100 p-16 text-center">
                    <p className="text-gray-500">
                        Entertainment stories will appear here.
                    </p>
                </div>

            </section>
        </PublicLayout>
    );
}