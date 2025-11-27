import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { loadUniversities } from "@/lib/load-universities";
import { getUniversitiesByUniversity } from "@/lib/get-universities-by-criteria";
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

export const dynamicParams = false;

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
  const university = uniqueUniversities.find((u) => generateSlug(u) === slug);

  if (!university) {
    return {
      title: "Oppilaitos ei löytynyt | Haalarikone",
    };
  }

  const universityData = getUniversitiesByUniversity(universities, university);
  const fields = Array.from(
    new Set(
      universityData
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
    )
  );

  const capitalizedUniversity = capitalizeFirstLetter(university);

  return {
    title: `${capitalizedUniversity} - Haalarivärit | Haalarikone`,
    description: `Selvitä kaikki ${capitalizedUniversity} haalarivärit. Tietokanta sisältää ${universityData.length} eri haalaria eri aloille ja ainejärjestöille.`,
    keywords: [
      `${capitalizedUniversity} haalarivärit`,
      `${capitalizedUniversity} haalarit`,
      `${capitalizedUniversity} opiskelijahaalarit`,
      "haalarivärit",
      "opiskelijahaalarit",
      "suomen opiskelijakulttuuri",
      ...fields.slice(0, 5).map((f) => `${capitalizedUniversity} ${f}`),
    ],
    openGraph: {
      title: `${capitalizedUniversity} - Haalarivärit | Haalarikone`,
      description: `Selvitä kaikki ${capitalizedUniversity} haalarivärit. ${
        fields.length > 0 ? `Alat: ${fields.slice(0, 5).join(", ")}` : ""
      }`,
      images: [
        {
          url: "/haalarikone-og.png",
          width: 1200,
          height: 630,
          alt: `${capitalizedUniversity} haalarivärit`,
        },
      ],
      type: "website",
      siteName: "Haalarikone",
      locale: "fi_FI",
      url: `https://haalarikone.fi/oppilaitos/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedUniversity} - Haalarivärit | Haalarikone`,
      description: `Selvitä kaikki ${capitalizedUniversity} haalarivärit`,
      images: ["/haalarikone-og.png"],
    },
    alternates: {
      canonical: `https://haalarikone.fi/oppilaitos/${slug}`,
      languages: {
        fi: `https://haalarikone.fi/oppilaitos/${slug}`,
      },
    },
  };
}

export default async function UniversityPage({ params }: Props) {
  const { slug } = await params;
  const universities = await loadUniversities();
  const uniqueUniversities = Array.from(
    new Set(universities.map((u) => u.oppilaitos))
  );
  const university = uniqueUniversities.find((u) => generateSlug(u) === slug);

  if (!university) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Oppilaitos ei löytynyt</h1>
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
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
    )
  );
  const colors = Array.from(new Set(universityData.map((u) => u.vari)));

  const capitalizedUniversity = capitalizeFirstLetter(university);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: capitalizedUniversity,
    description: `${capitalizedUniversity} haalarivärit ja opiskelijakulttuuri`,
    url: `https://haalarikone.fi/oppilaitos/${slug}`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${capitalizedUniversity} haalarivärit`,
    description: `Kaikki ${capitalizedUniversity} haalarivärit opiskelijakulttuurissa`,
    numberOfItems: universityData.length,
    itemListElement: universityData.slice(0, 50).map((uni, index) => ({
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
        name: capitalizedUniversity,
        item: `https://haalarikone.fi/oppilaitos/${slug}`,
      },
    ],
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Etusivu</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/oppilaitos">Oppilaitokset</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{capitalizedUniversity}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{capitalizedUniversity}</h1>
          <p className="text-lg text-gray-700 mb-6">
            Tässä ovat kaikki {capitalizedUniversity} haalarivärit
            opiskelijakulttuurissa. Yhteensä {universityData.length} eri
            haalaria.
          </p>
        </div>

        <ul className="space-y-3">
          {universityData.map((uni) => (
            <UniversityCard key={uni.id} uni={uni} />
          ))}
        </ul>

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

