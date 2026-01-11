const BaseAdapter = require('./base-adapter');

/**
 * Sephora Adapter
 * Handles scraping from both Sephora Canada and USA
 */

class SephoraAdapter extends BaseAdapter {
  constructor(country = 'CA') {
    super('Sephora', country);
    
    // Set base URL based on country
    this.baseUrl = country === 'CA' 
      ? 'https://www.sephora.com/ca/en/'
      : 'https://www.sephora.com/';
  }

  /**
   * Search for product on Sephora
   */
  async searchProduct(normalized) {
    try {
      this.log(`Searching for: ${normalized.brand} ${normalized.line}`);
      
      // Build search query
      const query = `${normalized.brand} ${normalized.line} ${normalized.concentration}`;
      const searchUrl = `${this.baseUrl}search?keyword=${encodeURIComponent(query)}`;
      
      // Navigate to search page
      await this.navigate(searchUrl);
      
      // Wait for results to load
      const hasResults = await this.waitForSelector('[data-comp="ProductGrid"], .css-12hrdth, .product-grid', 5000);
      
      if (!hasResults) {
        this.log('No search results found', 'warn');
        return [];
      }
      
      // Extract products from search results
      const products = await this.extractProducts();
      
      this.log(`Found ${products.length} products before validation`);
      
      // Validate and enrich products
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
   * Extract products from search results page
   */
  async extractProducts() {
    try {
      // Wait a bit for JavaScript to render products
      await this.sleep(2000);
      
      // Try multiple selectors (Sephora HTML structure varies)
      const products = await this.page.evaluate(() => {
        const results = [];
        
        // Try main product tiles
        const tiles = document.querySelectorAll(
          '[data-comp="ProductTile"], .css-12hrdth, .product-tile, [data-at="product_tile"]'
        );
        
        tiles.forEach((tile, index) => {
          if (index >= 5) return; // Limit to first 5 results
          
          try {
            // Extract brand
            const brandEl = tile.querySelector(
              '[data-at="brand_name"], .css-1e2qp4w, .product-brand, [class*="brand"]'
            );
            const brand = brandEl?.textContent?.trim() || '';
            
            // Extract product name
            const nameEl = tile.querySelector(
              '[data-at="product_name"], .css-1sw67p, .product-name, [class*="product-name"]'
            );
            const name = nameEl?.textContent?.trim() || '';
            
            // Extract price
            const priceEl = tile.querySelector(
              '[data-at="product_price"], .css-18suhml, .price, [class*="price"]'
            );
            const price = priceEl?.textContent?.trim() || '';
            
            // Extract size/description
            const sizeEl = tile.querySelector(
              '[data-at="sku_size"], .css-1h7nfl3, .product-size, [class*="size"]'
            );
            const size = sizeEl?.textContent?.trim() || '';
            
            // Extract URL
            const linkEl = tile.querySelector('a[href*="/product/"]');
            const url = linkEl?.href || '';
            
            // Extract image
            const imgEl = tile.querySelector('img');
            const image = imgEl?.src || '';
            
            // Get full description text
            const description = tile.textContent?.toLowerCase() || '';
            
            if (brand && name && url) {
              results.push({
                brand,
                name,
                price,
                size,
                url,
                image,
                description
              });
            }
          } catch (e) {
            console.error('Error extracting product:', e);
          }
        });
        
        return results;
      });
      
      return products;
      
    } catch (error) {
      this.log(`Error extracting products: ${error.message}`, 'error');
      return [];
    }
  }

  /**
   * Get direct product URL
   */
  getProductUrl(productPath) {
    if (!productPath) return '';
    
    // If already full URL, return it
    if (productPath.startsWith('http')) {
      return productPath;
    }
    
    // Build full URL
    return `${this.baseUrl.replace(/\/$/, '')}${productPath}`;
  }

  /**
   * Extract product details from product page
   */
  async getProductDetails(productUrl) {
    try {
      await this.navigate(productUrl);
      
      // Wait for product details to load
      await this.waitForSelector('[data-comp="ProductDetails"], .product-details', 5000);
      
      const details = await this.page.evaluate(() => {
        const brandEl = document.querySelector('[data-at="brand_name"]');
        const nameEl = document.querySelector('[data-at="product_name"]');
        const priceEl = document.querySelector('[data-at="product_price"]');
        const sizeEl = document.querySelector('[data-at="sku_size"]');
        const descEl = document.querySelector('[data-at="product_description"]');
        
        return {
          brand: brandEl?.textContent?.trim() || '',
          name: nameEl?.textContent?.trim() || '',
          price: priceEl?.textContent?.trim() || '',
          size: sizeEl?.textContent?.trim() || '',
          description: descEl?.textContent?.trim() || '',
          url: window.location.href
        };
      });
      
      return details;
      
    } catch (error) {
      this.log(`Error getting product details: ${error.message}`, 'error');
      return null;
    }
  }
}

module.exports = SephoraAdapter;
