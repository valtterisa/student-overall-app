import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Script from "next/script";
import { Metadata } from "next";
import { loadUniversities } from "@/lib/load-universities";
import { getUniqueUniversities } from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Oppilaitokset | Yliopistot ja AMK:t Suomessa | Haalarikone",
  description:
    "Kaikki Suomen yliopistot ja ammattikorkeakoulut. Valitse oppilaitos nähdäksesi sen haalarivärit ja ainejärjestötiedot.",
  keywords: [
    "yliopistot",
    "ammattikorkeakoulut",
    "AMK",
    "suomen yliopistot",
    "oppilaitokset",
    "yliopiston haalarivärit",
    "AMK haalarivärit",
  ],
  openGraph: {
    title: "Oppilaitokset | Yliopistot ja AMK:t Suomessa",
    description:
      "Kaikki Suomen yliopistot ja ammattikorkeakoulut. Valitse oppilaitos nähdäksesi sen haalarivärit.",
    images: [
      {
        url: "/haalarikone-og.png",
        width: 1200,
        height: 630,
        alt: "Suomen oppilaitokset",
      },
    ],
    type: "website",
    siteName: "Haalarikone",
    locale: "fi_FI",
    url: "https://haalarikone.fi/oppilaitos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oppilaitokset | Yliopistot ja AMK:t Suomessa",
    description: "Kaikki Suomen yliopistot ja ammattikorkeakoulut.",
    images: ["/haalarikone-og.png"],
  },
  alternates: {
    canonical: "https://haalarikone.fi/oppilaitos",
    languages: {
      fi: "https://haalarikone.fi/oppilaitos",
    },
  },
};

export default async function UniversityIndexPage() {
  const universities = await loadUniversities();
  const unique = getUniqueUniversities(universities).sort((a, b) =>
    a.localeCompare(b, "fi")
  );

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
        name: "Oppilaitokset",
        item: "https://haalarikone.fi/oppilaitos",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Suomen yliopistot ja AMK:t",
    description: `Lista ${unique.length} suomalaisesta yliopistosta ja ammattikorkeakoulusta`,
    numberOfItems: unique.length,
    itemListElement: unique.map((uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: uni,
      url: `https://haalarikone.fi/oppilaitos/${generateSlug(uni)}`,
    })),
  };

  return (
    <>
      <Script
        id="breadcrumb-schema-oppilaitos"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="itemlist-schema-oppilaitos"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
              <BreadcrumbPage>Oppilaitokset</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-4">Oppilaitokset</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Valitse oppilaitos nähdäksesi sen haalarivärit ja ainejärjestötiedot.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {unique.map((uni) => (
            <Link
              key={uni}
              href={`/oppilaitos/${generateSlug(uni)}`}
              className="rounded-lg border px-4 py-3 font-medium text-green hover:bg-green/5"
            >
              {uni}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
