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
import { getUniqueFields } from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";
import { SearchWithDivider } from "@/components/search-with-divider";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Opiskelualat | Kaikki alat ja haalarivärit | Haalarikone",
  description:
    "Kaikki opiskelualat Suomessa. Valitse ala nähdäksesi siihen liittyvät haalarivärit eri yliopistoissa ja AMK:issa.",
  keywords: [
    "opiskelualat",
    "opiskelu alat",
    "haalarivärit aloittain",
    "tekniikka haalari",
    "kauppatieteet haalari",
    "lääketiede haalari",
    "insinööri haalariväri",
  ],
  openGraph: {
    title: "Opiskelualat | Kaikki alat ja haalarivärit",
    description:
      "Kaikki opiskelualat Suomessa. Valitse ala nähdäksesi siihen liittyvät haalarivärit.",
    images: [
      {
        url: "/haalarikone-og.png",
        width: 1200,
        height: 630,
        alt: "Opiskelualat Suomessa",
      },
    ],
    type: "website",
    siteName: "Haalarikone",
    locale: "fi_FI",
    url: "https://haalarikone.fi/ala",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opiskelualat | Kaikki alat ja haalarivärit",
    description: "Kaikki opiskelualat Suomessa ja niiden haalarivärit.",
    images: ["/haalarikone-og.png"],
  },
  alternates: {
    canonical: "https://haalarikone.fi/ala",
    languages: {
      fi: "https://haalarikone.fi/ala",
    },
  },
};

export default async function FieldIndexPage() {
  const universities = await loadUniversities();
  const fields = getUniqueFields(universities).sort((a, b) =>
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
        name: "Alat",
        item: "https://haalarikone.fi/ala",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Opiskelualat Suomessa",
    description: `Lista ${fields.length} opiskelualasta ja niiden haalariväreistä`,
    numberOfItems: fields.length,
    itemListElement: fields.map((field, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: field,
      url: `https://haalarikone.fi/ala/${generateSlug(field)}`,
    })),
  };

  return (
    <>
      <Script
        id="breadcrumb-schema-ala"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="itemlist-schema-ala"
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
              <BreadcrumbPage>Alat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-4">Opiskelualat</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Valitse ala nähdäksesi siihen liittyvät haalarit eri oppilaitoksissa.
        </p>

        <SearchWithDivider dividerText="TAI VALITSE ALA" />

        <div className="grid gap-2 sm:grid-cols-2">
          {fields.map((field) => (
            <Link
              key={field}
              href={`/ala/${generateSlug(field)}`}
              className="rounded-lg border px-4 py-3 font-medium text-green hover:bg-green/5"
            >
              {field}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
