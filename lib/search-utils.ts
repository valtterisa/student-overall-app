import type { University } from "@/types/university";

export type UpstashSearchResult = {
  id: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  score: number;
};

export type UniversityWithScore = University & {
  score: number;
};

export function convertUpstashResultToUniversity(
  result: UpstashSearchResult,
  locale: 'fi' | 'en' | 'sv' = 'fi'
): UniversityWithScore {
  const content = result.content;
  const metadata = result.metadata;

  const getLocalizedValue = (field: unknown): string => {
    if (field === null || field === undefined) {
      return '';
    }
    if (typeof field === 'object' && !Array.isArray(field)) {
      const nested = field as Record<string, string>;
      return nested[locale] || nested.fi || '';
    }
    if (typeof field === 'string') {
      return field;
    }
    return '';
  };

  return {
    id: parseInt(result.id, 10),
    vari: getLocalizedValue(content.vari),
    hex: (metadata.hex as string) || "",
    alue: getLocalizedValue(content.alue),
    ala: getLocalizedValue(content.ala) || null,
    ainejärjestö: (content.ainejärjestö as string) || null,
    oppilaitos: getLocalizedValue(content.oppilaitos),
    score: result.score || 0,
  };
}

export async function searchUniversitiesAPI(
  query: string,
  locale: 'fi' | 'en' | 'sv' = 'fi'
): Promise<UniversityWithScore[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, locale }),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const results = data.results || [];

    const converted = results.map((result: UpstashSearchResult) =>
      convertUpstashResultToUniversity(result, locale)
    );

    return converted;
  } catch (error) {
    return [];
  }
}
