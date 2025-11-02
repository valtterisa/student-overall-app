import { Metadata } from 'next';
import Link from 'next/link';
import { loadBlogPosts, loadBlogPost } from '@/lib/load-blog-posts';
import Script from 'next/script';
import { notFound } from 'next/navigation';

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

    return {
        title: `${post.title} | Haalarikone`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: ['/haalarikone-og.png'],
            type: 'article',
            publishedTime: post.publishDate,
            authors: [post.author],
        },
        alternates: {
            canonical: `https://haalarikone.fi/blog/${slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await loadBlogPost(slug);

    if (!post) {
        notFound();
    }

    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        datePublished: post.publishDate,
        dateModified: post.publishDate,
        url: `https://haalarikone.fi/blog/${slug}`,
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

