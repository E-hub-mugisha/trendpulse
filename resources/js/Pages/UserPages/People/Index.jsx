import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../../Components/SectionHeading';

export default function Index() {
    return (
        <PublicLayout title="People">
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

                <SectionHeading
                    eyebrow="People"
                    title="Real people. Real experiences."
                    description="Stories about relationships, love, family and life."
                />

                <div className="rounded-3xl bg-gray-100 p-16 text-center">
                    <p className="text-gray-500">
                        People stories will appear here.
                    </p>
                </div>

            </section>
        </PublicLayout>
    );
}