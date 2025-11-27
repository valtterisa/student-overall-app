"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseStyles } from "@/lib/utils";
import { generateSlug } from "@/lib/generate-slug";
import type { University } from "@/types/university";

interface UniversityCardProps {
  uni: University;
}

export default function UniversityCard({ uni }: UniversityCardProps) {
  const router = useRouter();

  return (
    <li
      className="group bg-white rounded-lg border border-border hover:border-green/30 hover:shadow-sm transition-all p-4 cursor-pointer relative"
      onClick={() => router.push(`/haalari/${uni.id}`)}
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
          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border/50 bg-white p-1.5">
            <Image
              className="object-contain"
              src={`/logos/${uni.oppilaitos.startsWith("Aalto-yliopisto") ? "Aalto-yliopisto" : uni.oppilaitos}.jpg`}
              fill
              alt={`${uni.oppilaitos} logo`}
            />
          </div>
          <div
            className="w-12 h-12 rounded-md border border-border/50 shadow-sm"
            style={parseStyles(uni.hex)}
            title={`Väri: ${uni.vari}`}
          />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-foreground mb-2.5 break-words leading-tight">
            {uni.ainejärjestö ?? "Ainejärjestö ei tiedossa"}
          </h3>

          <div
            className="flex flex-wrap gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/vari/${generateSlug(uni.vari)}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {uni.vari}
            </Link>
            <Link
              href={`/oppilaitos/${generateSlug(uni.oppilaitos)}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {uni.oppilaitos}
            </Link>
            {uni.ala && (
              <Link
                href={`/ala/${generateSlug(uni.ala.split(",")[0].trim())}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green rounded-full text-xs font-medium hover:bg-green/20 hover:text-green/90 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {uni.ala.split(",")[0].trim()}
              </Link>
            )}
            {uni.alue && (
              <Link
                href={`/alue/${generateSlug(uni.alue.split(",")[0].trim())}`}
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
