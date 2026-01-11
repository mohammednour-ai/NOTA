/**
 * TEST GOOGLE SHOPPING API
 * Quick test to verify Google API is working
 */

require('dotenv').config();
const GoogleShoppingAdapter = require('./lib/google-shopping-adapter');
const { normalizeProduct } = require('./lib/product-normalizer');

async function testGoogleAPI() {
  console.log('\n🔍 Testing Google Shopping API...\n');

  // Check if API keys are configured
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchCX = process.env.GOOGLE_SHOPPING_CX;

  console.log('Environment Check:');
  if (apiKey) {
    const maskedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 3);
    console.log(`✅ Google API Key: Configured (${maskedKey})`);
  } else {
    console.log('❌ Google API Key: NOT configured');
  }

  if (searchCX) {
    const maskedCX = searchCX.substring(0, 10) + '...' + searchCX.substring(searchCX.length - 3);
    console.log(`✅ Google Search CX: Configured (${maskedCX})`);
  } else {
    console.log('❌ Google Search CX: NOT configured');
  }

  if (!apiKey || !searchCX) {
    console.log('\n⚠️  Please add these to your .env file:');
    console.log('   GOOGLE_API_KEY=your_api_key_here');
    console.log('   GOOGLE_SHOPPING_CX=your_search_engine_id_here');
    console.log('\n📖 See GOOGLE_API_SETUP_GUIDE.md for detailed instructions\n');
    return;
  }

  // Test search
  const testPerfumes = [
    'Dior Sauvage EDP 100ml',
    'Chanel Coco Mademoiselle EDP 100ml',
    'YSL Black Opium EDP 90ml'
  ];

  console.log('\n' + '='.repeat(60));
  
  for (const perfumeName of testPerfumes) {
    console.log(`\n📍 Searching for: ${perfumeName}`);
    console.log('-'.repeat(60));

    try {
      const normalized = normalizeProduct(perfumeName);
      console.log(`   Brand: ${normalized.brand}`);
      console.log(`   Line: ${normalized.line}`);
      console.log(`   Concentration: ${normalized.concentration}`);
      console.log(`   Size: ${normalized.size}ml\n`);

      const adapter = new GoogleShoppingAdapter();
      const results = await adapter.searchBothRegions(normalized);

      if (results.length === 0) {
        console.log('❌ No results found');
        console.log('   This might mean:');
        console.log('   - Search Engine not set to "Search entire web"');
        console.log('   - API key restrictions are too strict');
        console.log('   - Product name is too specific');
        continue;
      }

      console.log(`✅ TOTAL RESULTS: ${results.length} products found\n`);

      // Sort by confidence
      results.sort((a, b) => b.confidence - a.confidence);

      // Show top 5 results
      console.log('📦 Top Results:');
      results.slice(0, 5).forEach((product, index) => {
        console.log(`\n   ${index + 1}. ${product.name}`);
        console.log(`      Retailer: ${product.retailer}`);
        console.log(`      Price: ${product.price || 'Not available'}`);
        console.log(`      Confidence: ${product.confidence}%`);
        console.log(`      URL: ${product.url.substring(0, 60)}...`);
      });

      // Show retailer breakdown
      const retailers = {};
      results.forEach(r => {
        retailers[r.retailer] = (retailers[r.retailer] || 0) + 1;
      });
      
      console.log('\n   📊 Retailers Found:');
      Object.entries(retailers)
        .sort((a, b) => b[1] - a[1])
        .forEach(([retailer, count]) => {
          console.log(`      - ${retailer}: ${count} products`);
        });

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Details: ${error.response.data?.error?.message || 'Unknown error'}`);
        
        if (error.response.status === 403) {
          console.log('\n   💡 This usually means:');
          console.log('      - Custom Search API is not enabled in Google Cloud Console');
          console.log('      - API key restrictions are blocking the request');
          console.log('      - API key is invalid or expired');
        } else if (error.response.status === 429) {
          console.log('\n   💡 Daily quota exceeded (100 queries/day)');
          console.log('      - Wait until tomorrow');
          console.log('      - Or enable billing for higher limits');
        }
      }
    }

    console.log('\n' + '='.repeat(60));
  }

  console.log('\n🎉 Test complete!\n');
  console.log('Next Steps:');
  console.log('1. If you see results above, Google API is working! ✅');
  console.log('2. Start your server: node server.js');
  console.log('3. Open: http://localhost:3001');
  console.log('4. Complete the quiz and check the results page');
  console.log('5. You should see "Where to Buy" sections with direct links\n');
}

// Run test
testGoogleAPI().catch(error => {
  console.error('\n💥 Fatal error:', error.message);
  process.exit(1);
});
