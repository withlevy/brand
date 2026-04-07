import { XMLParser } from 'fast-xml-parser';

export interface RSSPost {
    title: string;
    link: string;
    slug: string;
    description: string;
    pubDate: Date;
    content: string;
    categories: string[];
}

const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: false,
});

function extractSlug(link: string): string {
    try {
        const url = new URL(link);
        const segments = url.pathname.split('/').filter(Boolean);
        return segments[segments.length - 1] || 'untitled';
    } catch {
        return link.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'untitled';
    }
}

function toArray<T>(value: T | T[] | undefined): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

export async function fetchPosts(url: string, limit = 9): Promise<RSSPost[]> {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
        const xml = await res.text();
        const parsed = parser.parse(xml);

        const items = toArray(parsed?.rss?.channel?.item);

        const posts: RSSPost[] = items.map((item: any) => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            slug: extractSlug(item.link || ''),
            description: item.description || '',
            pubDate: new Date(item.pubDate || 0),
            content: item['content:encoded'] || item.description || '',
            categories: toArray(item.category),
        }));

        posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
        return posts.slice(0, limit);
    } catch (err) {
        console.error('[rss] Failed to fetch posts:', err);
        return [];
    }
}
