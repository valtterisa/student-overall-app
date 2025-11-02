import Fuse from 'fuse.js';
import type { University } from '@/types/university';

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

