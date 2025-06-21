import { customAlphabet } from 'nanoid';

/**
 * Generate a URL-safe short slug
 * Using a custom alphabet to avoid confusion between similar characters
 */
export const generateSlug = customAlphabet(
  '0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz',
  7
);

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize URL by adding protocol if missing
 */
export function normalizeUrl(url: string): string {
  // If no protocol is specified, assume https
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Build the full short URL from a slug
 */
export function buildShortUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.VERCEL_URL || 'http://localhost:3000';
  const protocol = base.startsWith('http') ? '' : 'https://';
  return `${protocol}${base}/s/${slug}`;
} 