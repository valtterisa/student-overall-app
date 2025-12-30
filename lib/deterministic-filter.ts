import type { University } from '@/types/university';
import { loadUniversities } from './load-universities';
import type { QueryUnderstanding } from './query-understanding';
import { normalizeColorKey } from './color-normalizer';
import { colorData } from '@/data/mockData';

let universitiesCache: Map<string, University[]> = new Map();

export async function filterUniversities(
    qu: QueryUnderstanding,
    locale: 'fi' | 'en' | 'sv' = 'fi'
): Promise<University[]> {
    if (qu.isGibberish) {
        return [];
    }

    const cacheKey = locale;
    let allUniversities: University[];

    if (universitiesCache.has(cacheKey)) {
        allUniversities = universitiesCache.get(cacheKey)!;
    } else {
        allUniversities = await loadUniversities(locale);
        universitiesCache.set(cacheKey, allUniversities);
    }

    return allUniversities.filter((uni) => {
        if (qu.filters.color) {
            const colorKey = normalizeColorKey(qu.filters.color);
            if (!colorKey) return false;

            if (!(colorKey in colorData.colors)) return false;
            const colorInfo = colorData.colors[colorKey as keyof typeof colorData.colors];
            if (!colorInfo) return false;

            const allColorVariants = [...colorInfo.main, ...colorInfo.shades];
            const matches = allColorVariants.some(c =>
                uni.vari.toLowerCase().includes(c.toLowerCase())
            );
            if (!matches) return false;
        }

        if (qu.filters.area) {
            const areaLower = qu.filters.area.toLowerCase();
            if (!uni.alue.toLowerCase().includes(areaLower)) {
                return false;
            }
        }

        if (qu.filters.field) {
            const fieldLower = qu.filters.field.toLowerCase();
            if (!uni.ala?.toLowerCase().includes(fieldLower)) {
                return false;
            }
        }

        if (qu.filters.school) {
            const schoolLower = qu.filters.school.toLowerCase();
            if (!uni.oppilaitos.toLowerCase().includes(schoolLower)) {
                return false;
            }
        }

        return true;
    });
}
