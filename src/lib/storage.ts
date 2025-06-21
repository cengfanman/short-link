import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export interface LinkStorage {
  save(slug: string, originalUrl: string): Promise<void>;
  get(slug: string): Promise<string | null>;
  exists(slug: string): Promise<boolean>;
}

/**
 * Vercel KV storage implementation for production
 * Uses Vercel's managed Redis service for secure, persistent storage
 */
class VercelKVStorage implements LinkStorage {
  async save(slug: string, originalUrl: string): Promise<void> {
    const key = `shortlink:${slug}`;
    await kv.set(key, originalUrl);
    // Set expiration to 1 year (optional)
    await kv.expire(key, 365 * 24 * 60 * 60);
  }

  async get(slug: string): Promise<string | null> {
    const key = `shortlink:${slug}`;
    const result = await kv.get<string>(key);
    return result;
  }

  async exists(slug: string): Promise<boolean> {
    const key = `shortlink:${slug}`;
    const result = await kv.exists(key);
    return result === 1;
  }
}

/**
 * File-based storage implementation for development
 * Data persists between server restarts
 */
class FileStorage implements LinkStorage {
  private filePath: string;
  private cache = new Map<string, string>();
  private loaded = false;

  constructor() {
    // Store in project root/data directory
    this.filePath = path.join(process.cwd(), 'data', 'links.json');
  }

  private async ensureDataDir(): Promise<void> {
    const dataDir = path.dirname(this.filePath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private async loadData(): Promise<void> {
    if (this.loaded) return;

    try {
      await this.ensureDataDir();
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.cache = new Map(Object.entries(parsed));
    } catch (error) {
      // File doesn't exist or is invalid, start with empty cache
      this.cache = new Map();
    }
    this.loaded = true;
  }

  private async saveData(): Promise<void> {
    await this.ensureDataDir();
    const data = Object.fromEntries(this.cache);
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async save(slug: string, originalUrl: string): Promise<void> {
    await this.loadData();
    this.cache.set(slug, originalUrl);
    await this.saveData();
  }

  async get(slug: string): Promise<string | null> {
    await this.loadData();
    return this.cache.get(slug) || null;
  }

  async exists(slug: string): Promise<boolean> {
    await this.loadData();
    return this.cache.has(slug);
  }
}

/**
 * In-memory storage implementation
 * Used as fallback when KV is not available
 */
class InMemoryStorage implements LinkStorage {
  private storage = new Map<string, string>();

  async save(slug: string, originalUrl: string): Promise<void> {
    this.storage.set(slug, originalUrl);
  }

  async get(slug: string): Promise<string | null> {
    return this.storage.get(slug) || null;
  }

  async exists(slug: string): Promise<boolean> {
    return this.storage.has(slug);
  }
}

// Create storage based on environment
function createStorage(): LinkStorage {
  // Check if we're in production/Vercel environment
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      // Vercel KV automatically uses environment variables for authentication
      console.log('Using Vercel KV storage for production environment');
      return new VercelKVStorage();
    } catch (error) {
      console.error('Failed to initialize Vercel KV, falling back to in-memory storage:', error);
      return new InMemoryStorage();
    }
  }
  
  // Use file storage in development
  console.log('Using file-based storage for development');
  return new FileStorage();
}

export const linkStorage: LinkStorage = createStorage(); 