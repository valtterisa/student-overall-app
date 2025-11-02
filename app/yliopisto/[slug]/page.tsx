import { loadUniversities } from '@/lib/load-universities';
import { getUniversitiesByUniversity } from '@/lib/get-universities-by-criteria';
import { generateSlug } from '@/lib/generate-slug';
import { parseStyles } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const universities = await loadUniversities();
    const uniqueUniversities = Array.from(
        new Set(universities.map((u) => u.oppilaitos))
    );

    return uniqueUniversities.map((uni) => ({
        slug: generateSlug(uni),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueUniversities = Array.from(
        new Set(universities.map((u) => u.oppilaitos))
    );
    const university = uniqueUniversities.find(
        (u) => generateSlug(u) === slug
    );

    if (!university) {
        return {
            title: 'Yliopisto ei löytynyt | Haalarikone',
        };
    }

    const universityData = getUniversitiesByUniversity(universities, university);
    const fields = Array.from(
        new Set(
            universityData
                .flatMap((u) => (u.ala ? u.ala.split(', ') : []))
                .filter(Boolean)
        )
    );

    return {
        title: `${university} - Haalarivärit | Haalarikone`,
        description: `Selvitä kaikki ${university} haalarivärit. Tietokanta sisältää ${universityData.length} eri haalaria eri aloille ja ainejärjestöille.`,
        openGraph: {
            title: `${university} - Haalarivärit | Haalarikone`,
            description: `Selvitä kaikki ${university} haalarivärit. ${fields.length > 0 ? `Alat: ${fields.slice(0, 5).join(', ')}` : ''}`,
            images: ['/haalarikone-og.png'],
        },
        alternates: {
            canonical: `https://haalarikone.fi/yliopisto/${slug}`,
        },
    };
}

export default async function UniversityPage({ params }: Props) {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueUniversities = Array.from(
        new Set(universities.map((u) => u.oppilaitos))
    );
    const university = uniqueUniversities.find(
        (u) => generateSlug(u) === slug
    );

    if (!university) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Yliopisto ei löytynyt</h1>
                <Link href="/" className="text-green hover:underline">
                    Palaa etusivulle
                </Link>
            </div>
        );
    }

    const universityData = getUniversitiesByUniversity(universities, university);
    const fields = Array.from(
        new Set(
            universityData
                .flatMap((u) => (u.ala ? u.ala.split(', ') : []))
                .filter(Boolean)
        )
    );
    const colors = Array.from(new Set(universityData.map((u) => u.vari)));

    const logoPath = `/logos/${university.replace(/\s+/g, '-')}.jpg`;
    const logoExists = university
        .toLowerCase()
        .includes('aalto')
        ? true
        : false;

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: university,
        description: `${university} haalarivärit ja opiskelijakulttuuri`,
        url: `https://haalarikone.fi/yliopisto/${slug}`,
    };

    return (
        <>
            <Script
                id={`organization-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-green hover:underline mb-4 inline-block"
                    >
                        ← Takaisin etusivulle
                    </Link>
                    <h1 className="text-4xl font-bold mb-4">{university}</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Tässä ovat kaikki {university} haalarivärit opiskelijakulttuurissa.
                        Yhteensä {universityData.length} eri haalaria.
                    </p>
                </div>

                <div className="grid gap-6">
                    {universityData.map((uni, index) => (
                        <div
                            key={`${uni.id}-${index}`}
                            className="border rounded-lg p-6 bg-white shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-12 h-12 rounded border-2"
                                            style={parseStyles(uni.hex)}
                                        />
                                        <h2 className="text-xl font-bold">{uni.vari}</h2>
                                    </div>
                                    {uni.ala && (
                                        <p className="text-gray-700 mb-2">
                                            <strong>Ala:</strong> {uni.ala}
                                        </p>
                                    )}
                                    {uni.ainejärjestö && (
                                        <p className="text-gray-700 mb-2">
                                            <strong>Ainejärjestö:</strong> {uni.ainejärjestö}
                                        </p>
                                    )}
                                    {uni.alue && (
                                        <p className="text-gray-600 text-sm">
                                            <strong>Alue:</strong> {uni.alue}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t">
                    <h2 className="text-2xl font-bold mb-4">Liittyvät aiheet</h2>
                    <div className="flex flex-wrap gap-2">
                        {fields.slice(0, 10).map((field) => (
                            <Link
                                key={field}
                                href={`/ala/${generateSlug(field)}`}
                                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
                            >
                                {field}
                            </Link>
                        ))}
                        {colors.slice(0, 5).map((color) => (
                            <Link
                                key={color}
                                href={`/vari/${generateSlug(color)}`}
                                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
                            >
                                {color}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

