import { promises as fs } from 'fs';
import path from 'path';
import { createClient, RedisClientType } from 'redis';

export interface LinkStorage {
  save(slug: string, originalUrl: string): Promise<void>;
  get(slug: string): Promise<string | null>;
  exists(slug: string): Promise<boolean>;
}

/**
 * Redis storage implementation for production
 * Uses Vercel Redis for secure, persistent storage
 */
class RedisStorage implements LinkStorage {
  private client: RedisClientType;
  private connected = false;

  constructor() {
    // Create Redis client
    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 60000,
      },
    });

    // Handle connection events
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.connected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.connected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.connected = false;
    });
  }

  private async ensureConnected(): Promise<void> {
    if (!this.connected) {
      try {
        await this.client.connect();
        this.connected = true;
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
      }
    }
  }

  async save(slug: string, originalUrl: string): Promise<void> {
    await this.ensureConnected();
    const key = `shortlink:${slug}`;
    await this.client.set(key, originalUrl);
    // Set expiration to 1 year (optional)
    await this.client.expire(key, 365 * 24 * 60 * 60);
  }

  async get(slug: string): Promise<string | null> {
    await this.ensureConnected();
    const key = `shortlink:${slug}`;
    const result = await this.client.get(key);
    return result;
  }

  async exists(slug: string): Promise<boolean> {
    await this.ensureConnected();
    const key = `shortlink:${slug}`;
    const result = await this.client.exists(key);
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
 * Used as fallback when Redis is not available
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
  // Check if Redis URL is available
  const hasRedisUrl = process.env.REDIS_URL && process.env.REDIS_URL !== 'database_provisioning_in_progress';
  
  // Use Redis whenever URL is available (both dev and production)
  if (hasRedisUrl) {
    try {
      console.log('Using Redis storage for persistent data storage');
      return new RedisStorage();
    } catch (error) {
      console.error('Failed to initialize Redis, falling back to file storage:', error);
      return new FileStorage();
    }
  }
  
  // Use file storage when Redis is not available
  if (process.env.NODE_ENV === 'development') {
    console.log('Using file-based storage for development/local environment');
    return new FileStorage();
  }
  
  // Final fallback to in-memory storage
  console.log('Using in-memory storage as fallback');
  return new InMemoryStorage();
}

export const linkStorage: LinkStorage = createStorage(); 