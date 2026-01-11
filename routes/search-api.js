const express = require('express');
const rateLimit = require('express-rate-limit');
const { normalizeProduct } = require('../lib/product-normalizer');
const cacheManager = require('../lib/cache-manager');
const GoogleOnlyRetailerAggregator = require('../lib/google-only-aggregator');
const { injectAffiliateLinks } = require('../lib/affiliate-injector');

const router = express.Router();

// Rate limiter: 10 requests per minute
const searchLimiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});

/**
 * GET /api/search
 * Search for perfume across multiple retailers
 * Query params:
 *   - query: Product search string (e.g., "Chanel Coco Mademoiselle EDP 100ml")
 */
router.get('/search', searchLimiter, async (req, res) => {
  try {
    const { query } = req.query;
    
    // Validate query parameter
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Query parameter is required',
        example: '/api/search?query=Chanel+Coco+Mademoiselle+EDP+100ml'
      });
    }
    
    console.log(`\n[API] Search request: ${query}`);
    
    // Normalize product
    let normalized;
    try {
      normalized = normalizeProduct(query);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid product query format',
        message: error.message
      });
    }
    
    console.log(`[API] Normalized:`, normalized);
    
    // Check cache (1 hour TTL)
    const cached = await cacheManager.get(normalized.normalizedId);
    if (cached && cached.results) {
      console.log(`[API] Cache hit for ${normalized.normalizedId}`);
      return res.json({
        source: 'cache',
        normalized: cached.normalized,
        results: cached.results,
        cachedAt: new Date(cached.timestamp).toISOString(),
        expiresAt: new Date(cached.expiresAt).toISOString()
      });
    }
    
    console.log(`[API] Cache miss, querying Google Shopping API...`);
    
    // Search using Google Shopping API only
    const aggregator = new GoogleOnlyRetailerAggregator();
    
    // Check if API is configured
    if (!aggregator.isConfigured()) {
      return res.status(503).json({
        error: 'Google Shopping API not configured',
        message: 'Please add GOOGLE_API_KEY and GOOGLE_SHOPPING_CX to .env file',
        documentation: 'See GOOGLE_SHOPPING_API_SETUP.md for setup instructions'
      });
    }
    
    const results = await aggregator.searchAllRetailers(normalized);
    
    // Inject affiliate links
    const withAffiliateLinks = injectAffiliateLinks(results);
    
    // Get statistics
    const stats = aggregator.getStats(withAffiliateLinks);
    
    // Cache results
    await cacheManager.set(normalized.normalizedId, {
      normalized,
      results: withAffiliateLinks,
      stats
    });
    
    console.log(`[API] Returning ${withAffiliateLinks.length} products`);
    
    res.json({
      source: 'live',
      normalized,
      results: withAffiliateLinks,
      stats
    });
    
  } catch (error) {
    console.error('[API] Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/search/status
 * Get API status and cache statistics
 */
router.get('/search/status', async (req, res) => {
  try {
    const cacheStats = await cacheManager.getStats();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      cache: cacheStats,
      rateLimit: {
        windowMs: process.env.API_RATE_LIMIT_WINDOW_MS || 60000,
        maxRequests: process.env.API_RATE_LIMIT_MAX_REQUESTS || 10
      }
    });
  } catch (error) {
    console.error('[API] Status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

/**
 * DELETE /api/search/cache/:id
 * Clear specific cache entry
 */
router.delete('/search/cache/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await cacheManager.delete(id);
    
    if (deleted) {
      res.json({ message: 'Cache entry deleted', id });
    } else {
      res.status(404).json({ error: 'Cache entry not found', id });
    }
  } catch (error) {
    console.error('[API] Cache delete error:', error);
    res.status(500).json({ error: 'Failed to delete cache entry' });
  }
});

/**
 * DELETE /api/search/cache
 * Clear all cache
 */
router.delete('/search/cache', async (req, res) => {
  try {
    await cacheManager.clear();
    res.json({ message: 'All cache cleared' });
  } catch (error) {
    console.error('[API] Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

module.exports = router;
