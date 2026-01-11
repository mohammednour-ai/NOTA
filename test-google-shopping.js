/**
 * GOOGLE SHOPPING API TEST SCRIPT
 * Tests the hybrid system with Google Shopping API + web scraping fallback
 */

require('dotenv').config();
const HybridRetailerAggregator = require('./lib/hybrid-retailer-aggregator');
const { normalizeProduct } = require('./lib/product-normalizer');

// Test perfumes
const TEST_PERFUMES = [
  'Chanel Coco Mademoiselle EDP 100ml',
  'Dior Sauvage EDT 100ml',
  'YSL Black Opium EDP 90ml',
  'Ariana Grande Cloud EDP 100ml',
  'Tom Ford Oud Wood EDP 100ml'
];

async function testGoogleShoppingAPI() {
  console.log(`\n${'#'.repeat(80)}`);
  console.log('🧪 TESTING GOOGLE SHOPPING API INTEGRATION');
  console.log(`${'#'.repeat(80)}\n`);

  // Check credentials
  console.log('📋 Checking Configuration...\n');
  
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY;
  const hasGoogleCX = !!process.env.GOOGLE_SHOPPING_CX;
  
  console.log(`   GOOGLE_API_KEY: ${hasGoogleKey ? '✅ Set' : '❌ Not set'}`);
  console.log(`   GOOGLE_SHOPPING_CX: ${hasGoogleCX ? '✅ Set' : '❌ Not set'}`);
  
  if (!hasGoogleKey || !hasGoogleCX) {
    console.log(`\n⚠️  WARNING: Google Shopping API not configured`);
    console.log(`   System will use web scraping only`);
    console.log(`   To enable API: Follow steps in GOOGLE_SHOPPING_API_SETUP.md\n`);
  } else {
    console.log(`\n✅ Google Shopping API configured!\n`);
  }

  // Initialize aggregator
  const aggregator = new HybridRetailerAggregator();
  const stats = aggregator.getStats();
  
  console.log('📊 System Configuration:');
  console.log(`   Google Shopping: ${stats.googleShoppingEnabled ? 'ENABLED ✅' : 'DISABLED ❌'}`);
  console.log(`   Web Scraping Adapters: ${stats.scrapingAdapters}`);
  console.log(`   Min Google Results: ${stats.minGoogleResults}`);
  console.log(`\n`);

  // Test each perfume
  const results = [];
  
  for (let i = 0; i < TEST_PERFUMES.length; i++) {
    const perfume = TEST_PERFUMES[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST ${i + 1}/${TEST_PERFUMES.length}: ${perfume}`);
    console.log(`${'='.repeat(80)}\n`);

    try {
      const normalized = normalizeProduct(perfume);
      const startTime = Date.now();
      
      const products = await aggregator.searchAllRetailers(normalized);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const retailers = new Set(products.map(p => p.retailer));
      
      results.push({
        perfume,
        success: products.length > 0,
        products: products.length,
        retailers: retailers.size,
        duration,
        topProducts: products.slice(0, 5)
      });
      
      console.log(`\n📊 RESULTS:`);
      console.log(`   Products Found: ${products.length}`);
      console.log(`   Unique Retailers: ${retailers.size}`);
      console.log(`   Duration: ${duration}s`);
      
      if (products.length > 0) {
        console.log(`\n   Top 5 Products:`);
        products.slice(0, 5).forEach((p, idx) => {
          console.log(`   ${idx + 1}. ${p.retailer} - ${p.name.substring(0, 60)}...`);
          console.log(`      Price: ${p.price || 'N/A'} | Confidence: ${p.confidence}% | Source: ${p.source || 'Web Scraping'}`);
        });
      }
      
    } catch (error) {
      console.error(`\n❌ ERROR: ${error.message}`);
      results.push({
        perfume,
        success: false,
        error: error.message
      });
    }
    
    // Small delay between tests
    if (i < TEST_PERFUMES.length - 1) {
      console.log(`\n⏳ Waiting 3 seconds before next test...`);
      await sleep(3000);
    }
  }

  // Final summary
  console.log(`\n\n${'#'.repeat(80)}`);
  console.log('📊 FINAL SUMMARY');
  console.log(`${'#'.repeat(80)}\n`);

  const successful = results.filter(r => r.success).length;
  const totalProducts = results.reduce((sum, r) => sum + (r.products || 0), 0);
  const avgProducts = totalProducts / results.length;
  const avgDuration = results.reduce((sum, r) => sum + parseFloat(r.duration || 0), 0) / results.length;
  
  console.log(`Tests Run: ${results.length}`);
  console.log(`Successful: ${successful}/${results.length} (${(successful/results.length*100).toFixed(1)}%)`);
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Avg Products/Search: ${avgProducts.toFixed(1)}`);
  console.log(`Avg Duration: ${avgDuration.toFixed(2)}s`);
  
  console.log(`\n📋 Per-Perfume Results:\n`);
  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${i + 1}. ${status} ${r.perfume}`);
    if (r.success) {
      console.log(`   ${r.products} products from ${r.retailers} retailers in ${r.duration}s`);
    } else {
      console.log(`   Error: ${r.error || 'No products found'}`);
    }
  });
  
  // Recommendations
  console.log(`\n\n💡 RECOMMENDATIONS:\n`);
  
  if (!hasGoogleKey || !hasGoogleCX) {
    console.log(`❌ Google Shopping API not configured`);
    console.log(`   → Follow GOOGLE_SHOPPING_API_SETUP.md to enable`);
    console.log(`   → Expected improvement: 10-15x more products, 15x faster\n`);
  } else {
    console.log(`✅ Google Shopping API is configured`);
    
    if (avgProducts < 10) {
      console.log(`⚠️  Average products (${avgProducts.toFixed(1)}) seems low`);
      console.log(`   → Check if API is working: see "Source" in results above`);
      console.log(`   → If no "Google Shopping API" sources, check credentials\n`);
    } else {
      console.log(`✅ System working great! ${avgProducts.toFixed(1)} products per search`);
      console.log(`✅ Average speed: ${avgDuration.toFixed(2)}s`);
      console.log(`\n🎉 Ready for production!\n`);
    }
  }
  
  console.log(`\n${'#'.repeat(80)}`);
  console.log('✅ TEST COMPLETE');
  console.log(`${'#'.repeat(80)}\n`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
testGoogleShoppingAPI()
  .then(() => {
    console.log('\n✅ All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
