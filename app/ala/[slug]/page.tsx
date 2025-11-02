import { loadUniversities } from '@/lib/load-universities';
import { getUniversitiesByField } from '@/lib/get-universities-by-criteria';
import { generateSlug } from '@/lib/generate-slug';
import { parseStyles } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const universities = await loadUniversities();
    const uniqueFields = Array.from(
        new Set(
            universities.flatMap((u) => (u.ala ? u.ala.split(', ') : [])).filter(Boolean)
        )
    );

    return uniqueFields.map((field) => ({
        slug: generateSlug(field),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueFields = Array.from(
        new Set(
            universities.flatMap((u) => (u.ala ? u.ala.split(', ') : [])).filter(Boolean)
        )
    );
    const field = uniqueFields.find((f) => generateSlug(f) === slug);

    if (!field) {
        return {
            title: 'Ala ei löytynyt | Haalarikone',
        };
    }

    const fieldData = getUniversitiesByField(universities, field);
    const universitiesList = Array.from(
        new Set(fieldData.map((u) => u.oppilaitos))
    );

    return {
        title: `${field} - Haalarivärit | Haalarikone`,
        description: `Selvitä minkä värinen haalari ${field} alan opiskelijalla on. Tietokanta sisältää haalarivärit ${universitiesList.length} eri oppilaitokselle.`,
        openGraph: {
            title: `${field} - Haalarivärit | Haalarikone`,
            description: `Minkä värinen haalari ${field} alan opiskelijalla on? Löydä vastaus Haalarikoneesta.`,
            images: ['/haalarikone-og.png'],
        },
        alternates: {
            canonical: `https://haalarikone.fi/ala/${slug}`,
        },
    };
}

export default async function FieldPage({ params }: Props) {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueFields = Array.from(
        new Set(
            universities.flatMap((u) => (u.ala ? u.ala.split(', ') : [])).filter(Boolean)
        )
    );
    const field = uniqueFields.find((f) => generateSlug(f) === slug);

    if (!field) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Ala ei löytynyt</h1>
                <Link href="/" className="text-green hover:underline">
                    Palaa etusivulle
                </Link>
            </div>
        );
    }

    const fieldData = getUniversitiesByField(universities, field);
    const universitiesList = Array.from(
        new Set(fieldData.map((u) => u.oppilaitos))
    );
    const colors = Array.from(new Set(fieldData.map((u) => u.vari)));

    const credentialSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: field,
        description: `${field} alan haalarivärit suomalaisissa oppilaitoksissa`,
        url: `https://haalarikone.fi/ala/${slug}`,
    };

    return (
        <>
            <Script
                id={`credential-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(credentialSchema),
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
                    <h1 className="text-4xl font-bold mb-4">{field}</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Tässä ovat kaikki {field} alan haalarivärit suomalaisissa
                        oppilaitoksissa. Yhteensä {fieldData.length} eri haalaria{' '}
                        {universitiesList.length} eri oppilaitoksella.
                    </p>
                </div>

                <div className="grid gap-6">
                    {fieldData.map((uni, index) => (
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
                                        <div>
                                            <h2 className="text-xl font-bold">{uni.vari}</h2>
                                            <p className="text-gray-600">{uni.oppilaitos}</p>
                                        </div>
                                    </div>
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
                        {universitiesList.slice(0, 10).map((uni) => (
                            <Link
                                key={uni}
                                href={`/yliopisto/${generateSlug(uni)}`}
                                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
                            >
                                {uni}
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

