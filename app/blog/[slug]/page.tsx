import { Metadata } from 'next';
import Link from 'next/link';
import { loadBlogPosts, loadBlogPost } from '@/lib/load-blog-posts';
import Script from 'next/script';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const posts = await loadBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await loadBlogPost(slug);

    if (!post) {
        return {
            title: 'Artikkelia ei löytynyt | Haalarikone',
        };
    }

    const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const category = 'Opiskelijakulttuuri';

    return {
        title: `${post.title} | Haalarikone`,
        description: post.description,
        keywords: [
            'haalarivärit',
            'opiskelijahaalarit',
            'suomen opiskelijakulttuuri',
            'haalaritietokanta',
            'opiskelijakulttuuri',
            category.toLowerCase(),
            ...post.title.toLowerCase().split(' ').slice(0, 5),
        ],
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: '/haalarikone-og.png',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: 'article',
            publishedTime: post.publishDate,
            modifiedTime: post.publishDate,
            authors: [post.author],
            siteName: 'Haalarikone',
            locale: 'fi_FI',
            url: `https://haalarikone.fi/blog/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: ['/haalarikone-og.png'],
        },
        alternates: {
            canonical: `https://haalarikone.fi/blog/${slug}`,
            languages: {
                fi: `https://haalarikone.fi/blog/${slug}`,
            },
        },
        other: {
            'article:author': post.author,
            'article:section': category,
            'article:published_time': post.publishDate,
            'article:modified_time': post.publishDate,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await loadBlogPost(slug);

    if (!post) {
        notFound();
    }

    const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const timeRequired = post.readingTime ? `PT${post.readingTime}M` : undefined;

    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: {
            '@type': 'ImageObject',
            url: 'https://haalarikone.fi/haalarikone-og.png',
            width: 1200,
            height: 630,
        },
        author: {
            '@type': 'Person',
            name: post.author,
            url: 'https://haalarikone.fi',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Haalarikone',
            url: 'https://haalarikone.fi',
            logo: {
                '@type': 'ImageObject',
                url: 'https://haalarikone.fi/haalarikone-og.png',
                width: 1200,
                height: 630,
            },
        },
        datePublished: post.publishDate,
        dateModified: post.publishDate,
        url: `https://haalarikone.fi/blog/${slug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://haalarikone.fi/blog/${slug}`,
        },
        articleSection: 'Opiskelijakulttuuri',
        wordCount: wordCount,
        ...(timeRequired && { timeRequired }),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Etusivu',
                item: 'https://haalarikone.fi',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blogi',
                item: 'https://haalarikone.fi/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://haalarikone.fi/blog/${slug}`,
            },
        ],
    };

    return (
        <>
            <Script
                id={`blogposting-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(blogPostingSchema),
                }}
            />
            <Script
                id={`breadcrumb-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <Link
                    href="/blog"
                    className="text-green hover:underline mb-4 inline-block"
                >
                    ← Takaisin blogiin
                </Link>

                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                        <p className="text-xl text-gray-700 mb-6">{post.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b pb-4">
                            <time dateTime={post.publishDate}>
                                {new Date(post.publishDate).toLocaleDateString('fi-FI', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            {post.readingTime && (
                                <span>Lukuaika: {post.readingTime} min</span>
                            )}
                            <span>Kirjoittaja: {post.author}</span>
                        </div>
                    </header>

                    <div
                        className="prose prose-lg prose-green max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                <div className="mt-12 pt-8 border-t">
                    <Link
                        href="/blog"
                        className="text-green hover:underline font-medium"
                    >
                        ← Takaisin kaikkiin artikkeleihin
                    </Link>
                </div>
            </div>
        </>
    );
}

