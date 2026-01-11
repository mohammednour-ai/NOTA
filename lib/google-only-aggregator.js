/**
 * GOOGLE-ONLY RETAILER AGGREGATOR
 * Uses ONLY Google Shopping API (no web scraping fallback)
 * Relies on caching for performance and API quota management
 */

const GoogleShoppingAdapter = require('./google-shopping-adapter');

class GoogleOnlyRetailerAggregator {
  constructor() {
    this.googleShopping = new GoogleShoppingAdapter();
  }

  /**
   * Main search method - Google API only
   * @param {Object} normalized - Normalized product info
   * @returns {Array} Array of products from Google Shopping API
   */
  async searchAllRetailers(normalized) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Google Shopping Search: ${normalized.brand} ${normalized.line}`);
    console.log(`${'='.repeat(80)}`);

    const startTime = Date.now();

    // Search using Google Shopping API only
    const results = await this.searchGoogleShopping(normalized);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const retailerCount = this.countRetailers(results);
    
    console.log(`\n✅ SEARCH COMPLETE`);
    console.log(`   Found: ${results.length} products`);
    console.log(`   Retailers: ${retailerCount}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Source: Google Shopping API ⚡`);
    
    return this.sortResults(results);
  }

  /**
   * Search using Google Shopping API (both US & CA)
   */
  async searchGoogleShopping(normalized) {
    try {
      console.log(`\n🌐 Querying Google Shopping API...`);
      
      const results = await this.googleShopping.searchBothRegions(normalized);
      
      // Filter by minimum confidence (50+)
      const filtered = results.filter(p => p.confidence >= 50);
      
      console.log(`   API Results: ${results.length} products`);
      console.log(`   After filtering: ${filtered.length} products (50+ confidence)`);
      
      if (filtered.length === 0) {
        console.log(`   ⚠️  No products found with sufficient confidence`);
      }
      
      return filtered;
      
    } catch (error) {
      console.error(`\n❌ Google Shopping API Error: ${error.message}`);
      
      // Check if API is configured
      if (!this.googleShopping.apiKey || !this.googleShopping.searchEngineId) {
        console.error(`   ERROR: Google API credentials not configured!`);
        console.error(`   Please add GOOGLE_API_KEY and GOOGLE_SHOPPING_CX to .env file`);
        console.error(`   See: GOOGLE_SHOPPING_API_SETUP.md for instructions`);
      }
      
      return [];
    }
  }

  /**
   * Count unique retailers in results
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
   * Get statistics
   */
  getStats(products) {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        uniqueRetailers: 0,
        avgConfidence: 0,
        source: 'Google Shopping API'
      };
    }

    const avgConfidence = products.reduce((sum, p) => sum + (p.confidence || 0), 0) / products.length;
    
    return {
      totalProducts: products.length,
      uniqueRetailers: this.countRetailers(products),
      avgConfidence: Math.round(avgConfidence),
      source: 'Google Shopping API',
      retailers: [...new Set(products.map(p => p.retailer))]
    };
  }

  /**
   * Check if API is configured
   */
  isConfigured() {
    return !!(this.googleShopping.apiKey && this.googleShopping.searchEngineId);
  }
}

module.exports = GoogleOnlyRetailerAggregator;
