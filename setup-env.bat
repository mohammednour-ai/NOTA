@echo off
REM Script to add scraping configuration to .env file

echo Adding scraping configuration to .env...

echo.>> .env
echo # Scraping Platform Configuration - Added by setup>> .env
echo CACHE_TTL_HOURS=1>> .env
echo CACHE_FILE_PATH=./cache/products.json>> .env
echo SCRAPING_MAX_RETRIES=3>> .env
echo SCRAPING_TIMEOUT_MS=30000>> .env
echo SCRAPING_CONCURRENT_LIMIT=5>> .env
echo PUPPETEER_HEADLESS=true>> .env
echo API_RATE_LIMIT_WINDOW_MS=60000>> .env
echo API_RATE_LIMIT_MAX_REQUESTS=10>> .env
echo AMAZON_ASSOCIATE_TAG=nota0c-20>> .env
echo AMAZON_ASSOCIATE_TAG_CA=nota0c-20>> .env
echo RETAILER_PRIORITY=Sephora CA,Amazon CA,Shoppers CA,Sephora US,Amazon US,Shoppers US>> .env
echo USE_DIRECT_SCRAPING=true>> .env

echo Configuration added to .env successfully!
echo.
echo Starting server...
