import { loadUniversities } from '@/lib/load-universities';
import { getUniversitiesByColor } from '@/lib/get-universities-by-criteria';
import { generateSlug } from '@/lib/generate-slug';
import { parseStyles } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const universities = await loadUniversities();
    const uniqueColors = Array.from(new Set(universities.map((u) => u.vari)));

    return uniqueColors.map((color) => ({
        slug: generateSlug(color),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueColors = Array.from(new Set(universities.map((u) => u.vari)));
    const color = uniqueColors.find((c) => generateSlug(c) === slug);

    if (!color) {
        return {
            title: 'Väri ei löytynyt | Haalarikone',
        };
    }

    const colorData = getUniversitiesByColor(universities, color);
    const universitiesList = Array.from(
        new Set(colorData.map((u) => u.oppilaitos))
    );

    return {
        title: `${color} haalari - Haalarivärit | Haalarikone`,
        description: `Selvitä missä oppilaitoksissa käytetään ${color} haalaria. Tietokanta sisältää ${colorData.length} eri haalaria ${universitiesList.length} eri oppilaitoksella.`,
        openGraph: {
            title: `${color} haalari - Haalarivärit | Haalarikone`,
            description: `Missä oppilaitoksissa käytetään ${color} haalaria? Löydä vastaus Haalarikoneesta.`,
            images: ['/haalarikone-og.png'],
        },
        alternates: {
            canonical: `https://haalarikone.fi/vari/${slug}`,
        },
    };
}

export default async function ColorPage({ params }: Props) {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueColors = Array.from(new Set(universities.map((u) => u.vari)));
    const color = uniqueColors.find((c) => generateSlug(c) === slug);

    if (!color) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Väri ei löytynyt</h1>
                <Link href="/" className="text-green hover:underline">
                    Palaa etusivulle
                </Link>
            </div>
        );
    }

    const colorData = getUniversitiesByColor(universities, color);
    const universitiesList = Array.from(
        new Set(colorData.map((u) => u.oppilaitos))
    );
    const fields = Array.from(
        new Set(
            colorData.flatMap((u) => (u.ala ? u.ala.split(', ') : [])).filter(Boolean)
        )
    );

    const firstColorData = colorData[0];

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/"
                    className="text-green hover:underline mb-4 inline-block"
                >
                    ← Takaisin etusivulle
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className="w-16 h-16 rounded-lg border-2 shadow-md"
                        style={parseStyles(firstColorData?.hex || null)}
                    />
                    <div>
                        <h1 className="text-4xl font-bold">{color}</h1>
                        <p className="text-lg text-gray-700">
                            {colorData.length} eri haalaria {universitiesList.length} eri
                            oppilaitoksella
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {colorData.map((uni, index) => (
                    <div
                        key={`${uni.id}-${index}`}
                        className="border rounded-lg p-6 bg-white shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-2">{uni.oppilaitos}</h2>
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
                    {universitiesList.slice(0, 10).map((uni) => (
                        <Link
                            key={uni}
                            href={`/yliopisto/${generateSlug(uni)}`}
                            className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
                        >
                            {uni}
                        </Link>
                    ))}
                    {fields.slice(0, 10).map((field) => (
                        <Link
                            key={field}
                            href={`/ala/${generateSlug(field)}`}
                            className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
                        >
                            {field}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

