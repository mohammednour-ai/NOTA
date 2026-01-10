const puppeteer = require('puppeteer');

/**
 * Browser Configuration for Puppeteer
 * Handles browser instance management with stealth mode and optimization
 */

class BrowserConfig {
  constructor() {
    this.browser = null;
    this.pages = new Set();
  }

  /**
   * Get browser launch options
   */
  getLaunchOptions() {
    const headless = process.env.PUPPETEER_HEADLESS !== 'false';
    
    return {
      headless: headless ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      ignoreHTTPSErrors: true
    };
  }

  /**
   * Get user agents for rotation
   */
  getUserAgents() {
    return [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
  }

  /**
   * Get a random user agent
   */
  getRandomUserAgent() {
    const agents = this.getUserAgents();
    return agents[Math.floor(Math.random() * agents.length)];
  }

  /**
   * Launch browser instance
   */
  async launch() {
    if (this.browser) {
      return this.browser;
    }

    try {
      this.browser = await puppeteer.launch(this.getLaunchOptions());
      
      // Handle browser disconnection
      this.browser.on('disconnected', () => {
        console.log('Browser disconnected');
        this.browser = null;
        this.pages.clear();
      });

      return this.browser;
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  /**
   * Create a new page with optimizations
   */
  async newPage() {
    if (!this.browser) {
      await this.launch();
    }

    const page = await this.browser.newPage();
    this.pages.add(page);

    // Set user agent
    await page.setUserAgent(this.getRandomUserAgent());

    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });

    // Block unnecessary resources for faster loading
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      
      // Block images, fonts, and analytics for faster scraping
      if (['image', 'font', 'media'].includes(resourceType)) {
        request.abort();
      }
      // Block analytics and tracking
      else if (request.url().includes('analytics') || 
               request.url().includes('tracking') ||
               request.url().includes('gtm') ||
               request.url().includes('facebook') ||
               request.url().includes('doubleclick')) {
        request.abort();
      }
      else {
        request.continue();
      }
    });

    // Set timeout
    page.setDefaultTimeout(
      parseInt(process.env.SCRAPING_TIMEOUT_MS || '30000')
    );

    // Handle page errors
    page.on('error', (error) => {
      console.error('Page error:', error);
    });

    page.on('pageerror', (error) => {
      console.error('Page JS error:', error);
    });

    return page;
  }

  /**
   * Close a specific page
   */
  async closePage(page) {
    if (page && !page.isClosed()) {
      try {
        await page.close();
        this.pages.delete(page);
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
  }

  /**
   * Close all pages
   */
  async closeAllPages() {
    const pagePromises = Array.from(this.pages).map(page => 
      this.closePage(page)
    );
    await Promise.all(pagePromises);
    this.pages.clear();
  }

  /**
   * Close browser
   */
  async close() {
    await this.closeAllPages();
    
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }

  /**
   * Get browser instance
   */
  getBrowser() {
    return this.browser;
  }

  /**
   * Check if browser is running
   */
  isRunning() {
    return this.browser !== null && this.browser.isConnected();
  }

  /**
   * Restart browser
   */
  async restart() {
    await this.close();
    return await this.launch();
  }
}

// Create singleton instance
const browserConfig = new BrowserConfig();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down browser...');
  await browserConfig.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down browser...');
  await browserConfig.close();
  process.exit(0);
});

module.exports = browserConfig;
module.exports.BrowserConfig = BrowserConfig;
