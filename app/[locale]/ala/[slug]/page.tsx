import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { loadUniversities } from "@/lib/load-universities";
import { getUniversitiesByField } from "@/lib/get-universities-by-criteria";
import { getSlugForEntity, getEntityFromSlug, getEntityTranslation } from "@/lib/slug-translations";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Script from "next/script";
import UniversityCard from "@/components/university-card";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
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

  const params = [];
  for (const locale of routing.locales) {
    for (const field of uniqueFields) {
      params.push({
        locale,
        slug: getSlugForEntity(field, locale as 'fi' | 'en' | 'sv', 'field'),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const universities = await loadUniversities();
  const uniqueFields = Array.from(
    new Set(
      universities
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
    )
  );
  const field = getEntityFromSlug(slug, locale as 'fi' | 'en' | 'sv', 'field', uniqueFields);

  if (!field) {
    const t = await getTranslations({ locale, namespace: 'fields' });
    return {
      title: `${t('notFound')} | Haalarikone`,
    };
  }

  const fieldData = getUniversitiesByField(universities, field);
  const universitiesList = Array.from(
    new Set(fieldData.map((u) => u.oppilaitos))
  );

  const t = await getTranslations({ locale });
  const translatedField = getEntityTranslation(field, locale as 'fi' | 'en' | 'sv', 'field');
  const capitalizedField = capitalizeFirstLetter(translatedField);
  const baseUrl = locale === 'fi' ? 'https://haalarikone.fi' : `https://haalarikone.fi/${locale}`;

  return {
    title: `${capitalizedField} - ${t('colors.title')} | Haalarikone`,
    description: t('fields.description', { field: capitalizedField, count: universitiesList.length }),
    keywords: [
      `${capitalizedField} ${t('colors.title').toLowerCase()}`,
      `${capitalizedField} haalarit`,
      `${capitalizedField} opiskelijahaalarit`,
      "haalarivärit",
      "opiskelijahaalarit",
      "suomen opiskelijakulttuuri",
      ...universitiesList.slice(0, 5).map((u) => `${capitalizedField} ${u}`),
    ],
    openGraph: {
      title: `${capitalizedField} - ${t('colors.title')} | Haalarikone`,
      description: t('fields.description', { field: capitalizedField }),
      images: [
        {
          url: "/haalarikone-og.png",
          width: 1200,
          height: 630,
          alt: `${capitalizedField} ${t('colors.title').toLowerCase()}`,
        },
      ],
      type: "website",
      siteName: "Haalarikone",
      locale: locale === 'fi' ? 'fi_FI' : locale === 'en' ? 'en_US' : 'sv_SE',
      url: `${baseUrl}/ala/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedField} - ${t('colors.title')} | Haalarikone`,
      description: t('fields.description', { field: capitalizedField }),
      images: ["/haalarikone-og.png"],
    },
    alternates: {
      canonical: `${baseUrl}/ala/${slug}`,
      languages: {
        fi: `https://haalarikone.fi/ala/${getSlugForEntity(field, 'fi', 'field')}`,
        en: `https://haalarikone.fi/en/ala/${getSlugForEntity(field, 'en', 'field')}`,
        sv: `https://haalarikone.fi/sv/ala/${getSlugForEntity(field, 'sv', 'field')}`,
      },
    },
  };
}

export default async function FieldPage({ params }: Props) {
  const { locale, slug } = await params;
  const universities = await loadUniversities();
  const uniqueFields = Array.from(
    new Set(
      universities
        .flatMap((u) => (u.ala ? u.ala.split(", ") : []))
        .filter(Boolean)
    )
  );
  const field = getEntityFromSlug(slug, locale as 'fi' | 'en' | 'sv', 'field', uniqueFields);
  const t = await getTranslations({ locale });

  if (!field) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('fields.notFound')}</h1>
        <Link href="/" className="text-green hover:underline">
          {t('common.backToHome')}
        </Link>
      </div>
    );
  }

  const fieldData = getUniversitiesByField(universities, field);
  const universitiesList = Array.from(
    new Set(fieldData.map((u) => u.oppilaitos))
  );
  const colors = Array.from(new Set(fieldData.map((u) => u.vari)));

  const translatedField = getEntityTranslation(field, locale as 'fi' | 'en' | 'sv', 'field');
  const capitalizedField = capitalizeFirstLetter(translatedField);
  const baseUrl = locale === 'fi' ? 'https://haalarikone.fi' : `https://haalarikone.fi/${locale}`;

  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    credentialCategory: capitalizedField,
    description: t('fields.description', { field: capitalizedField }),
    url: `${baseUrl}/ala/${slug}`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${capitalizedField} ${t('colors.title').toLowerCase()}`,
    description: t('fields.description', { field: capitalizedField }),
    numberOfItems: fieldData.length,
    itemListElement: fieldData.slice(0, 50).map((uni, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: `${baseUrl}/haalari/${uni.id}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t('footer.home'),
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: capitalizedField,
        item: `${baseUrl}/ala/${slug}`,
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
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{t('footer.home')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/ala">{t('fields.title')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{capitalizedField}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold mb-4">{capitalizedField}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {t('fields.description')} {t('fields.overallCount', { count: fieldData.length })} {t('fields.schoolCount', { count: universitiesList.length })}.
          </p>
        </div>

        <ul className="space-y-3">
          {fieldData.map((uni) => (
            <UniversityCard key={uni.id} uni={uni} />
          ))}
        </ul>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">{t('fields.relatedTopics')}</h2>
          <div className="flex flex-wrap gap-2">
            {universitiesList.slice(0, 10).map((uni) => (
              <Link
                key={uni}
                href={`/oppilaitos/${getSlugForEntity(uni, locale as 'fi' | 'en' | 'sv', 'university')}`}
                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition"
              >
                {uni}
              </Link>
            ))}
            {colors.slice(0, 5).map((color) => (
              <Link
                key={color}
                href={`/vari/${getSlugForEntity(color, locale as 'fi' | 'en' | 'sv', 'color')}`}
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

