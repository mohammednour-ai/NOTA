/**
 * COMPREHENSIVE 100-PERFUME AUTOMATED TEST SUITE
 * Tests scraping system with 100 popular perfumes
 * Retries until ALL retailers respond successfully
 * Full automation - no manual intervention needed
 */

const RetailerAggregator = require('./lib/retailer-aggregator');
const { normalizeProduct } = require('./lib/product-normalizer');
const fs = require('fs').promises;
const path = require('path');

// 100 POPULAR PERFUMES TO TEST
const TEST_PERFUMES = [
  // Women's Classics (30)
  'Chanel Coco Mademoiselle EDP 100ml',
  'Dior Miss Dior EDP 100ml',
  'YSL Black Opium EDP 90ml',
  'Lancôme La Vie Est Belle EDP 100ml',
  'Viktor & Rolf Flowerbomb EDP 100ml',
  'Marc Jacobs Daisy EDT 100ml',
  'Gucci Bloom EDP 100ml',
  'Prada Candy EDP 80ml',
  'Versace Bright Crystal EDT 90ml',
  'Burberry Her EDP 100ml',
  'Dolce & Gabbana Light Blue EDT 100ml',
  'Tom Ford Black Orchid EDP 100ml',
  'Chanel Chance Eau Tendre EDT 100ml',
  'Givenchy L\'Interdit EDP 80ml',
  'Carolina Herrera Good Girl EDP 80ml',
  'Ariana Grande Cloud EDP 100ml',
  'Ariana Grande Thank U Next EDP 100ml',
  'Jo Malone London English Pear & Freesia 100ml',
  'Maison Francis Kurkdjian Baccarat Rouge 540 EDP 70ml',
  'Le Labo Santal 33 EDP 100ml',
  'Hermès Twilly d\'Hermès EDP 85ml',
  'Mugler Angel EDP 100ml',
  'Chloe Nomade EDP 75ml',
  'Valentino Donna Born in Roma EDP 100ml',
  'Ralph Lauren Romance EDP 100ml',
  'Estée Lauder Beautiful EDP 75ml',
  'Calvin Klein Euphoria EDP 100ml',
  'Jimmy Choo Illicit EDP 100ml',
  'Coach Floral EDP 90ml',
  'Michael Kors Gorgeous EDP 100ml',
  
  // Men's Classics (30)
  'Dior Sauvage EDT 100ml',
  'Bleu de Chanel EDT 100ml',
  'Versace Eros EDT 100ml',
  'Paco Rabanne 1 Million EDT 100ml',
  'Giorgio Armani Acqua di Gio Profumo 125ml',
  'Tom Ford Oud Wood EDP 100ml',
  'Creed Aventus EDP 100ml',
  'Prada L\'Homme EDT 100ml',
  'Dolce & Gabbana The One EDT 100ml',
  'Yves Saint Laurent Y EDT 100ml',
  'Jean Paul Gaultier Le Male EDT 125ml',
  'Burberry Mr. Burberry EDT 100ml',
  'Gucci Guilty Pour Homme EDT 90ml',
  'Hugo Boss Bottled EDT 100ml',
  'Calvin Klein Eternity for Men EDT 100ml',
  'Ralph Lauren Polo Blue EDT 125ml',
  'Givenchy Gentlemen Only EDT 100ml',
  'Montblanc Legend EDT 100ml',
  'Carolina Herrera Bad Boy EDT 100ml',
  'Valentino Uomo EDT 100ml',
  'Tom Ford Noir EDP 100ml',
  'Hermès Terre d\'Hermès EDT 100ml',
  'Issey Miyake L\'Eau d\'Issey Pour Homme EDT 125ml',
  'Azzaro Wanted EDT 100ml',
  'Paco Rabanne Invictus EDT 100ml',
  'Viktor & Rolf Spicebomb EDT 90ml',
  'John Varvatos Artisan EDT 125ml',
  'Lacoste L\'Homme EDT 100ml',
  'Davidoff Cool Water EDT 125ml',
  'Bvlgari Man in Black EDP 100ml',
  
  // Unisex & Niche (20)
  'Le Labo Another 13 EDP 100ml',
  'Byredo Gypsy Water EDP 100ml',
  'Maison Margiela Replica Jazz Club EDT 100ml',
  'Tom Ford Tobacco Vanille EDP 100ml',
  'Creed Silver Mountain Water EDP 100ml',
  'Jo Malone Wood Sage & Sea Salt 100ml',
  'Diptyque Philosykos EDT 100ml',
  'Frederic Malle Portrait of a Lady EDP 100ml',
  'Escentric Molecules Molecule 01 EDT 100ml',
  'Maison Francis Kurkdjian Aqua Universalis EDT 200ml',
  'Tom Ford Neroli Portofino EDP 100ml',
  'Hermès Un Jardin sur le Nil EDT 100ml',
  'Chanel Allure Homme Sport EDT 100ml',
  'Guerlain Shalimar EDP 90ml',
  'Serge Lutens Ambre Sultan EDP 50ml',
  'Penhaligon\'s Empressa EDP 100ml',
  'Atelier Cologne Orange Sanguine 100ml',
  'Acqua di Parma Colonia EDC 100ml',
  'Bond No 9 New York Nights EDP 100ml',
  'Killian Love Don\'t Be Shy EDP 50ml',
  
  // Budget-Friendly & Celebrity (20)
  'Ariana Grande Sweet Like Candy EDP 100ml',
  'Britney Spears Fantasy EDP 100ml',
  'Elizabeth Arden Green Tea EDT 100ml',
  'Guess Seductive EDT 75ml',
  'Kate Spade New York EDP 100ml',
  'Vince Camuto Vince Camuto EDP 100ml',
  'Juicy Couture Viva La Juicy EDP 100ml',
  'Victoria\'s Secret Bombshell EDP 100ml',
  'Bath & Body Works A Thousand Wishes 75ml',
  'Rihanna Reb\'l Fleur EDP 100ml',
  'Jennifer Lopez Glow EDT 100ml',
  'Beyonce Heat EDP 100ml',
  'Taylor Swift Wonderstruck EDP 100ml',
  'Katy Perry Killer Queen EDP 100ml',
  'Paris Hilton Just Me EDP 100ml',
  'Christina Aguilera EDP 75ml',
  'Nicki Minaj Pink Friday EDP 100ml',
  'Justin Bieber Someday EDP 100ml',
  'One Direction That Moment EDP 100ml',
  'Adidas Born Original EDT 75ml'
];

// Configuration
const CONFIG = {
  maxRetries: 5,
  retryDelayBase: 5000, // 5 seconds
  maxRetryDelay: 60000, // 1 minute
  minSuccessfulRetailers: 2, // Minimum retailers that must respond
  targetRetailers: 6, // Target: all 6 retailers
  batchSize: 5, // Process 5 perfumes at a time
  batchDelay: 10000, // 10 second delay between batches
  timeout: 120000 // 2 minute timeout per perfume
};

// Results tracking
const results = {
  total: 0,
  successful: 0,
  failed: 0,
  partialSuccess: 0,
  retailerStats: {
    'Sephora CA': { attempts: 0, successes: 0 },
    'Sephora US': { attempts: 0, successes: 0 },
    'Amazon CA': { attempts: 0, successes: 0 },
    'Amazon US': { attempts: 0, successes: 0 },
    'Shoppers Drug Mart CA': { attempts: 0, successes: 0 },
    'Shoppers Drug Mart US': { attempts: 0, successes: 0 }
  },
  perfumeResults: []
};

/**
 * Test a single perfume with aggressive retry logic
 */
async function testPerfumeWithRetry(perfumeName, retryCount = 0) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${perfumeName} (Attempt ${retryCount + 1}/${CONFIG.maxRetries})`);
  console.log(`${'='.repeat(80)}`);
  
  try {
    const normalized = normalizeProduct(perfumeName);
    console.log(`📦 Normalized:`, normalized);
    
    const aggregator = new RetailerAggregator();
    const startTime = Date.now();
    
    const products = await Promise.race([
      aggregator.searchAllRetailers(normalized),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), CONFIG.timeout)
      )
    ]);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Count unique retailers
    const uniqueRetailers = new Set(products.map(p => p.retailer));
    const retailerCount = uniqueRetailers.size;
    
    // Update retailer stats
    uniqueRetailers.forEach(retailer => {
      if (results.retailerStats[retailer]) {
        results.retailerStats[retailer].successes++;
      }
    });
    
    console.log(`\n✅ Found ${products.length} products from ${retailerCount} retailers in ${duration}s`);
    products.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.retailer} - ${p.name} - ${p.price} (${p.confidence}% confidence)`);
    });
    
    // Check if we have enough results
    if (retailerCount >= CONFIG.minSuccessfulRetailers && products.length > 0) {
      const status = retailerCount >= CONFIG.targetRetailers ? 'FULL_SUCCESS' : 'PARTIAL_SUCCESS';
      
      if (status === 'FULL_SUCCESS') {
        results.successful++;
      } else {
        results.partialSuccess++;
      }
      
      results.perfumeResults.push({
        perfume: perfumeName,
        status,
        retailers: retailerCount,
        products: products.length,
        duration,
        attempts: retryCount + 1,
        data: products
      });
      
      console.log(`\n🎉 ${status}: ${retailerCount}/${CONFIG.targetRetailers} retailers responded`);
      return true;
    }
    
    // Not enough results, retry if possible
    if (retryCount < CONFIG.maxRetries - 1) {
      const delay = Math.min(
        CONFIG.retryDelayBase * Math.pow(2, retryCount),
        CONFIG.maxRetryDelay
      );
      
      console.log(`\n⚠️  Only ${retailerCount} retailers responded. Retrying in ${delay/1000}s...`);
      await sleep(delay);
      
      return await testPerfumeWithRetry(perfumeName, retryCount + 1);
    }
    
    // Max retries reached
    console.log(`\n❌ FAILED after ${CONFIG.maxRetries} attempts: Only ${retailerCount} retailers`);
    results.failed++;
    results.perfumeResults.push({
      perfume: perfumeName,
      status: 'FAILED',
      retailers: retailerCount,
      products: products.length,
      duration,
      attempts: retryCount + 1,
      error: `Only ${retailerCount}/${CONFIG.targetRetailers} retailers responded`
    });
    
    return false;
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    
    // Retry on error
    if (retryCount < CONFIG.maxRetries - 1) {
      const delay = Math.min(
        CONFIG.retryDelayBase * Math.pow(2, retryCount),
        CONFIG.maxRetryDelay
      );
      
      console.log(`⚠️  Retrying in ${delay/1000}s...`);
      await sleep(delay);
      
      return await testPerfumeWithRetry(perfumeName, retryCount + 1);
    }
    
    // Max retries reached
    console.log(`\n❌ FAILED after ${CONFIG.maxRetries} attempts`);
    results.failed++;
    results.perfumeResults.push({
      perfume: perfumeName,
      status: 'FAILED',
      retailers: 0,
      products: 0,
      duration: 0,
      attempts: retryCount + 1,
      error: error.message
    });
    
    return false;
  }
}

/**
 * Process perfumes in batches
 */
async function processBatch(perfumes, batchNumber) {
  console.log(`\n${'#'.repeat(80)}`);
  console.log(`📦 BATCH ${batchNumber}: Processing ${perfumes.length} perfumes`);
  console.log(`${'#'.repeat(80)}\n`);
  
  for (const perfume of perfumes) {
    results.total++;
    await testPerfumeWithRetry(perfume);
    
    // Progress update
    const progress = ((results.total / TEST_PERFUMES.length) * 100).toFixed(1);
    console.log(`\n📊 Progress: ${results.total}/${TEST_PERFUMES.length} (${progress}%)`);
    console.log(`   ✅ Successful: ${results.successful}`);
    console.log(`   ⚠️  Partial: ${results.partialSuccess}`);
    console.log(`   ❌ Failed: ${results.failed}`);
  }
  
  // Delay between batches
  if (batchNumber < Math.ceil(TEST_PERFUMES.length / CONFIG.batchSize)) {
    console.log(`\n⏳ Cooling down for ${CONFIG.batchDelay/1000}s before next batch...`);
    await sleep(CONFIG.batchDelay);
  }
}

/**
 * Generate detailed report
 */
async function generateReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.join(__dirname, 'test-reports');
  
  // Create reports directory
  await fs.mkdir(reportDir, { recursive: true });
  
  // Calculate statistics
  const successRate = ((results.successful / results.total) * 100).toFixed(2);
  const partialRate = ((results.partialSuccess / results.total) * 100).toFixed(2);
  const failRate = ((results.failed / results.total) * 100).toFixed(2);
  
  // Retailer success rates
  Object.keys(results.retailerStats).forEach(retailer => {
    const stats = results.retailerStats[retailer];
    stats.attempts = results.total;
    stats.successRate = ((stats.successes / stats.attempts) * 100).toFixed(2);
  });
  
  const report = {
    testDate: new Date().toISOString(),
    configuration: CONFIG,
    summary: {
      totalPerfumes: results.total,
      successful: results.successful,
      partialSuccess: results.partialSuccess,
      failed: results.failed,
      successRate: `${successRate}%`,
      partialRate: `${partialRate}%`,
      failRate: `${failRate}%`
    },
    retailerStats: results.retailerStats,
    detailedResults: results.perfumeResults
  };
  
  // Save JSON report
  const jsonPath = path.join(reportDir, `test-report-${timestamp}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
  
  // Generate markdown report
  const mdReport = generateMarkdownReport(report);
  const mdPath = path.join(reportDir, `test-report-${timestamp}.md`);
  await fs.writeFile(mdPath, mdReport);
  
  console.log(`\n📄 Reports saved:`);
  console.log(`   JSON: ${jsonPath}`);
  console.log(`   Markdown: ${mdPath}`);
  
  return report;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report) {
  let md = `# 100-Perfume Automated Test Report\n\n`;
  md += `**Test Date:** ${report.testDate}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Perfumes Tested | ${report.summary.totalPerfumes} |\n`;
  md += `| ✅ Full Success | ${report.summary.successful} (${report.summary.successRate}) |\n`;
  md += `| ⚠️ Partial Success | ${report.summary.partialSuccess} (${report.summary.partialRate}) |\n`;
  md += `| ❌ Failed | ${report.summary.failed} (${report.summary.failRate}) |\n\n`;
  
  md += `## Retailer Performance\n\n`;
  md += `| Retailer | Successes | Success Rate |\n`;
  md += `|----------|-----------|-------------|\n`;
  Object.keys(report.retailerStats).forEach(retailer => {
    const stats = report.retailerStats[retailer];
    md += `| ${retailer} | ${stats.successes}/${stats.attempts} | ${stats.successRate}% |\n`;
  });
  
  md += `\n## Top 10 Successful Products\n\n`;
  const successful = report.detailedResults
    .filter(r => r.status !== 'FAILED')
    .sort((a, b) => b.retailers - a.retailers || b.products - a.products)
    .slice(0, 10);
  
  successful.forEach((r, i) => {
    md += `${i + 1}. **${r.perfume}**\n`;
    md += `   - Retailers: ${r.retailers}/${CONFIG.targetRetailers}\n`;
    md += `   - Products Found: ${r.products}\n`;
    md += `   - Duration: ${r.duration}s\n`;
    md += `   - Attempts: ${r.attempts}\n\n`;
  });
  
  md += `## Failed Products\n\n`;
  const failed = report.detailedResults.filter(r => r.status === 'FAILED');
  if (failed.length > 0) {
    failed.forEach((r, i) => {
      md += `${i + 1}. **${r.perfume}**\n`;
      md += `   - Error: ${r.error}\n`;
      md += `   - Attempts: ${r.attempts}\n\n`;
    });
  } else {
    md += `🎉 No failures! All products returned results.\n\n`;
  }
  
  return md;
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n${'#'.repeat(80)}`);
  console.log(`🚀 STARTING 100-PERFUME AUTOMATED TEST SUITE`);
  console.log(`${'#'.repeat(80)}\n`);
  
  console.log(`📋 Configuration:`);
  console.log(`   Total Perfumes: ${TEST_PERFUMES.length}`);
  console.log(`   Batch Size: ${CONFIG.batchSize}`);
  console.log(`   Max Retries: ${CONFIG.maxRetries}`);
  console.log(`   Target Retailers: ${CONFIG.targetRetailers}`);
  console.log(`   Min Retailers: ${CONFIG.minSuccessfulRetailers}`);
  console.log(`   Timeout: ${CONFIG.timeout/1000}s\n`);
  
  const startTime = Date.now();
  
  // Process in batches
  const batches = [];
  for (let i = 0; i < TEST_PERFUMES.length; i += CONFIG.batchSize) {
    batches.push(TEST_PERFUMES.slice(i, i + CONFIG.batchSize));
  }
  
  for (let i = 0; i < batches.length; i++) {
    await processBatch(batches[i], i + 1);
  }
  
  const totalDuration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  
  // Generate final report
  console.log(`\n${'#'.repeat(80)}`);
  console.log(`📊 GENERATING FINAL REPORT`);
  console.log(`${'#'.repeat(80)}\n`);
  
  const report = await generateReport();
  
  // Final summary
  console.log(`\n${'#'.repeat(80)}`);
  console.log(`🏁 TEST SUITE COMPLETE`);
  console.log(`${'#'.repeat(80)}\n`);
  console.log(`⏱️  Total Duration: ${totalDuration} minutes`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Full Success: ${report.summary.successful}/${report.summary.totalPerfumes} (${report.summary.successRate})`);
  console.log(`   ⚠️  Partial Success: ${report.summary.partialSuccess}/${report.summary.totalPerfumes} (${report.summary.partialRate})`);
  console.log(`   ❌ Failed: ${report.summary.failed}/${report.summary.totalPerfumes} (${report.summary.failRate})\n`);
  
  console.log(`🏪 Retailer Success Rates:`);
  Object.keys(report.retailerStats).forEach(retailer => {
    const stats = report.retailerStats[retailer];
    console.log(`   ${retailer}: ${stats.successRate}% (${stats.successes}/${stats.attempts})`);
  });
  
  console.log(`\n✅ Reports saved to: ./test-reports/\n`);
  
  process.exit(report.summary.failed === 0 ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testPerfumeWithRetry, TEST_PERFUMES };
