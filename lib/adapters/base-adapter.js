const browserConfig = require('../browser-config');
const { validateProducts } = require('../validation-engine');

/**
 * Base Adapter Class
 * Provides common functionality for all retailer adapters
 */

class BaseAdapter {
  constructor(retailerName, country = 'CA') {
    this.retailerName = retailerName;
    this.country = country;
    this.page = null;
    this.maxRetries = parseInt(process.env.SCRAPING_MAX_RETRIES || '3');
  }

  /**
   * Initialize page
   */
  async init() {
    if (!this.page || this.page.isClosed()) {
      this.page = await browserConfig.newPage();
    }
    return this.page;
  }

  /**
   * Close page
   */
  async close() {
    if (this.page && !this.page.isClosed()) {
      await browserConfig.closePage(this.page);
      this.page = null;
    }
  }

  /**
   * Retry function with exponential backoff
   */
  async retry(fn, maxRetries = this.maxRetries) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`${this.retailerName} attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Navigate to URL with retry
   */
  async navigate(url, options = {}) {
    await this.init();
    
    return await this.retry(async () => {
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
        ...options
      });
    });
  }

  /**
   * Wait for selector with timeout
   */
  async waitForSelector(selector, timeout = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.warn(`Selector ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  /**
   * Extract text from element
   */
  async extractText(selector) {
    try {
      const element = await this.page.$(selector);
      if (element) {
        return await this.page.evaluate(el => el.textContent?.trim(), element);
      }
    } catch (error) {
      console.warn(`Error extracting text from ${selector}:`, error.message);
    }
    return '';
  }

  /**
   * Extract attribute from element
   */
  async extractAttribute(selector, attribute) {
    try {
      const element = await this.page.$(selector);
      if (element) {
        return await this.page.evaluate(
          (el, attr) => el.getAttribute(attr), 
          element, 
          attribute
        );
      }
    } catch (error) {
      console.warn(`Error extracting ${attribute} from ${selector}:`, error.message);
    }
    return '';
  }

  /**
   * Parse price string to number
   */
  parsePrice(priceStr) {
    if (!priceStr) return null;
    
    // Remove currency symbols and extract number
    const match = priceStr.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return null;
  }

  /**
   * Format price for display
   */
  formatPrice(price, currency = 'USD') {
    if (!price) return '';
    
    const symbols = {
      'USD': '$',
      'CAD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    
    return `${symbols[currency] || '$'}${price.toFixed(2)}`;
  }

  /**
   * Validate and enrich products
   */
  validateAndEnrich(expected, scrapedProducts) {
    // Validate products using validation engine
    const validated = validateProducts(expected, scrapedProducts);
    
    // Enrich with retailer information
    return validated.map(product => ({
      ...product,
      retailer: `${this.retailerName} ${this.country}`,
      country: this.country,
      scrapedAt: new Date().toISOString()
    }));
  }

  /**
   * Search for product (to be implemented by child classes)
   */
  async searchProduct(normalized) {
    throw new Error('searchProduct must be implemented by child class');
  }

  /**
   * Extract products from search results (to be implemented by child classes)
   */
  async extractProducts() {
    throw new Error('extractProducts must be implemented by child class');
  }

  /**
   * Get retailer info
   */
  getRetailerInfo() {
    return {
      name: this.retailerName,
      country: this.country,
      fullName: `${this.retailerName} ${this.country}`
    };
  }

  /**
   * Log activity
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.retailerName} ${this.country}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ERROR:`, message);
        break;
      case 'warn':
        console.warn(`${prefix} WARN:`, message);
        break;
      default:
        console.log(`${prefix} INFO:`, message);
    }
  }
}

module.exports = BaseAdapter;
