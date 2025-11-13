import Fuse from 'fuse.js';
import type { University } from '@/types/university';

export type UpstashSearchResult = {
  id: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  score: number;
};

export function createFuseInstance(universities: University[]) {
    return new Fuse(universities, {
        keys: [
            { name: 'vari', weight: 0.4 },
            { name: 'oppilaitos', weight: 0.3 },
            { name: 'ala', weight: 0.2 },
            { name: 'alue', weight: 0.05 },
            { name: 'ainejärjestö', weight: 0.05 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false,
    });
}

export function searchUniversities(
    fuse: Fuse<University>,
    query: string,
    limit?: number
): University[] {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const results = fuse.search(query, limit ? { limit } : undefined);
    return results.map((result) => result.item);
}

export function convertUpstashResultToUniversity(
    result: UpstashSearchResult
): University {
    const content = result.content;
    const metadata = result.metadata;

    return {
        id: parseInt(result.id, 10),
        vari: (content.vari as string) || '',
        hex: (metadata.hex as string) || '',
        alue: (content.alue as string) || '',
        ala: (content.ala as string) || null,
        ainejärjestö: (content.ainejärjestö as string) || null,
        oppilaitos: (content.oppilaitos as string) || '',
    };
}

export async function searchUniversitiesAPI(
    query: string
): Promise<University[]> {
    if (!query || query.trim().length < 2) {
        return [];
    }

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!res.ok) {
            console.error('Search API error:', res.statusText);
            return [];
        }

        const data = await res.json();
        const results = data.results || [];

        return results.map(convertUpstashResultToUniversity);
    } catch (error) {
        console.error('Error searching universities:', error);
        return [];
    }
}

