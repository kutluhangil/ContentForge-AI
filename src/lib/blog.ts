import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export interface BlogParseResult {
  title: string;
  text: string;
  byline: string | null;
  siteName: string | null;
  excerpt: string | null;
}

const MAX_TEXT_CHARS = 15_000;

export async function isSafeUrl(urlStr: string): Promise<boolean> {
  try {
    const url = new URL(urlStr);
    
    // Only allow http: and https: protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname;
    
    // Resolve hostname to IP address
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    let ip = hostname;
    
    if (!ipRegex.test(hostname)) {
      const result = await dnsLookup(hostname);
      ip = result.address;
    }
    
    // Validate IP (prevent private / local IPs)
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) {
      const lowerIp = ip.toLowerCase();
      if (
        lowerIp === '::1' ||
        lowerIp.startsWith('fe80') ||
        lowerIp.startsWith('fc00') ||
        lowerIp.startsWith('fd00')
      ) {
        return false;
      }
      return true;
    }
    
    const [p1, p2] = parts;
    
    // Loopback: 127.0.0.0/8
    if (p1 === 127) return false;
    // Private Network: 10.0.0.0/8
    if (p1 === 10) return false;
    // Private Network: 172.16.0.0/12
    if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
    // Private Network: 192.168.0.0/16
    if (p1 === 192 && p2 === 168) return false;
    // Link-local: 169.254.0.0/16
    if (p1 === 169 && p2 === 254) return false;
    // Broadcast / Local: 0.0.0.0
    if (p1 === 0) return false;
    
    return true;
  } catch {
    return false;
  }
}

export async function parseBlogUrl(url: string): Promise<BlogParseResult> {
  if (!(await isSafeUrl(url))) {
    throw new Error('URL is not allowed. Loopback and private network URLs are blocked.');
  }

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
