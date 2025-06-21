export interface LinkStorage {
  save(slug: string, originalUrl: string): Promise<void>;
  get(slug: string): Promise<string | null>;
  exists(slug: string): Promise<boolean>;
}

/**
 * In-memory storage implementation
 * For production, this should be replaced with a persistent storage solution
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

// Singleton instance for the storage
export const linkStorage: LinkStorage = new InMemoryStorage(); 