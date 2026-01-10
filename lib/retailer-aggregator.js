const SephoraAdapter = require('./adapters/sephora-adapter');
const AmazonAdapter = require('./adapters/amazon-adapter');
const ShoppersDrugMartAdapter = require('./adapters/shoppers-adapter');

/**
 * Retailer Aggregator
 * Orchestrates parallel scraping across multiple retailers
 */

class RetailerAggregator {
  constructor(options = {}) {
    this.concurrentLimit = parseInt(
      process.env.SCRAPING_CONCURRENT_LIMIT || '5'
    );
    
    // Retailer priority (can be configured via env)
    this.retailerPriority = (process.env.RETAILER_PRIORITY || 
      'Sephora CA,Amazon CA,Shoppers CA,Sephora US,Amazon US,Shoppers US'
    ).split(',').map(r => r.trim());
    
    // Initialize adapters based on configuration
    this.adapters = this._initializeAdapters(options);
  }

  /**
   * Initialize retailer adapters
   */
  _initializeAdapters(options) {
    const adapters = [];
    
    // Add adapters based on priority
    if (this.shouldIncludeRetailer('Sephora CA')) {
      adapters.push(new SephoraAdapter('CA'));
    }
    
    if (this.shouldIncludeRetailer('Sephora US')) {
      adapters.push(new SephoraAdapter('US'));
    }
    
    if (this.shouldIncludeRetailer('Amazon CA')) {
      adapters.push(new AmazonAdapter('CA'));
    }
    
    if (this.shouldIncludeRetailer('Amazon US')) {
      adapters.push(new AmazonAdapter('US'));
    }
    
    if (this.shouldIncludeRetailer('Shoppers CA')) {
      adapters.push(new ShoppersDrugMartAdapter('CA'));
    }
    
    if (this.shouldIncludeRetailer('Shoppers US')) {
      adapters.push(new ShoppersDrugMartAdapter('US'));
    }
    
    console.log(`Initialized ${adapters.length} retailer adapters`);
    return adapters;
  }

  /**
   * Check if retailer should be included
   */
  shouldIncludeRetailer(retailerName) {
    // Always include if no priority configured
    if (!this.retailerPriority || this.retailerPriority.length === 0) {
      return true;
    }
    
    return this.retailerPriority.includes(retailerName);
  }

  /**
   * Search all retailers in parallel
   */
  async searchAllRetailers(normalized) {
    console.log(`\nSearching across ${this.adapters.length} retailers for: ${normalized.brand} ${normalized.line}`);
    console.log(`Concurrent limit: ${this.concurrentLimit}`);
    
    const startTime = Date.now();
    
    // Run adapters in parallel with concurrency limit
    const results = await this._runWithConcurrencyLimit(
      this.adapters,
      (adapter) => this._searchSingleRetailer(adapter, normalized),
      this.concurrentLimit
    );
    
    // Flatten results
    const allProducts = results.flat().filter(p => p && p.url);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nSearch completed in ${duration}s`);
    console.log(`Found ${allProducts.length} total products across all retailers`);
    
    // Sort results by priority
    const sorted = this.sortResults(allProducts);
    
    return sorted;
  }

  /**
   * Search single retailer with error handling
   */
  async _searchSingleRetailer(adapter, normalized) {
    try {
      console.log(`Starting ${adapter.getRetailerInfo().fullName}...`);
      const results = await adapter.searchProduct(normalized);
      console.log(`${adapter.getRetailerInfo().fullName} returned ${results.length} products`);
      return results;
    } catch (error) {
      console.error(`${adapter.getRetailerInfo().fullName} failed:`, error.message);
      return [];
    }
  }

  /**
   * Run tasks with concurrency limit
   */
  async _runWithConcurrencyLimit(items, task, limit) {
    const results = [];
    const executing = [];
    
    for (const item of items) {
      const promise = task(item).then(result => {
        results.push(result);
        executing.splice(executing.indexOf(promise), 1);
      });
      
      executing.push(promise);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
    
    await Promise.all(executing);
    return results;
  }

  /**
   * Sort results by confidence, price, and retailer priority
   */
  sortResults(products) {
    return products.sort((a, b) => {
      // Priority 1: Confidence score (higher is better)
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      
      // Priority 2: Retailer priority
      const aPriority = this.getRetailerPriority(a.retailer);
      const bPriority = this.getRetailerPriority(b.retailer);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Priority 3: Price (lower is better)
      const aPrice = this.parsePrice(a.price);
      const bPrice = this.parsePrice(b.price);
      if (aPrice !== null && bPrice !== null) {
        return aPrice - bPrice;
      }
      
      return 0;
    });
  }

  /**
   * Get retailer priority index
   */
  getRetailerPriority(retailerName) {
    const index = this.retailerPriority.indexOf(retailerName);
    return index === -1 ? 999 : index;
  }

  /**
   * Parse price string to number
   */
  parsePrice(priceStr) {
    if (!priceStr) return null;
    
    const match = priceStr.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return null;
  }

  /**
   * Group results by retailer
   */
  groupByRetailer(products) {
    const grouped = {};
    
    products.forEach(product => {
      const retailer = product.retailer || 'Unknown';
      if (!grouped[retailer]) {
        grouped[retailer] = [];
      }
      grouped[retailer].push(product);
    });
    
    return grouped;
  }

  /**
   * Get best deal from results
   */
  getBestDeal(products) {
    if (!products || products.length === 0) return null;
    
    // Find product with lowest price among high-confidence matches
    const highConfidence = products.filter(p => p.confidence >= 90);
    const searchList = highConfidence.length > 0 ? highConfidence : products;
    
    return searchList.reduce((best, current) => {
      const currentPrice = this.parsePrice(current.price);
      const bestPrice = this.parsePrice(best.price);
      
      if (currentPrice === null) return best;
      if (bestPrice === null) return current;
      
      return currentPrice < bestPrice ? current : best;
    }, searchList[0]);
  }

  /**
   * Get statistics about search results
   */
  getStats(products) {
    const grouped = this.groupByRetailer(products);
    const bestDeal = this.getBestDeal(products);
    
    return {
      totalProducts: products.length,
      retailers: Object.keys(grouped).length,
      byRetailer: Object.entries(grouped).map(([retailer, prods]) => ({
        retailer,
        count: prods.length,
        avgConfidence: prods.reduce((sum, p) => sum + p.confidence, 0) / prods.length
      })),
      bestDeal: bestDeal ? {
        retailer: bestDeal.retailer,
        price: bestDeal.price,
        confidence: bestDeal.confidence
      } : null,
      priceRange: this._getPriceRange(products)
    };
  }

  /**
   * Get price range from products
   */
  _getPriceRange(products) {
    const prices = products
      .map(p => this.parsePrice(p.price))
      .filter(p => p !== null);
    
    if (prices.length === 0) return null;
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((sum, p) => sum + p, 0) / prices.length
    };
  }

  /**
   * Close all adapters
   */
  async closeAll() {
    const closePromises = this.adapters.map(adapter => adapter.close());
    await Promise.all(closePromises);
  }
}

module.exports = RetailerAggregator;
