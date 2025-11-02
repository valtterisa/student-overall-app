import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/protected/', '/auth/'],
        },
        sitemap: 'https://haalarikone.fi/sitemap.xml',
    };
}

