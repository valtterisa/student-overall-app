import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { loadUniversities } from "@/lib/load-universities";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Script from "next/script";
import { parseStyles } from "@/lib/utils";
import { getSlugForEntity } from "@/lib/slug-translations";
import Image from "next/image";
import { FeedbackModal } from "@/components/feedback-modal";
import { getTranslations } from 'next-intl/server';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateStaticParams() {
  const universities = await loadUniversities('fi');
  const params = [];
  for (const uni of universities) {
    for (const locale of ['fi', 'en', 'sv'] as const) {
      params.push({
        locale,
        id: uni.id.toString(),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const universities = await loadUniversities(locale as 'fi' | 'en' | 'sv');
  const overall = universities.find((u) => u.id.toString() === id);

  if (!overall) {
    const t = await getTranslations({ locale, namespace: 'overall' });
    return {
      title: `${t('notFound')} | Haalarikone`,
    };
  }

  const t = await getTranslations({ locale });
  const baseUrl = locale === 'fi' ? 'https://haalarikone.fi' : `https://haalarikone.fi/${locale}`;

  const keywords = [
    `${overall.vari} haalari`,
    `${overall.oppilaitos} ${t('colors.title').toLowerCase()}`,
    "haalarivärit",
    "opiskelijahaalarit",
    "suomen opiskelijakulttuuri",
  ];

  if (overall.ala) {
    overall.ala.split(", ").forEach((field) => {
      keywords.push(`${field} ${t('colors.title').toLowerCase()}`, `${overall.oppilaitos} ${field}`);
    });
  }

  if (overall.ainejärjestö) {
    keywords.push(`${overall.ainejärjestö} haalari`);
  }

  return {
    title: `${overall.vari} - ${overall.oppilaitos} | Haalarikone`,
    description: `${overall.vari} haalari ${overall.oppilaitos} ${
      overall.ala ? `- ${overall.ala}` : ""
    } ${overall.ainejärjestö ? `(${overall.ainejärjestö})` : ""}`,
    keywords,
    openGraph: {
      title: `${overall.vari} - ${overall.oppilaitos}`,
      description: `${overall.vari} haalari ${overall.oppilaitos} ${
        overall.ala ? `- ${overall.ala}` : ""
      }`,
      images: [
        {
          url: "/haalarikone-og.png",
          width: 1200,
          height: 630,
          alt: `${overall.vari} haalari - ${overall.oppilaitos}`,
        },
      ],
      type: "website",
      siteName: "Haalarikone",
      locale: locale === 'fi' ? 'fi_FI' : locale === 'en' ? 'en_US' : 'sv_SE',
      url: `${baseUrl}/haalari/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${overall.vari} - ${overall.oppilaitos} | Haalarikone`,
      description: `${overall.vari} haalari ${overall.oppilaitos}`,
      images: ["/haalarikone-og.png"],
    },
    alternates: {
      canonical: `${baseUrl}/haalari/${id}`,
      languages: {
        fi: `https://haalarikone.fi/haalari/${id}`,
        en: `https://haalarikone.fi/en/haalari/${id}`,
        sv: `https://haalarikone.fi/sv/haalari/${id}`,
      },
    },
  };
}

export default async function OverallPage({ params }: Props) {
  const { locale, id } = await params;
  const universities = await loadUniversities(locale as 'fi' | 'en' | 'sv');
  const overall = universities.find((u) => u.id.toString() === id);
  const t = await getTranslations({ locale });

  if (!overall) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('overall.notFound')}</h1>
        <Link href="/" className="text-green hover:underline">
          {t('common.backToHome')}
        </Link>
      </div>
    );
  }

  const relatedOveralls = universities
    .filter((u) => u.oppilaitos === overall.oppilaitos && u.id !== overall.id)
    .slice(0, 5);

  const baseUrl = locale === 'fi' ? 'https://haalarikone.fi' : `https://haalarikone.fi/${locale}`;

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
        name: overall.oppilaitos,
        item: `${baseUrl}/oppilaitos/${getSlugForEntity(overall.oppilaitos, locale as 'fi' | 'en' | 'sv', 'university')}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${overall.vari} haalari`,
        item: `${baseUrl}/haalari/${id}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`breadcrumb-schema-${id}`}
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
                <Link href="/">{t('footer.home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/oppilaitos">{t('universities.title')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/oppilaitos/${getSlugForEntity(overall.oppilaitos, locale as 'fi' | 'en' | 'sv', 'university')}`}>
                  {overall.oppilaitos}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{overall.vari} haalari</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-row md:flex-col items-center gap-4">
              <div
                className="w-32 h-32 rounded-lg border-4 shadow-lg flex-shrink-0"
                style={parseStyles(overall.hex)}
                title={`${t('overall.color')}: ${overall.vari}`}
              />
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <Image
                  className="object-contain"
                  src={`/logos/${
                    overall.oppilaitos.startsWith("Aalto-yliopisto")
                      ? "Aalto-yliopisto"
                      : overall.oppilaitos
                  }.jpg`}
                  fill
                  alt={`${overall.oppilaitos} logo`}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold mb-2">{t('overall.institution')}</h2>
                  <Link
                    href={`/oppilaitos/${getSlugForEntity(overall.oppilaitos, locale as 'fi' | 'en' | 'sv', 'university')}`}
                    className="text-green hover:underline text-lg"
                  >
                    {overall.oppilaitos}
                  </Link>
                </div>

                {overall.ainejärjestö && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">{t('overall.organization')}</h2>
                    <p className="text-lg">{overall.ainejärjestö}</p>
                  </div>
                )}

                {overall.ala && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">{t('overall.field')}</h2>
                    <div className="flex flex-wrap gap-2">
                      {overall.ala.split(", ").map((field) => (
                        <Link
                          key={field}
                          href={`/ala/${getSlugForEntity(field.trim(), locale as 'fi' | 'en' | 'sv', 'field')}`}
                          className="px-3 py-1 bg-green/10 text-green rounded-full text-sm font-medium hover:bg-green/20 transition"
                        >
                          {field.trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {overall.alue && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">{t('overall.area')}</h2>
                    <div className="flex flex-wrap gap-2">
                      {overall.alue.split(", ").map((area) => (
                        <Link
                          key={area}
                          href={`/alue/${getSlugForEntity(area.trim(), locale as 'fi' | 'en' | 'sv', 'area')}`}
                          className="px-3 py-1 bg-green/10 text-green rounded-full text-sm font-medium hover:bg-green/20 transition"
                        >
                          {area.trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold mb-2">{t('overall.color')}</h2>
                  <Link
                    href={`/vari/${getSlugForEntity(overall.vari, locale as 'fi' | 'en' | 'sv', 'color')}`}
                    className="px-3 py-1 bg-green/10 text-green rounded-full text-sm font-medium hover:bg-green/20 transition inline-block"
                  >
                    {overall.vari}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedOveralls.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {t('overall.otherOveralls')} {overall.oppilaitos}
            </h2>
            <div className="grid gap-4">
              {relatedOveralls.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/haalari/${rel.id}`}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition flex items-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded border-2 flex-shrink-0"
                    style={parseStyles(rel.hex)}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{rel.vari}</h3>
                    {rel.ala && (
                      <p className="text-gray-600 text-sm">{rel.ala}</p>
                    )}
                    {rel.ainejärjestö && (
                      <p className="text-gray-600 text-sm">
                        {rel.ainejärjestö}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-semibold">{t('overall.errorTitle')}</h3>
              <p className="text-muted-foreground mt-1">
                {t('overall.errorDescription')}
              </p>
            </div>
            <FeedbackModal
              triggerLabel={t('overall.errorButton')}
              triggerClassName="bg-green text-white hover:bg-green/90"
              triggerSize="lg"
              title={t('overall.errorModalTitle')}
              description={t('overall.errorModalDescription')}
              submitLabel={t('overall.errorSubmit')}
              sourceId={overall.id.toString()}
              sourceName={`${overall.vari} - ${overall.oppilaitos}`}
              messageLabel={t('overall.errorLabel')}
              messagePlaceholder={t('overall.errorPlaceholder')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

