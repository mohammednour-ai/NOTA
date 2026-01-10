const { normalizeProduct } = require('./lib/product-normalizer');
const RetailerAggregator = require('./lib/retailer-aggregator');

/**
 * Test Multi-Retailer Scraping
 * Tests the scraping system with real perfume products
 */

async function testScraping() {
  console.log('🧪 Starting Multi-Retailer Scraping Test\n');
  console.log('='.repeat(60));
  
  // Test products covering different brands and types
  const testProducts = [
    'Chanel Coco Mademoiselle Eau de Parfum 100ml',
    'Dior J\'adore EDP 50ml',
    'Tom Ford Oud Wood Eau de Parfum 100ml',
    'Ariana Grande Cloud EDP 100ml',
    'Viktor & Rolf Flowerbomb 100ml'
  ];
  
  const aggregator = new RetailerAggregator();
  
  for (const productQuery of testProducts) {
    console.log(`\n📦 Testing: ${productQuery}`);
    console.log('-'.repeat(60));
    
    try {
      // Normalize product
      const normalized = normalizeProduct(productQuery);
      console.log(`   Brand: ${normalized.brand}`);
      console.log(`   Line: ${normalized.line}`);
      console.log(`   Concentration: ${normalized.concentration}`);
      console.log(`   Size: ${normalized.size}ml`);
      console.log(`   Normalized ID: ${normalized.normalizedId}\n`);
      
      // Search all retailers
      const results = await aggregator.searchAllRetailers(normalized);
      
      console.log(`\n   ✅ Found ${results.length} products across retailers:`);
      
      if (results.length === 0) {
        console.log('   ⚠️  No products found (this is normal for some perfumes)');
      } else {
        results.forEach((product, index) => {
          console.log(`\n   ${index + 1}. ${product.retailer}`);
          console.log(`      Name: ${product.name}`);
          console.log(`      Price: ${product.price}`);
          console.log(`      Confidence: ${product.confidence}%`);
          console.log(`      URL: ${product.url.substring(0, 80)}...`);
        });
        
        // Show statistics
        const stats = aggregator.getStats(results);
        console.log(`\n   📊 Statistics:`);
        console.log(`      Total retailers: ${stats.retailers}`);
        console.log(`      Avg confidence: ${stats.byRetailer.map(r => r.avgConfidence.toFixed(1)).join(', ')}`);
        if (stats.bestDeal) {
          console.log(`      Best deal: ${stats.bestDeal.retailer} at ${stats.bestDeal.price}`);
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Error testing ${productQuery}:`, error.message);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n✅ Test completed!');
  console.log('\nSummary:');
  console.log(`  - Tested ${testProducts.length} products`);
  console.log(`  - Retailers configured: ${aggregator.adapters.length}`);
  console.log(`  - Concurrent limit: ${aggregator.concurrentLimit}`);
  
  // Cleanup
  await aggregator.closeAll();
  const browserConfig = require('./lib/browser-config');
  await browserConfig.close();
  
  console.log('\n🏁 All tests finished. Browser closed.');
}

// Run tests
testScraping().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
