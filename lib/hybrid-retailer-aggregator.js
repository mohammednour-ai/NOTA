/**
 * HYBRID RETAILER AGGREGATOR
 * Uses Google Shopping API as primary source
 * Falls back to web scraping if API fails or returns insufficient results
 */

const GoogleShoppingAdapter = require('./google-shopping-adapter');
const SephoraAdapter = require('./adapters/sephora-adapter');
const AmazonAdapter = require('./adapters/amazon-adapter');
const ShoppersDrugMartAdapter = require('./adapters/shoppers-adapter');

class HybridRetailerAggregator {
  constructor() {
    this.googleShopping = new GoogleShoppingAdapter();
    
    // Web scraping adapters (fallback)
    this.scrapingAdapters = [
      new SephoraAdapter('CA'),
      new SephoraAdapter('US'),
      new AmazonAdapter('CA'),
      new AmazonAdapter('US'),
      new ShoppersDrugMartAdapter('CA'),
      new ShoppersDrugMartAdapter('US')
    ];
    
    this.minGoogleResults = 5; // Minimum results before falling back
    this.maxConcurrent = 5; // Max concurrent scraping operations
  }

  /**
   * Main search method - tries Google first, falls back to scraping
   */
  async searchAllRetailers(normalized) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Hybrid Search: ${normalized.brand} ${normalized.line}`);
    console.log(`${'='.repeat(80)}`);

    const startTime = Date.now();

    // STRATEGY 1: Try Google Shopping API first
    const googleResults = await this.tryGoogleShopping(normalized);
    
    if (googleResults.length >= this.minGoogleResults) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n✅ SUCCESS via Google Shopping API!`);
      console.log(`   Found ${googleResults.length} products from ${this.countRetailers(googleResults)} retailers`);
      console.log(`   Duration: ${duration}s`);
      console.log(`   Status: FAST PATH (no scraping needed) ⚡`);
      
      return this.sortResults(googleResults);
    }

    console.log(`\n⚠️  Google API returned only ${googleResults.length} products (need ${this.minGoogleResults})`);
    console.log(`   Falling back to web scraping...`);

    // STRATEGY 2: Fall back to web scraping
    const scrapedResults = await this.scrapeRetailers(normalized);
    
    // Combine Google + scraped results (deduplicate)
    const allResults = this.deduplicateResults([...googleResults, ...scrapedResults]);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ COMPLETE (Hybrid mode)`);
    console.log(`   Google API: ${googleResults.length} products`);
    console.log(`   Web Scraping: ${scrapedResults.length} products`);
    console.log(`   Total: ${allResults.length} products from ${this.countRetailers(allResults)} retailers`);
    console.log(`   Duration: ${duration}s`);
    
    return this.sortResults(allResults);
  }

  /**
   * Try Google Shopping API
   */
  async tryGoogleShopping(normalized) {
    try {
      const results = await this.googleShopping.searchBothRegions(normalized);
      
      // Filter by confidence (50+ for Google results)
      return results.filter(p => p.confidence >= 50);
    } catch (error) {
      console.error(`[Google Shopping] Error: ${error.message}`);
      return [];
    }
  }

  /**
   * Scrape retailers using Puppeteer
   */
  async scrapeRetailers(normalized) {
    console.log(`\n📦 Scraping ${this.scrapingAdapters.length} retailers...`);
    
    const promises = [];
    const semaphore = [];

    for (const adapter of this.scrapingAdapters) {
      // Limit concurrent operations
      if (semaphore.length >= this.maxConcurrent) {
        await Promise.race(semaphore);
      }

      const promise = this._searchSingleRetailer(adapter, normalized)
        .then(results => {
          const index = semaphore.indexOf(promise);
          if (index > -1) semaphore.splice(index, 1);
          return results;
        })
        .catch(error => {
          console.error(`${adapter.retailerName} ${adapter.country} failed:`, error.message);
          const index = semaphore.indexOf(promise);
          if (index > -1) semaphore.splice(index, 1);
          return [];
        });

      semaphore.push(promise);
      promises.push(promise);
    }

    const results = await Promise.all(promises);
    return results.flat();
  }

  /**
   * Search a single retailer with timeout
   */
  async _searchSingleRetailer(adapter, normalized) {
    const timeout = 30000; // 30 second timeout per retailer
    
    return Promise.race([
      adapter.searchProduct(normalized),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  }

  /**
   * Deduplicate results based on URL
   */
  deduplicateResults(products) {
    const seen = new Set();
    const unique = [];

    for (const product of products) {
      // Normalize URL for comparison
      const urlKey = product.url.split('?')[0].toLowerCase();
      
      if (!seen.has(urlKey)) {
        seen.add(urlKey);
        unique.push(product);
      }
    }

    return unique;
  }

  /**
   * Count unique retailers
   */
  countRetailers(products) {
    const retailers = new Set(products.map(p => p.retailer));
    return retailers.size;
  }

  /**
   * Sort results by confidence and price
   */
  sortResults(products) {
    return products.sort((a, b) => {
      // First by confidence (higher is better)
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      
      // Then by price (lower is better)
      const priceA = this.parsePrice(a.price);
      const priceB = this.parsePrice(b.price);
      
      if (priceA && priceB) {
        return priceA - priceB;
      }
      
      return 0;
    });
  }

  /**
   * Parse price string to number
   */
  parsePrice(priceStr) {
    if (!priceStr) return null;
    
    const match = priceStr.match(/[\d,]+\.?\d*/);
    if (!match) return null;
    
    return parseFloat(match[0].replace(/,/g, ''));
  }

  /**
   * Get statistics about search method used
   */
  getStats() {
    return {
      googleShoppingEnabled: !!this.googleShopping.apiKey,
      scrapingAdapters: this.scrapingAdapters.length,
      minGoogleResults: this.minGoogleResults
    };
  }
}

module.exports = HybridRetailerAggregator;
