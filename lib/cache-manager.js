const fs = require('fs').promises;
const path = require('path');

/**
 * File-Based Cache Manager with TTL support
 * Handles caching of scraped product data with 1-hour expiration
 */

class CacheManager {
  constructor(options = {}) {
    this.cacheFilePath = options.cacheFilePath || path.join(__dirname, '..', 'cache', 'products.json');
    this.ttlHours = options.ttlHours || 1; // Default 1 hour
    this.cache = null;
    this.loading = null;
  }

  /**
   * Initialize and load cache from file
   */
  async init() {
    if (this.loading) {
      return this.loading;
    }

    this.loading = this._loadCache();
    await this.loading;
    this.loading = null;
  }

  /**
   * Load cache from file
   */
  async _loadCache() {
    try {
      const data = await fs.readFile(this.cacheFilePath, 'utf8');
      this.cache = JSON.parse(data);
      
      // Clean up expired entries
      this._cleanupExpired();
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, initialize empty cache
        this.cache = {};
        await this._saveCache();
      } else {
        console.error('Error loading cache:', error);
        this.cache = {};
      }
    }
  }

  /**
   * Save cache to file
   */
  async _saveCache() {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.cacheFilePath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write cache to file
      await fs.writeFile(
        this.cacheFilePath,
        JSON.stringify(this.cache, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  /**
   * Clean up expired entries
   */
  _cleanupExpired() {
    if (!this.cache) return;

    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of Object.entries(this.cache)) {
      if (entry.expiresAt && entry.expiresAt < now) {
        delete this.cache[key];
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Get cached data by normalized ID
   */
  async get(normalizedId) {
    if (!this.cache) {
      await this.init();
    }

    const entry = this.cache[normalizedId];
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      delete this.cache[normalizedId];
      await this._saveCache();
      return null;
    }

    return entry;
  }

  /**
   * Set cache data
   */
  async set(normalizedId, data) {
    if (!this.cache) {
      await this.init();
    }

    const now = Date.now();
    const expiresAt = now + (this.ttlHours * 60 * 60 * 1000);

    this.cache[normalizedId] = {
      ...data,
      timestamp: now,
      expiresAt: expiresAt
    };

    await this._saveCache();
    return this.cache[normalizedId];
  }

  /**
   * Check if key exists and is not expired
   */
  async has(normalizedId) {
    const entry = await this.get(normalizedId);
    return entry !== null;
  }

  /**
   * Delete cache entry
   */
  async delete(normalizedId) {
    if (!this.cache) {
      await this.init();
    }

    if (this.cache[normalizedId]) {
      delete this.cache[normalizedId];
      await this._saveCache();
      return true;
    }

    return false;
  }

  /**
   * Clear all cache
   */
  async clear() {
    this.cache = {};
    await this._saveCache();
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    if (!this.cache) {
      await this.init();
    }

    const entries = Object.values(this.cache);
    const now = Date.now();

    const valid = entries.filter(e => !e.expiresAt || e.expiresAt > now).length;
    const expired = entries.filter(e => e.expiresAt && e.expiresAt <= now).length;

    return {
      total: entries.length,
      valid,
      expired,
      size: JSON.stringify(this.cache).length
    };
  }

  /**
   * Get all cached products
   */
  async getAll() {
    if (!this.cache) {
      await this.init();
    }

    // Clean up first
    this._cleanupExpired();
    
    return { ...this.cache };
  }
}

// Create singleton instance
const cacheManager = new CacheManager({
  ttlHours: process.env.CACHE_TTL_HOURS ? parseInt(process.env.CACHE_TTL_HOURS) : 1,
  cacheFilePath: process.env.CACHE_FILE_PATH || undefined
});

module.exports = cacheManager;
module.exports.CacheManager = CacheManager;
