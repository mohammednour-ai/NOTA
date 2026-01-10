# Environment Configuration for Scraping Platform

## Required Environment Variables

Add these to your `.env` file:

```env
# API Keys
ANTHROPIC_API_KEY=your_anthropic_key_here

# Cache Configuration
CACHE_TTL_HOURS=1
CACHE_FILE_PATH=./cache/products.json

# Scraping Configuration
SCRAPING_MAX_RETRIES=3
SCRAPING_TIMEOUT_MS=30000
SCRAPING_CONCURRENT_LIMIT=5
PUPPETEER_HEADLESS=true

# Rate Limiting
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX_REQUESTS=10

# Affiliate Tracking
AMAZON_ASSOCIATE_TAG=nota0c-20
AMAZON_ASSOCIATE_TAG_CA=nota0c-20

# Retailer Priority (comma-separated)
RETAILER_PRIORITY=Sephora CA,Amazon CA,Shoppers CA,Sephora US,Amazon US,Shoppers US

# Server Configuration
PORT=3000
NODE_ENV=development

# Feature Flags
USE_DIRECT_SCRAPING=true
```

## Configuration Details

### Cache Configuration
- `CACHE_TTL_HOURS`: Time to live for cached products (default: 1 hour)
- `CACHE_FILE_PATH`: Path to cache file (default: ./cache/products.json)

### Scraping Configuration
- `SCRAPING_MAX_RETRIES`: Max retries per failed scraping attempt (default: 3)
- `SCRAPING_TIMEOUT_MS`: Timeout for each page load (default: 30000ms)
- `SCRAPING_CONCURRENT_LIMIT`: Max concurrent scraping tasks (default: 5)
- `PUPPETEER_HEADLESS`: Run browser in headless mode (default: true)

### Rate Limiting
- `API_RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: 60000 = 1 minute)
- `API_RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 10)

### Affiliate Tracking
- `AMAZON_ASSOCIATE_TAG`: Amazon Associate ID for USA (required for Amazon US links)
- `AMAZON_ASSOCIATE_TAG_CA`: Amazon Associate ID for Canada (required for Amazon CA links)

### Retailer Priority
- `RETAILER_PRIORITY`: Comma-separated list of retailers in priority order
- Affects sorting of search results

### Feature Flags
- `USE_DIRECT_SCRAPING`: Enable/disable scraping system (default: true)
