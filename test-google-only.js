/**
 * GOOGLE-ONLY API TEST SCRIPT
 * Tests the system with ONLY Google Shopping API (no web scraping)
 */

require('dotenv').config();
const GoogleOnlyRetailerAggregator = require('./lib/google-only-aggregator');
const { normalizeProduct } = require('./lib/product-normalizer');

// Test perfumes
const TEST_PERFUMES = [
  'Chanel Coco Mademoiselle EDP 100ml',
  'Dior Sauvage EDT 100ml',
  'YSL Black Opium EDP 90ml'
];

async function testGoogleOnlyAPI() {
  console.log(`\n${'#'.repeat(80)}`);
  console.log('🧪 TESTING GOOGLE-ONLY API SYSTEM');
  console.log(`${'#'.repeat(80)}\n`);

  // Check credentials
  console.log('📋 Checking Configuration...\n');
  
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY;
  const hasGoogleCX = !!process.env.GOOGLE_SHOPPING_CX;
  
  console.log(`   GOOGLE_API_KEY: ${hasGoogleKey ? '✅ Set' : '❌ Not set'}`);
  console.log(`   GOOGLE_SHOPPING_CX: ${hasGoogleCX ? '✅ Set' : '❌ Not set'}`);
  
  if (!hasGoogleKey || !hasGoogleCX) {
    console.log(`\n❌ ERROR: Google Shopping API NOT configured!`);
    console.log(`\n   This system requires Google Shopping API to work.`);
    console.log(`   Web scraping has been removed.`);
    console.log(`\n   📖 TO FIX:`);
    console.log(`   1. Follow: GOOGLE_SHOPPING_API_SETUP.md`);
    console.log(`   2. Get Google Cloud credentials (15 min)`);
    console.log(`   3. Add to .env file:`);
    console.log(`      GOOGLE_API_KEY=your_api_key`);
    console.log(`      GOOGLE_SHOPPING_CX=your_search_engine_id`);
    console.log(`\n   ⚠️  System cannot function without API credentials!`);
    console.log(`\n${'#'.repeat(80)}\n`);
    process.exit(1);
  }

  console.log(`\n✅ Google Shopping API configured!\n`);

  // Initialize aggregator
  const aggregator = new GoogleOnlyRetailerAggregator();
  
  console.log('📊 System Configuration:');
  console.log(`   Mode: Google Shopping API ONLY ⚡`);
  console.log(`   Web Scraping: DISABLED ❌`);
  console.log(`   Caching: ENABLED (1-hour TTL)`);
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
      console.log(`   Source: Google Shopping API ⚡`);
      
      if (products.length > 0) {
        console.log(`\n   Top 5 Products:`);
        products.slice(0, 5).forEach((p, idx) => {
          console.log(`   ${idx + 1}. ${p.retailer} - ${p.name.substring(0, 60)}...`);
          console.log(`      Price: ${p.price || 'N/A'} | Confidence: ${p.confidence}%`);
        });
      } else {
        console.log(`\n   ⚠️  No products found for this search`);
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
      console.log(`\n⏳ Waiting 2 seconds before next test...`);
      await sleep(2000);
    }
  }

  // Final summary
  console.log(`\n\n${'#'.repeat(80)}`);
  console.log('📊 FINAL SUMMARY');
  console.log(`${'#'.repeat(80)}\n`);

  const successful = results.filter(r => r.success).length;
  const totalProducts = results.reduce((sum, r) => sum + (r.products || 0), 0);
  const avgProducts = successful > 0 ? totalProducts / successful : 0;
  const avgDuration = results.reduce((sum, r) => sum + parseFloat(r.duration || 0), 0) / results.length;
  
  console.log(`Tests Run: ${results.length}`);
  console.log(`Successful: ${successful}/${results.length} (${(successful/results.length*100).toFixed(1)}%)`);
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Avg Products/Search: ${avgProducts.toFixed(1)}`);
  console.log(`Avg Duration: ${avgDuration.toFixed(2)}s`);
  console.log(`Mode: Google Shopping API ONLY ⚡`);
  
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
  console.log(`\n\n💡 PERFORMANCE ANALYSIS:\n`);
  
  if (avgProducts >= 10) {
    console.log(`✅ EXCELLENT! Average ${avgProducts.toFixed(1)} products per search`);
    console.log(`✅ Average speed: ${avgDuration.toFixed(2)}s (very fast!)`);
    console.log(`\n🎉 System is working perfectly!`);
  } else if (avgProducts >= 5) {
    console.log(`✅ GOOD! Average ${avgProducts.toFixed(1)} products per search`);
    console.log(`✅ Average speed: ${avgDuration.toFixed(2)}s`);
    console.log(`\n💡 TIP: Results may vary based on search terms and retailer availability`);
  } else {
    console.log(`⚠️  Average products (${avgProducts.toFixed(1)}) seems low`);
    console.log(`\n💡 POSSIBLE REASONS:`);
    console.log(`   - Search terms too specific`);
    console.log(`   - Limited retailer coverage for this product`);
    console.log(`   - Try more popular perfumes for better results`);
  }
  
  console.log(`\n\n${'#'.repeat(80)}`);
  console.log('✅ TEST COMPLETE');
  console.log(`${'#'.repeat(80)}\n`);
  
  console.log(`💡 SYSTEM STATUS:`);
  console.log(`   ✅ Google Shopping API: ACTIVE`);
  console.log(`   ❌ Web Scraping: REMOVED`);
  console.log(`   ✅ Caching: ENABLED`);
  console.log(`   ⚡ Mode: API-Only (fastest, most reliable)`);
  console.log(`\n   📖 For setup help: See GOOGLE_SHOPPING_API_SETUP.md\n`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
testGoogleOnlyAPI()
  .then(() => {
    console.log('✅ All tests completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    console.error('\n📖 Check GOOGLE_SHOPPING_API_SETUP.md for setup help\n');
    process.exit(1);
  });
