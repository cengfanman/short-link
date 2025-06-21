import { linkStorage } from './storage';
import { generateSlug, isValidUrl, normalizeUrl, buildShortUrl } from './utils';

export interface CreateShortLinkRequest {
  url: string;
}

export interface CreateShortLinkResponse {
  shortUrl: string;
  slug: string;
  originalUrl: string;
}

export class ShortLinkService {
  /**
   * Create a new short link
   */
  async createShortLink(request: CreateShortLinkRequest): Promise<CreateShortLinkResponse> {
    const { url } = request;

    // Validate input
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(url.trim());
    if (!isValidUrl(normalizedUrl)) {
      throw new Error('Invalid URL provided');
    }

    // Generate unique slug
    let slug: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      slug = generateSlug();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique slug after multiple attempts');
      }
    } while (await linkStorage.exists(slug));

    // Save the mapping
    await linkStorage.save(slug, normalizedUrl);

    // Build and return the short URL
    const shortUrl = buildShortUrl(slug);

    return {
      shortUrl,
      slug,
      originalUrl: normalizedUrl,
    };
  }

  /**
   * Get the original URL for a given slug
   */
  async getOriginalUrl(slug: string): Promise<string | null> {
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    return await linkStorage.get(slug.trim());
  }

  /**
   * Check if a slug exists
   */
  async slugExists(slug: string): Promise<boolean> {
    if (!slug || typeof slug !== 'string') {
      return false;
    }

    return await linkStorage.exists(slug.trim());
  }
}

// Singleton instance
export const shortLinkService = new ShortLinkService(); 