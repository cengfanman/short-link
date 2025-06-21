import { promises as fs } from 'fs';
import path from 'path';

export interface LinkStorage {
  save(slug: string, originalUrl: string): Promise<void>;
  get(slug: string): Promise<string | null>;
  exists(slug: string): Promise<boolean>;
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
 * In-memory storage implementation (fallback)
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

// Use file storage in development, memory storage as fallback
export const linkStorage: LinkStorage = new FileStorage(); 