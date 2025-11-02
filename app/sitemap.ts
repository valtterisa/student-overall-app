import { MetadataRoute } from 'next';
import { loadUniversities } from '@/lib/load-universities';
import {
    getUniqueUniversities,
    getUniqueFields,
    getUniqueColors,
    getUniqueAreas,
} from '@/lib/get-unique-values';
import { generateSlug } from '@/lib/generate-slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://haalarikone.fi';
    const universities = await loadUniversities();

    const entries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    const uniqueUniversities = getUniqueUniversities(universities);
    uniqueUniversities.forEach((uni) => {
        entries.push({
            url: `${baseUrl}/yliopisto/${generateSlug(uni)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    const uniqueFields = getUniqueFields(universities);
    uniqueFields.forEach((field) => {
        entries.push({
            url: `${baseUrl}/ala/${generateSlug(field)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    const uniqueColors = getUniqueColors(universities);
    uniqueColors.forEach((color) => {
        entries.push({
            url: `${baseUrl}/vari/${generateSlug(color)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    const uniqueAreas = getUniqueAreas(universities);
    uniqueAreas.forEach((area) => {
        entries.push({
            url: `${baseUrl}/alue/${generateSlug(area)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

    universities.forEach((uni) => {
        entries.push({
            url: `${baseUrl}/haalari/${uni.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        });
    });

    const blogPosts = [
        'kaikki-suomen-yliopistojen-haalarivarit-2024',
        'miten-haalarivarit-valitaan-opiskelijakulttuurin-perusteet',
        'opiskelijakulttuurin-historia-suomessa',
        'amk-vs-yliopisto-haalarivarit-eroilla',
        'haalarit-saannot-4-saantoa',
    ];

    blogPosts.forEach((slug) => {
        entries.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

    return entries;
}

