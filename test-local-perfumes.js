/**
 * LOCAL PERFUME TEST - QUICK VALIDATION
 * Tests with a smaller, curated list of perfumes
 * Focus on quality over quantity
 */

const RetailerAggregator = require('./lib/retailer-aggregator');
const { normalizeProduct } = require('./lib/product-normalizer');
const fs = require('fs').promises;
const path = require('path');

// CURATED LIST OF 20 POPULAR PERFUMES FOR TESTING
const LOCAL_PERFUMES = [
  // Women's Popular (10)
  'Chanel Coco Mademoiselle EDP 100ml',
  'Dior Miss Dior EDP 100ml',
  'YSL Black Opium EDP 90ml',
  'Lancôme La Vie Est Belle EDP 100ml',
  'Viktor & Rolf Flowerbomb EDP 100ml',
  'Ariana Grande Cloud EDP 100ml',
  'Marc Jacobs Daisy EDT 100ml',
  'Gucci Bloom EDP 100ml',
  'Versace Bright Crystal EDT 90ml',
  'Dolce & Gabbana Light Blue EDT 100ml',
  
  // Men's Popular (10)
  'Dior Sauvage EDT 100ml',
  'Bleu de Chanel EDT 100ml',
  'Versace Eros EDT 100ml',
  'Paco Rabanne 1 Million EDT 100ml',
  'Giorgio Armani Acqua di Gio Profumo 125ml',
  'Tom Ford Oud Wood EDP 100ml',
  'Prada L\'Homme EDT 100ml',
  'Jean Paul Gaultier Le Male EDT 125ml',
  'Hugo Boss Bottled EDT 100ml',
  'Calvin Klein Eternity for Men EDT 100ml'
];

// Configuration
const CONFIG = {
  maxRetries: 3,              // 3 retries instead of 5 (faster)
  retryDelayBase: 5000,       // 5 seconds
  maxRetryDelay: 30000,       // 30s max (was 60s)
  minSuccessfulRetailers: 2,  // Need 2+ retailers
  targetRetailers: 6,         // Goal: all 6
  batchSize: 5,               // 5 at a time
  batchDelay: 5000,           // 5s between batches (was 10s)
  timeout: 90000              // 90s timeout (was 120s)
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
 * Test a single perfume with retry logic
 */
async function testPerfumeWithRetry(perfumeName, retryCount = 0) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${perfumeName} (Attempt ${retryCount + 1}/${CONFIG.maxRetries})`);
  console.log(`${'='.repeat(80)}`);
  
  try {
    const normalized = normalizeProduct(perfumeName);
    console.log(`📦 Normalized:`, JSON.stringify(normalized, null, 2));
    
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
      console.log(`   ${i + 1}. ${p.retailer} - ${p.name} - ${p.price || 'N/A'} (${p.confidence}% confidence)`);
    });
    
    // Check if we have enough results
    if (retailerCount >= CONFIG.minSuccessfulRetailers && products.length > 0) {
      const status = retailerCount >= CONFIG.targetRetailers ? 'FULL_SUCCESS' : 'PARTIAL_SUCCESS';
      
      if (status === 'FULL_SUCCESS') {
        results.successful++;
        console.log(`\n🎉 FULL SUCCESS: ${retailerCount}/${CONFIG.targetRetailers} retailers responded!`);
      } else {
        results.partialSuccess++;
        console.log(`\n⚠️  PARTIAL SUCCESS: ${retailerCount}/${CONFIG.targetRetailers} retailers responded`);
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
    console.log(`\n❌ FAILED after ${CONFIG.maxRetries} attempts: Only ${retailerCount}/${CONFIG.targetRetailers} retailers`);
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
    const progress = ((results.total / LOCAL_PERFUMES.length) * 100).toFixed(1);
    console.log(`\n📊 Progress: ${results.total}/${LOCAL_PERFUMES.length} (${progress}%)`);
    console.log(`   ✅ Successful: ${results.successful}`);
    console.log(`   ⚠️  Partial: ${results.partialSuccess}`);
    console.log(`   ❌ Failed: ${results.failed}`);
  }
  
  // Delay between batches
  if (batchNumber < Math.ceil(LOCAL_PERFUMES.length / CONFIG.batchSize)) {
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
    testType: 'Local Perfume Test (20 perfumes)',
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
  const jsonPath = path.join(reportDir, `local-test-${timestamp}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
  
  // Generate markdown report
  const mdReport = generateMarkdownReport(report);
  const mdPath = path.join(reportDir, `local-test-${timestamp}.md`);
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
  let md = `# Local Perfume Test Report (20 Perfumes)\n\n`;
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
  
  md += `\n## Detailed Results\n\n`;
  report.detailedResults.forEach((r, i) => {
    const emoji = r.status === 'FULL_SUCCESS' ? '✅' : r.status === 'PARTIAL_SUCCESS' ? '⚠️' : '❌';
    md += `${i + 1}. ${emoji} **${r.perfume}**\n`;
    md += `   - Status: ${r.status}\n`;
    md += `   - Retailers: ${r.retailers}/${CONFIG.targetRetailers}\n`;
    md += `   - Products: ${r.products}\n`;
    md += `   - Duration: ${r.duration}s\n`;
    md += `   - Attempts: ${r.attempts}\n\n`;
  });
  
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
  console.log(`🚀 STARTING LOCAL PERFUME TEST (20 Popular Perfumes)`);
  console.log(`${'#'.repeat(80)}\n`);
  
  console.log(`📋 Configuration:`);
  console.log(`   Total Perfumes: ${LOCAL_PERFUMES.length}`);
  console.log(`   Batch Size: ${CONFIG.batchSize}`);
  console.log(`   Max Retries: ${CONFIG.maxRetries}`);
  console.log(`   Target Retailers: ${CONFIG.targetRetailers}`);
  console.log(`   Min Retailers: ${CONFIG.minSuccessfulRetailers}`);
  console.log(`   Timeout: ${CONFIG.timeout/1000}s`);
  console.log(`   ✅ Confidence Threshold: 70% (FIXED!)\n`);
  
  const startTime = Date.now();
  
  // Process in batches
  const batches = [];
  for (let i = 0; i < LOCAL_PERFUMES.length; i += CONFIG.batchSize) {
    batches.push(LOCAL_PERFUMES.slice(i, i + CONFIG.batchSize));
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
  console.log(`🏁 TEST COMPLETE`);
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

module.exports = { testPerfumeWithRetry, LOCAL_PERFUMES };
