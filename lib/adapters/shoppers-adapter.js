const BaseAdapter = require('./base-adapter');

/**
 * Shoppers Drug Mart Adapter
 * Handles scraping from Shoppers Drug Mart (Canada) and potential US expansion
 */

class ShoppersDrugMartAdapter extends BaseAdapter {
  constructor(country = 'CA') {
    super('Shoppers Drug Mart', country);
    
    // Shoppers is primarily Canadian
    this.baseUrl = 'https://www1.shoppersdrugmart.ca/en/';
    this.searchPath = 'search';
  }

  /**
   * Search for product on Shoppers Drug Mart
   */
  async searchProduct(normalized) {
    try {
      this.log(`Searching for: ${normalized.brand} ${normalized.line}`);
      
      // Build search query
      const query = `${normalized.brand} ${normalized.line} perfume`;
      const searchUrl = `${this.baseUrl}${this.searchPath}?searchTerm=${encodeURIComponent(query)}`;
      
      // Navigate to search page
      await this.navigate(searchUrl);
      
      // Wait for results to load
      const hasResults = await this.waitForSelector('.product-grid, .product-list, [class*="product-tile"]', 5000);
      
      if (!hasResults) {
        this.log('No search results found', 'warn');
        return [];
      }
      
      // Extract products
      const products = await this.extractProducts();
      
      this.log(`Found ${products.length} products before validation`);
      
      // Validate and enrich
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
   * Extract products from Shoppers Drug Mart search results
   */
  async extractProducts() {
    try {
      await this.sleep(2000); // Wait for rendering
      
      const products = await this.page.evaluate(() => {
        const results = [];
        
        // Try multiple selectors for Shoppers' varying HTML structure
        const tiles = document.querySelectorAll(
          '.product-tile, .product-grid-item, [class*="product-item"], [data-product]'
        );
        
        tiles.forEach((tile, index) => {
          if (index >= 5) return; // Limit to first 5
          
          try {
            // Extract product name
            const nameEl = tile.querySelector(
              '.product-name, .product-title, h3, h4, [class*="name"]'
            );
            const name = nameEl?.textContent?.trim() || '';
            
            // Extract brand (often in product name or separate element)
            const brandEl = tile.querySelector(
              '.product-brand, [class*="brand"]'
            );
            let brand = brandEl?.textContent?.trim() || '';
            
            // If no separate brand element, try to extract from name
            if (!brand && name) {
              const brandMatch = name.match(/^([A-Z][a-z]+(?:\s+[A-Z&][a-z]+)*)/);
              brand = brandMatch ? brandMatch[1] : '';
            }
            
            // Extract price
            const priceEl = tile.querySelector(
              '.product-price, .price, [class*="price"]'
            );
            const price = priceEl?.textContent?.trim() || '';
            
            // Extract size
            const sizeEl = tile.querySelector(
              '.product-size, .size, [class*="size"]'
            );
            const size = sizeEl?.textContent?.trim() || '';
            
            // Extract URL
            const linkEl = tile.querySelector('a[href*="/product/"], a[href*="/p/"]');
            const url = linkEl?.href || '';
            
            // Extract image
            const imgEl = tile.querySelector('img');
            const image = imgEl?.src || imgEl?.getAttribute('data-src') || '';
            
            // Get description
            const description = tile.textContent || '';
            
            if (name && url) {
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
            console.error('Error extracting Shoppers product:', e);
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
   * Get product details from Shoppers product page
   */
  async getProductDetails(productUrl) {
    try {
      await this.navigate(productUrl);
      
      await this.waitForSelector('.product-detail, .product-info', 5000);
      
      const details = await this.page.evaluate(() => {
        const brandEl = document.querySelector('.product-brand, [class*="brand"]');
        const nameEl = document.querySelector('.product-name, h1');
        const priceEl = document.querySelector('.product-price, .price');
        const sizeEl = document.querySelector('.product-size, [class*="size"]');
        const descEl = document.querySelector('.product-description, [class*="description"]');
        
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

  /**
   * Check if product is available
   */
  async checkAvailability(productUrl) {
    try {
      await this.navigate(productUrl);
      
      const available = await this.page.evaluate(() => {
        // Check for out of stock indicators
        const outOfStockEl = document.querySelector(
          '[class*="out-of-stock"], [class*="unavailable"]'
        );
        
        if (outOfStockEl) {
          return false;
        }
        
        // Check for add to cart button
        const addToCartBtn = document.querySelector(
          'button[class*="add-to-cart"], [class*="add-to-bag"]'
        );
        
        return addToCartBtn && !addToCartBtn.disabled;
      });
      
      return available;
      
    } catch (error) {
      this.log(`Error checking availability: ${error.message}`, 'error');
      return null;
    }
  }
}

module.exports = ShoppersDrugMartAdapter;
