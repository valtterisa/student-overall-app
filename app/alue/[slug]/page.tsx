import { loadUniversities } from '@/lib/load-universities';
import { getUniversitiesByArea } from '@/lib/get-universities-by-criteria';
import { generateSlug } from '@/lib/generate-slug';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import UniversityCard from '@/components/university-card';

export const revalidate = 3600;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const universities = await loadUniversities();
    const uniqueAreas = Array.from(
        new Set(
            universities.flatMap((u) =>
                u.alue ? u.alue.split(', ').map((a) => a.trim()) : []
            )
        )
    );

    return uniqueAreas.map((area) => ({
        slug: generateSlug(area),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueAreas = Array.from(
        new Set(
            universities.flatMap((u) =>
                u.alue ? u.alue.split(', ').map((a) => a.trim()) : []
            )
        )
    );
    const area = uniqueAreas.find((a) => generateSlug(a) === slug);

    if (!area) {
        return {
            title: 'Alue ei löytynyt | Haalarikone',
        };
    }

    const areaData = getUniversitiesByArea(universities, area);
    const universitiesList = Array.from(
        new Set(areaData.map((u) => u.oppilaitos))
    );

    const capitalizedArea = capitalizeFirstLetter(area);

    return {
        title: `${capitalizedArea} - Haalarivärit | Haalarikone`,
        description: `Selvitä kaikki ${capitalizedArea} alueen haalarivärit. Tietokanta sisältää ${areaData.length} eri haalaria ${universitiesList.length} eri oppilaitoksella.`,
        keywords: [
            `${capitalizedArea} haalarivärit`,
            `${capitalizedArea} haalarit`,
            `${capitalizedArea} opiskelijahaalarit`,
            'haalarivärit',
            'opiskelijahaalarit',
            'suomen opiskelijakulttuuri',
            ...universitiesList.slice(0, 5).map((u) => `${capitalizedArea} ${u}`),
        ],
        openGraph: {
            title: `${capitalizedArea} - Haalarivärit | Haalarikone`,
            description: `Kaikki ${capitalizedArea} alueen haalarivärit opiskelijakulttuurissa.`,
            images: [
                {
                    url: '/haalarikone-og.png',
                    width: 1200,
                    height: 630,
                    alt: `${capitalizedArea} haalarivärit`,
                },
            ],
            type: 'website',
            siteName: 'Haalarikone',
            locale: 'fi_FI',
            url: `https://haalarikone.fi/alue/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${capitalizedArea} - Haalarivärit | Haalarikone`,
            description: `Kaikki ${capitalizedArea} alueen haalarivärit opiskelijakulttuurissa.`,
            images: ['/haalarikone-og.png'],
        },
        alternates: {
            canonical: `https://haalarikone.fi/alue/${slug}`,
            languages: {
                fi: `https://haalarikone.fi/alue/${slug}`,
            },
        },
    };
}

export default async function AreaPage({ params }: Props) {
    const { slug } = await params;
    const universities = await loadUniversities();
    const uniqueAreas = Array.from(
        new Set(
            universities.flatMap((u) =>
                u.alue ? u.alue.split(', ').map((a) => a.trim()) : []
            )
        )
    );
    const area = uniqueAreas.find((a) => generateSlug(a) === slug);

    if (!area) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Alue ei löytynyt</h1>
                <Link href="/" className="text-green hover:underline">
                    Palaa etusivulle
                </Link>
            </div>
        );
    }

    const areaData = getUniversitiesByArea(universities, area);
    const universitiesList = Array.from(
        new Set(areaData.map((u) => u.oppilaitos))
    );
    const colors = Array.from(new Set(areaData.map((u) => u.vari)));
    const fields = Array.from(
        new Set(
            areaData.flatMap((u) => (u.ala ? u.ala.split(', ') : [])).filter(Boolean)
        )
    );

    const capitalizedArea = capitalizeFirstLetter(area);

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Etusivu',
                item: 'https://haalarikone.fi',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: capitalizedArea,
                item: `https://haalarikone.fi/alue/${slug}`,
            },
        ],
    };

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${capitalizedArea} haalarivärit`,
        description: `Kaikki ${capitalizedArea} alueen haalarivärit opiskelijakulttuurissa`,
        numberOfItems: areaData.length,
        itemListElement: areaData.slice(0, 50).map((uni, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                name: `${uni.vari} haalari - ${capitalizedArea}`,
                description: `${uni.vari} haalari ${uni.oppilaitos} ${uni.ala ? `- ${uni.ala}` : ''}`,
                url: `https://haalarikone.fi/haalari/${uni.id}`,
            },
        })),
    };

    return (
        <>
            <Script
                id={`itemlist-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(itemListSchema),
                }}
            />
            <Script
                id={`breadcrumb-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
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
                <h1 className="text-4xl font-bold mb-4">{capitalizedArea}</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Tässä ovat kaikki {capitalizedArea} alueen haalarivärit opiskelijakulttuurissa.
                    Yhteensä {areaData.length} eri haalaria {universitiesList.length} eri
                    oppilaitoksella.
                </p>
            </div>

            <ul className="space-y-3">
                {areaData.map((uni) => (
                    <UniversityCard key={uni.id} uni={uni} />
                ))}
            </ul>

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

