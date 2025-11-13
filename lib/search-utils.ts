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
  result: UpstashSearchResult
): UniversityWithScore {
  const content = result.content;
  const metadata = result.metadata;

  return {
    id: parseInt(result.id, 10),
    vari: (content.vari as string) || "",
    hex: (metadata.hex as string) || "",
    alue: (content.alue as string) || "",
    ala: (content.ala as string) || null,
    ainejärjestö: (content.ainejärjestö as string) || null,
    oppilaitos: (content.oppilaitos as string) || "",
    score: result.score || 0,
  };
}

export async function searchUniversitiesAPI(
  query: string
): Promise<UniversityWithScore[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error("Search API error:", res.statusText);
      return [];
    }

    const data = await res.json();
    const results = data.results || [];

    const converted = results.map(convertUpstashResultToUniversity);

    return converted;
  } catch (error) {
    console.error("Error searching universities:", error);
    return [];
  }
}
