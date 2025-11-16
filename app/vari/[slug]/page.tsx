import { loadUniversities } from "@/lib/load-universities";
import { getUniversitiesByColor } from "@/lib/get-universities-by-criteria";
import { generateSlug } from "@/lib/generate-slug";
import { parseStyles, capitalizeFirstLetter } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import UniversityCard from "@/components/university-card";
import Script from "next/script";

export const revalidate = 3600;

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
      title: "Väri ei löytynyt | Haalarikone",
    };
  }

  const colorData = getUniversitiesByColor(universities, color);
  const universitiesList = Array.from(
    new Set(colorData.map((u) => u.oppilaitos))
  );

  const capitalizedColor = capitalizeFirstLetter(color);

  return {
    title: `${capitalizedColor} haalari - Haalarivärit | Haalarikone`,
    description: `Selvitä missä oppilaitoksissa käytetään ${capitalizedColor} haalaria. Tietokanta sisältää ${colorData.length} eri haalaria ${universitiesList.length} eri oppilaitoksella.`,
    keywords: [
      `${capitalizedColor} haalari`,
      `${capitalizedColor} haalariväri`,
      `${capitalizedColor} opiskelijahaalari`,
      "haalarivärit",
      "opiskelijahaalarit",
      "suomen opiskelijakulttuuri",
      ...universitiesList.slice(0, 5).map((u) => `${capitalizedColor} ${u}`),
    ],
    openGraph: {
      title: `${capitalizedColor} haalari - Haalarivärit | Haalarikone`,
      description: `Missä oppilaitoksissa käytetään ${capitalizedColor} haalaria? Löydä vastaus Haalarikoneesta.`,
      images: [
        {
          url: "/haalarikone-og.png",
          width: 1200,
          height: 630,
          alt: `${capitalizedColor} haalari`,
        },
      ],
      type: "website",
      siteName: "Haalarikone",
      locale: "fi_FI",
      url: `https://haalarikone.fi/vari/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedColor} haalari - Haalarivärit | Haalarikone`,
      description: `Missä oppilaitoksissa käytetään ${capitalizedColor} haalaria?`,
      images: ["/haalarikone-og.png"],
    },
    alternates: {
      canonical: `https://haalarikone.fi/vari/${slug}`,
      languages: {
        fi: `https://haalarikone.fi/vari/${slug}`,
      },
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
      colorData.flatMap((u) => (u.ala ? u.ala.split(", ") : [])).filter(Boolean)
    )
  );

  const firstColorData = colorData[0];
  const capitalizedColor = capitalizeFirstLetter(color);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Etusivu",
        item: "https://haalarikone.fi",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${capitalizedColor} haalari`,
        item: `https://haalarikone.fi/vari/${slug}`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${capitalizedColor} haalarivärit`,
    description: `Kaikki ${capitalizedColor} haalarivärit suomalaisissa oppilaitoksissa`,
    numberOfItems: colorData.length,
    itemListElement: colorData.slice(0, 50).map((uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: `https://haalarikone.fi/haalari/${uni.id}`,
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
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg border-2 shadow-md"
              style={parseStyles(firstColorData?.hex || null)}
            />
            <div>
              <h1 className="text-4xl font-bold">{capitalizedColor}</h1>
              <p className="text-lg text-gray-700">
                {colorData.length} eri haalaria {universitiesList.length} eri
                oppilaitoksella
              </p>
            </div>
          </div>
        </div>

        <ul className="space-y-3">
          {colorData.map((uni) => (
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
          </div>
        </div>
      </div>
    </>
  );
}
