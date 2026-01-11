/**
 * GOOGLE SHOPPING API ADAPTER
 * Official API for searching products across all major retailers
 * No bot detection, fast, reliable, and comprehensive
 */

const axios = require('axios');

class GoogleShoppingAdapter {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.searchEngineId = process.env.GOOGLE_SHOPPING_CX;
    this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
  }

  /**
   * Search for products using Google Shopping API
   * @param {Object} normalized - Normalized product info
   * @param {string} region - Region code ('US' or 'CA')
   * @returns {Array} Array of products
   */
  async searchProduct(normalized, region = 'US') {
    if (!this.apiKey || !this.searchEngineId) {
      console.log('[Google Shopping] API credentials not configured, skipping');
      return [];
    }

    const startTime = Date.now();
    const query = this.buildQuery(normalized);
    
    console.log(`[Google Shopping ${region}] Searching for: ${query}`);

    try {
      const results = await this.makeApiRequest(query, region);
      const products = this.parseResults(results, normalized);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[Google Shopping ${region}] Found ${products.length} products in ${duration}s`);
      
      return products;
    } catch (error) {
      console.error(`[Google Shopping ${region}] Error: ${error.message}`);
      return [];
    }
  }

  /**
   * Build search query from normalized product
   */
  buildQuery(normalized) {
    const parts = [
      normalized.brand,
      normalized.line,
      normalized.concentration || 'perfume',
      normalized.size ? `${normalized.size}ml` : ''
    ].filter(Boolean);
    
    return parts.join(' ');
  }

  /**
   * Make API request to Google Custom Search
   */
  async makeApiRequest(query, region) {
    const params = {
      key: this.apiKey,
      cx: this.searchEngineId,
      q: query,
      gl: region.toLowerCase(), // Geographic location
      num: 10, // Number of results (max 10)
      searchType: 'shopping' // This is not officially supported but helps
    };

    const response = await axios.get(this.baseUrl, { 
      params,
      timeout: 10000 // 10 second timeout
    });

    return response.data;
  }

  /**
   * Parse Google Shopping API results
   */
  parseResults(data, normalized) {
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    const products = [];

    for (const item of data.items) {
      try {
        const product = this.parseProduct(item, normalized);
        if (product) {
          products.push(product);
        }
      } catch (error) {
        console.error('[Google Shopping] Error parsing product:', error.message);
      }
    }

    return products;
  }

  /**
   * Parse individual product from Google result
   */
  parseProduct(item, normalized) {
    // Extract basic info
    const name = item.title || '';
    const url = item.link || '';
    const snippet = item.snippet || '';
    
    // Try to extract retailer from display link
    let retailer = 'Unknown';
    if (item.displayLink) {
      retailer = this.extractRetailer(item.displayLink);
    }

    // Extract price from pagemap if available
    let price = '';
    if (item.pagemap && item.pagemap.offer && item.pagemap.offer[0]) {
      price = item.pagemap.offer[0].price || '';
      if (!price && item.pagemap.offer[0].pricecurrency) {
        const currency = item.pagemap.offer[0].pricecurrency;
        const amount = item.pagemap.offer[0].price;
        price = `${currency} ${amount}`;
      }
    }
    
    // Extract price from snippet if not in pagemap
    if (!price) {
      const priceMatch = snippet.match(/\$\s*\d+\.?\d*/i) || 
                        snippet.match(/CDN\$\s*\d+\.?\d*/i) ||
                        snippet.match(/USD\s*\d+\.?\d*/i);
      if (priceMatch) {
        price = priceMatch[0];
      }
    }

    // Extract image
    let image = '';
    if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image[0]) {
      image = item.pagemap.cse_image[0].src;
    } else if (item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]) {
      image = item.pagemap.metatags[0]['og:image'] || '';
    }

    // Extract size from name or snippet
    const text = `${name} ${snippet}`;
    const sizeMatch = text.match(/(\d+\.?\d*)\s*(ml|oz|ounce)/i);
    const size = sizeMatch ? `${sizeMatch[1]}${sizeMatch[2]}` : '';

    // Basic validation
    if (!name || !url || name.length < 5) {
      return null;
    }

    // Calculate confidence based on name matching
    const confidence = this.calculateConfidence(normalized, name, size);

    return {
      name: this.cleanName(name),
      brand: normalized.brand,
      price,
      size,
      url,
      image,
      retailer,
      confidence,
      source: 'Google Shopping API',
      scrapedAt: new Date().toISOString()
    };
  }

  /**
   * Extract retailer name from domain
   */
  extractRetailer(displayLink) {
    const domain = displayLink.toLowerCase().replace('www.', '');
    
    const retailers = {
      'amazon.com': 'Amazon US',
      'amazon.ca': 'Amazon CA',
      'sephora.com': 'Sephora US',
      'sephora.ca': 'Sephora CA',
      'ulta.com': 'Ulta Beauty',
      'nordstrom.com': 'Nordstrom',
      'macys.com': "Macy's",
      'bloomingdales.com': "Bloomingdale's",
      'fragrancenet.com': 'FragranceNet',
      'fragrancex.com': 'FragranceX',
      'perfume.com': 'Perfume.com',
      'walmart.com': 'Walmart',
      'target.com': 'Target',
      'cvs.com': 'CVS',
      'walgreens.com': 'Walgreens',
      'thebay.com': 'The Bay',
      'shoppersdrugmart.ca': 'Shoppers Drug Mart',
      'well.ca': 'Well.ca',
      'saks.com': 'Saks Fifth Avenue',
      'neimanmarcus.com': 'Neiman Marcus'
    };

    for (const [key, name] of Object.entries(retailers)) {
      if (domain.includes(key)) {
        return name;
      }
    }

    // Extract domain name as fallback
    const domainParts = domain.split('.');
    if (domainParts.length >= 2) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }

    return domain;
  }

  /**
   * Clean product name
   */
  cleanName(name) {
    return name
      .replace(/\s*\|\s*.*/g, '') // Remove everything after pipe
      .replace(/\s*-\s*Amazon\.com/gi, '')
      .replace(/\s*-\s*Sephora/gi, '')
      .replace(/\s*-\s*Ulta/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate confidence score for Google results
   */
  calculateConfidence(normalized, name, size) {
    let score = 50; // Base score for Google results

    const nameLower = name.toLowerCase();
    const brandLower = normalized.brand.toLowerCase();
    const lineLower = normalized.line.toLowerCase();

    // Brand match (25 points)
    if (nameLower.includes(brandLower)) {
      score += 25;
    }

    // Product line match (20 points)
    if (nameLower.includes(lineLower)) {
      score += 20;
    }

    // Size match (5 points)
    if (size && normalized.size) {
      const sizeNum = parseInt(size);
      const expectedSize = normalized.size;
      if (Math.abs(sizeNum - expectedSize) <= 25) {
        score += 5;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Search both US and CA regions
   */
  async searchBothRegions(normalized) {
    const [usResults, caResults] = await Promise.all([
      this.searchProduct(normalized, 'US'),
      this.searchProduct(normalized, 'CA')
    ]);

    return [...usResults, ...caResults];
  }
}

module.exports = GoogleShoppingAdapter;
