import { Metadata } from 'next';
import Link from 'next/link';
import { loadBlogPosts } from '@/lib/load-blog-posts';

export const metadata: Metadata = {
    title: 'Blogi | Haalarikone',
    description:
        'Lue artikkeleita opiskelijakulttuurista, haalariväreistä ja suomalaisesta opiskelijaelämästä.',
    openGraph: {
        title: 'Blogi | Haalarikone',
        description:
            'Lue artikkeleita opiskelijakulttuurista, haalariväreistä ja suomalaisesta opiskelijaelämästä.',
        images: ['/haalarikone-og.png'],
    },
    alternates: {
        canonical: 'https://haalarikone.fi/blog',
    },
};

export default async function BlogPage() {
    const posts = await loadBlogPosts();

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12">
                <Link
                    href="/"
                    className="text-green hover:underline mb-4 inline-block"
                >
                    ← Takaisin etusivulle
                </Link>
                <h1 className="text-4xl font-bold mb-4">Blogi</h1>
                <p className="text-lg text-gray-700">
                    Tutustu Suomen opiskelijakulttuuriin, haalariväreihin ja
                    opiskelijaelämään näiden artikkeleiden kautta.
                </p>
            </div>

            <div className="grid gap-8">
                {posts.length === 0 ? (
                    <p className="text-gray-600">Blogikirjoituksia ei löytynyt.</p>
                ) : (
                    posts.map((post) => (
                        <article
                            key={post.slug}
                            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <h2 className="text-2xl font-bold mb-2 hover:text-green transition">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-gray-700 mb-4">{post.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
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
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-block mt-4 text-green hover:underline font-medium"
                            >
                                Lue lisää →
                            </Link>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

