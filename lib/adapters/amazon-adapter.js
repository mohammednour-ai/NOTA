const BaseAdapter = require('./base-adapter');

/**
 * Amazon Adapter
 * Handles scraping from both Amazon.com and Amazon.ca
 */

class AmazonAdapter extends BaseAdapter {
  constructor(country = 'CA') {
    super('Amazon', country);
    
    // Set domain based on country
    this.domain = country === 'CA' ? 'amazon.ca' : 'amazon.com';
    this.baseUrl = `https://www.${this.domain}`;
    
    // Amazon Associate tag
    this.associateTag = country === 'CA'
      ? (process.env.AMAZON_ASSOCIATE_TAG_CA || 'nota0c-20')
      : (process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20');
  }

  /**
   * Search for product on Amazon
   */
  async searchProduct(normalized) {
    try {
      this.log(`Searching for: ${normalized.brand} ${normalized.line}`);
      
      // Build search query
      const query = `${normalized.brand} ${normalized.line} perfume ${normalized.concentration} ${normalized.size}ml`;
      const searchUrl = `${this.baseUrl}/s?k=${encodeURIComponent(query)}`;
      
      // Navigate to search page
      await this.navigate(searchUrl);
      
      // Wait for results
      const hasResults = await this.waitForSelector('[data-component-type="s-search-result"], .s-result-item', 5000);
      
      if (!hasResults) {
        this.log('No search results found', 'warn');
        return [];
      }
      
      // Extract products
      const products = await this.extractProducts();
      
      this.log(`Found ${products.length} products before validation`);
      
      // Filter out accessories and validate
      const validated = this.validateAndEnrich(normalized, products);
      
      this.log(`${validated.length} products passed validation (50+ confidence)`);
      
      return validated;
      
    } catch (error) {
      this.log(`Error searching: ${error.message}`, 'error');
      return [];
    } finally {
      await this.close();
    }
  }

  /**
   * Extract products from Amazon search results
   */
  async extractProducts() {
    try {
      await this.sleep(2000); // Wait for JavaScript rendering
      
      const products = await this.page.evaluate((associateTag) => {
        const results = [];
        
        // Find all product results
        const items = document.querySelectorAll(
          '[data-component-type="s-search-result"], .s-result-item[data-asin]'
        );
        
        items.forEach((item, index) => {
          if (index >= 5) return; // Limit to first 5
          
          try {
            // Get ASIN (Amazon product ID)
            const asin = item.getAttribute('data-asin');
            if (!asin) return;
            
            // Extract title/name and clean it
            // Try multiple selectors to get the actual product name
            let titleEl = item.querySelector('h2 a span.a-size-base-plus, h2 a span.a-size-medium');
            if (!titleEl) {
              titleEl = item.querySelector('h2 span.a-text-normal');
            }
            if (!titleEl) {
              titleEl = item.querySelector('h2 a, .s-title-instructions-style a');
            }
            
            let name = titleEl?.textContent?.trim() || '';
            
            // Remove "Sponsored" labels and clean up
            name = name
              .replace(/^Sponsored\s*/gi, '')  // Remove "Sponsored" at start
              .replace(/\s*Sponsored$/gi, '')  // Remove "Sponsored" at end  
              .replace(/Sponsored\s*Sponsored/gi, '') // Remove duplicate "SponsoredSponsored"
              .replace(/\s+/g, ' ')  // Normalize whitespace
              .trim();
              
            // Skip if name is empty or just "Sponsored"
            if (!name || name.toLowerCase() === 'sponsored') return;
            
            // Extract price
            const priceWhole = item.querySelector('.a-price-whole')?.textContent?.trim() || '';
            const priceFraction = item.querySelector('.a-price-fraction')?.textContent?.trim() || '';
            const priceSymbol = item.querySelector('.a-price-symbol')?.textContent?.trim() || '$';
            const price = priceWhole ? `${priceSymbol}${priceWhole}${priceFraction}` : '';
            
            // Extract URL and add affiliate tag
            let url = titleEl?.href || '';
            if (url && !url.includes('tag=')) {
              url = url.includes('?') 
                ? `${url}&tag=${associateTag}`
                : `${url}?tag=${associateTag}`;
            }
            
            // Extract image
            const imgEl = item.querySelector('img.s-image');
            const image = imgEl?.src || '';
            
            // Get full text for description/size extraction
            const description = item.textContent || '';
            
            // Try to extract brand from title or separate brand element
            const brandMatch = name.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
            const brand = brandMatch ? brandMatch[1] : '';
            
            // Extract size from description
            const sizeMatch = description.match(/(\d+\.?\d*)\s*(ml|oz|ounce)/i);
            const size = sizeMatch ? `${sizeMatch[1]}${sizeMatch[2]}` : '';
            
            // Final validation: must have meaningful name and URL
            if (name && name.length > 5 && url) {
              results.push({
                brand,
                name,
                price,
                size,
                url,
                image,
                description,
                asin
              });
            }
          } catch (e) {
            console.error('Error extracting Amazon product:', e);
          }
        });
        
        return results;
      }, this.associateTag);
      
      return products;
      
    } catch (error) {
      this.log(`Error extracting products: ${error.message}`, 'error');
      return [];
    }
  }

  /**
   * Add affiliate tag to Amazon URL
   */
  addAffiliateTag(url) {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('tag', this.associateTag);
      return urlObj.toString();
    } catch (error) {
      // Fallback for relative URLs
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}tag=${this.associateTag}`;
    }
  }

  /**
   * Check if product is likely an accessory or sample
   */
  isAccessory(product) {
    const text = `${product.name} ${product.description}`.toLowerCase();
    
    const accessoryKeywords = [
      'sample', 'travel', 'mini', 'miniature', 'rollerball',
      'gift set', 'discovery set', 'vial', 'atomizer',
      'deluxe sample', 'travel size', '0.05 oz', '0.1 oz',
      'purse spray', 'coffret', 'set of'
    ];
    
    return accessoryKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Validate and enrich Amazon products
   */
  validateAndEnrich(expected, scrapedProducts) {
    // First filter out accessories
    const filtered = scrapedProducts.filter(product => !this.isAccessory(product));
    
    this.log(`Filtered ${scrapedProducts.length - filtered.length} accessories/samples`);
    
    // Then validate remaining products
    return super.validateAndEnrich(expected, filtered);
  }

  /**
   * Get product details from Amazon product page
   */
  async getProductDetails(asin) {
    try {
      const productUrl = `${this.baseUrl}/dp/${asin}`;
      await this.navigate(productUrl);
      
      await this.waitForSelector('#productTitle, #title', 5000);
      
      const details = await this.page.evaluate(() => {
        const title = document.querySelector('#productTitle, #title')?.textContent?.trim();
        const price = document.querySelector('.a-price .a-offscreen')?.textContent?.trim();
        const description = document.querySelector('#feature-bullets')?.textContent?.trim();
        
        return {
          name: title,
          price,
          description,
          url: window.location.href
        };
      });
      
      return details;
      
    } catch (error) {
      this.log(`Error getting product details for ASIN ${asin}: ${error.message}`, 'error');
      return null;
    }
  }
}

module.exports = AmazonAdapter;
