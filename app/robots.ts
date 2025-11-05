import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
            {
                userAgent: 'Claude-Web',
                allow: '/',
                disallow: ['/protected/', '/auth/', '/api/'],
            },
        ],
        sitemap: 'https://haalarikone.fi/sitemap.xml',
    };
}

