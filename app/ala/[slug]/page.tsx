import { loadUniversities } from "@/lib/load-universities";
import { getUniversitiesByField } from "@/lib/get-universities-by-criteria";
import { generateSlug } from "@/lib/generate-slug";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import UniversityCard from "@/components/university-card";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const universities = await loadUniversities();
  const uniqueFields = Array.from(
    new Set(
      universities
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
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
      universities
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
    )
  );
  const field = uniqueFields.find((f) => generateSlug(f) === slug);

  if (!field) {
    return {
      title: "Ala ei löytynyt | Haalarikone",
    };
  }

  const fieldData = getUniversitiesByField(universities, field);
  const universitiesList = Array.from(
    new Set(fieldData.map((u) => u.oppilaitos))
  );

  const capitalizedField = capitalizeFirstLetter(field);

  return {
    title: `${capitalizedField} - Haalarivärit | Haalarikone`,
    description: `Selvitä minkä värinen haalari ${capitalizedField} alan opiskelijalla on. Tietokanta sisältää haalarivärit ${universitiesList.length} eri oppilaitokselle.`,
    keywords: [
      `${capitalizedField} haalarivärit`,
      `${capitalizedField} haalarit`,
      `${capitalizedField} opiskelijahaalarit`,
      "haalarivärit",
      "opiskelijahaalarit",
      "suomen opiskelijakulttuuri",
      ...universitiesList.slice(0, 5).map((u) => `${capitalizedField} ${u}`),
    ],
    openGraph: {
      title: `${capitalizedField} - Haalarivärit | Haalarikone`,
      description: `Minkä värinen haalari ${capitalizedField} alan opiskelijalla on? Löydä vastaus Haalarikoneesta.`,
      images: [
        {
          url: "/haalarikone-og.png",
          width: 1200,
          height: 630,
          alt: `${capitalizedField} haalarivärit`,
        },
      ],
      type: "website",
      siteName: "Haalarikone",
      locale: "fi_FI",
      url: `https://haalarikone.fi/ala/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedField} - Haalarivärit | Haalarikone`,
      description: `Minkä värinen haalari ${capitalizedField} alan opiskelijalla on?`,
      images: ["/haalarikone-og.png"],
    },
    alternates: {
      canonical: `https://haalarikone.fi/ala/${slug}`,
      languages: {
        fi: `https://haalarikone.fi/ala/${slug}`,
      },
    },
  };
}

export default async function FieldPage({ params }: Props) {
  const { slug } = await params;
  const universities = await loadUniversities();
  const uniqueFields = Array.from(
    new Set(
      universities
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
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

  const capitalizedField = capitalizeFirstLetter(field);

  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    credentialCategory: capitalizedField,
    description: `${capitalizedField} alan haalarivärit suomalaisissa oppilaitoksissa`,
    url: `https://haalarikone.fi/ala/${slug}`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${capitalizedField} haalarivärit`,
    description: `Kaikki ${capitalizedField} alan haalarivärit suomalaisissa oppilaitoksissa`,
    numberOfItems: fieldData.length,
    itemListElement: fieldData.slice(0, 50).map((uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: `https://haalarikone.fi/haalari/${uni.id}`,
    })),
  };

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
        name: capitalizedField,
        item: `https://haalarikone.fi/ala/${slug}`,
      },
    ],
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
          <h1 className="text-4xl font-bold mb-4">{capitalizedField}</h1>
          <p className="text-lg text-gray-700 mb-6">
            Tässä ovat kaikki {capitalizedField} alan haalarivärit suomalaisissa
            oppilaitoksissa. Yhteensä {fieldData.length} eri haalaria{" "}
            {universitiesList.length} eri oppilaitoksella.
          </p>
        </div>

        <ul className="space-y-3">
          {fieldData.map((uni) => (
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
