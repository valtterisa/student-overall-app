import { promises as fs } from 'fs';
import path from 'path';
import type { BlogPost } from '@/types/blog-post';

export async function loadBlogPosts(): Promise<BlogPost[]> {
    const blogDir = path.join(process.cwd(), 'content', 'blog');

    try {
        const files = await fs.readdir(blogDir);
        const posts: BlogPost[] = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(blogDir, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const post = JSON.parse(fileContent) as BlogPost;
                posts.push(post);
            }
        }

        return posts.sort(
            (a, b) =>
                new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
    } catch {
        return [];
    }
}

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    const filePath = path.join(blogDir, `${slug}.json`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as BlogPost;
    } catch {
        return null;
    }
}

