import { isValidUrl, normalizeUrl, buildShortUrl } from '../utils';

describe('Utils', () => {
  describe('isValidUrl', () => {
    it('should validate correct HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    it('should add https protocol when missing', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
      expect(normalizeUrl('www.example.com')).toBe('https://www.example.com');
    });

    it('should preserve existing protocol', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });
  });

  describe('buildShortUrl', () => {
    it('should build correct short URL with default base', () => {
      const result = buildShortUrl('abc123');
      expect(result).toMatch(/\/s\/abc123$/);
    });

    it('should build correct short URL with custom base', () => {
      const result = buildShortUrl('abc123', 'https://short.ly');
      expect(result).toBe('https://short.ly/s/abc123');
    });

    it('should handle base URL without protocol', () => {
      const result = buildShortUrl('abc123', 'short.ly');
      expect(result).toBe('https://short.ly/s/abc123');
    });
  });
}); 