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
import { getUniqueColors } from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Haalarivärit | Kaikki opiskelijahaalarivärit Suomessa | Haalarikone",
  description:
    "Täydellinen lista kaikista Suomen opiskelijahaalariväreistä. Yli 100 eri haalariväriä yliopistoista ja AMK:ista. Löydä haluamasi haalariväri ja katso mitkä oppilaitokset käyttävät sitä.",
  keywords: [
    "haalarivärit",
    "opiskelijahaalarivärit",
    "haalarivärit 2025",
    "kaikki haalarivärit",
    "opiskelijan haalariväri",
    "yliopiston haalarivärit",
    "AMK haalarivärit",
    "teekkarihaalari värit",
  ],
  openGraph: {
    title: "Haalarivärit | Kaikki opiskelijahaalarivärit Suomessa",
    description:
      "Täydellinen lista kaikista Suomen opiskelijahaalariväreistä. Yli 100 eri haalariväriä yliopistoista ja AMK:ista.",
    images: [
      {
        url: "/haalarikone-og.png",
        width: 1200,
        height: 630,
        alt: "Haalarivärit Suomessa",
      },
    ],
    type: "website",
    siteName: "Haalarikone",
    locale: "fi_FI",
    url: "https://haalarikone.fi/vari",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haalarivärit | Kaikki opiskelijahaalarivärit",
    description: "Täydellinen lista kaikista Suomen opiskelijahaalariväreistä.",
    images: ["/haalarikone-og.png"],
  },
  alternates: {
    canonical: "https://haalarikone.fi/vari",
    languages: {
      fi: "https://haalarikone.fi/vari",
    },
  },
};

export default async function ColorIndexPage() {
  const universities = await loadUniversities();
  const colors = getUniqueColors(universities).sort((a, b) =>
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
        name: "Haalarivärit",
        item: "https://haalarikone.fi/vari",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kaikki haalarivärit Suomessa",
    description: `Täydellinen lista ${colors.length} eri haalariväristä suomalaisissa yliopistoissa ja AMK:issa`,
    numberOfItems: colors.length,
    itemListElement: colors.map((color, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: color,
      url: `https://haalarikone.fi/vari/${generateSlug(color)}`,
    })),
  };

  return (
    <>
      <Script
        id="breadcrumb-schema-vari"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="itemlist-schema-vari"
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
              <BreadcrumbPage>Haalarivärit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-4xl font-bold mb-4">Haalarivärit</h1>
        <p className="text-lg text-gray-700 mb-8">
          Valitse haalariväri nähdäksesi kaikki siihen liittyvät haalarit ja
          oppilaitokset.
        </p>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {colors.map((color) => (
            <Link
              key={color}
              href={`/vari/${generateSlug(color)}`}
              className="rounded-lg border px-4 py-3 font-medium text-green hover:bg-green/5 transition"
            >
              {color}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
