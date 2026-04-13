import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export interface BlogParseResult {
  title: string;
  text: string;
  byline: string | null;
  siteName: string | null;
  excerpt: string | null;
}

const MAX_TEXT_CHARS = 15_000;

export async function parseBlogUrl(url: string): Promise<BlogParseResult> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; ContentForge/1.0; +https://contentforge.app)',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) {
    throw new Error('URL does not return HTML content');
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent) {
    throw new Error('Could not extract readable content from this URL');
  }

  const text = article.textContent
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TEXT_CHARS);

  return {
    title: article.title ?? '',
    text,
    byline: article.byline ?? null,
    siteName: article.siteName ?? null,
    excerpt: article.excerpt ?? null,
  };
}
