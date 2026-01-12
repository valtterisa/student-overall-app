"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseStyles } from "@/lib/utils";
import { getSlugForEntity } from "@/lib/slug-translations";
import { getFinnishName } from "@/lib/get-finnish-name";
import type { University } from "@/types/university";
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useTranslatedRoutes } from '@/lib/use-translated-routes';

interface UniversityCardProps {
  uni: University;
}

export default function UniversityCard({ uni }: UniversityCardProps) {
  const router = useRouter();
  const locale = useLocale() as 'fi' | 'en' | 'sv';
  const t = useTranslations('overall');
  const routes = useTranslatedRoutes();

  // Get Finnish name for logo path (logos are named based on Finnish names)
  const oppilaitosFi = getFinnishName(uni.oppilaitos, locale, 'university');
  const logoName = oppilaitosFi.startsWith("Aalto-yliopisto") ? "Aalto-yliopisto" : oppilaitosFi;

  return (
    <li
      className="group bg-white rounded-lg border border-border hover:border-green/30 hover:shadow-sm transition-all p-4 cursor-pointer relative"
      onClick={() => router.push(routes.overall(String(uni.id)))}
    >
      <div className="absolute top-3 right-3 text-green/40 group-hover:text-green/60 transition-colors">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3 flex-shrink-0">
          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border/50 bg-white dark:bg-card p-1.5">
            <Image
              className="object-contain"
              src={`/logos/${logoName}.jpg`}
              fill
              alt={`${uni.oppilaitos} logo`}
            />
          </div>
          <div
            className="w-12 h-12 rounded-md border border-border/50 shadow-sm"
            style={parseStyles(uni.hex)}
            title={`${t('color')}: ${uni.vari}`}
          />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-foreground mb-2.5 break-words leading-tight">
            {uni.ainejärjestö ?? t('unknownOrganization')}
          </h3>

          <div
            className="flex flex-wrap gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={routes.colors(getSlugForEntity(uni.vari, locale, 'color'))}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {uni.vari}
            </Link>
            <Link
              href={routes.universities(getSlugForEntity(uni.oppilaitos, locale, 'university'))}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {uni.oppilaitos}
            </Link>
            {uni.ala && (
              <Link
                href={routes.fields(getSlugForEntity(uni.ala.split(",")[0].trim(), locale, 'field'))}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {uni.ala.split(",")[0].trim()}
              </Link>
            )}
            {uni.alue && (
              <Link
                href={routes.areas(getSlugForEntity(uni.alue.split(",")[0].trim(), locale, 'area'))}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {uni.alue.split(",")[0].trim()}
              </Link>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
