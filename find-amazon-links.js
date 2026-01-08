#!/usr/bin/env node

/**
 * Interactive Amazon Affiliate Link Finder
 * 
 * This script helps you quickly find and generate Amazon affiliate links
 * for your perfume database.
 * 
 * Usage:
 *   node find-amazon-links.js
 * 
 * Or add products to the list below and run the script.
 */

require('dotenv').config();
const readline = require('readline');
const { generateAmazonLink, generateSearchLink, extractASIN } = require('./amazon-link-generator');

const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20';

// Products you want to find links for
const productsToFind = [
  'Ariana Grande Cloud Eau de Parfum',
  'Billie Eilish Perfume',
  'Viktor & Rolf Flowerbomb',
  'Marc Jacobs Daisy',
  'Tom Ford Black Orchid',
  'Chanel Coco Mademoiselle',
  'Dior Sauvage',
  'YSL Black Opium',
  'Versace Bright Crystal',
  'Sol de Janeiro Brazilian Crush 62'
];

console.log('🔍 Amazon Affiliate Link Finder');
console.log('================================\n');
console.log(`Using affiliate tag: ${AMAZON_ASSOCIATE_TAG}\n`);
console.log('📝 Instructions:');
console.log('1. Copy each search link below');
console.log('2. Paste in your browser');
console.log('3. Find the product you want');
console.log('4. Copy the product URL');
console.log('5. Paste it back here to convert to affiliate link\n');
console.log('─────────────────────────────────────────────────\n');

// Generate search links for each product
productsToFind.forEach((product, index) => {
  const searchLink = generateSearchLink(product);
  console.log(`${index + 1}. ${product}`);
  console.log(`   Search: ${searchLink}\n`);
});

console.log('─────────────────────────────────────────────────\n');
console.log('💡 Quick Method:');
console.log('If you already have Amazon URLs, paste them below:\n');

// Interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let urlCount = 0;
const maxUrls = 10;

function promptForUrl() {
  if (urlCount >= maxUrls) {
    console.log('\n✅ Done! Check the output above for your affiliate links.');
    rl.close();
    return;
  }
  
  rl.question(`\nPaste Amazon URL #${urlCount + 1} (or press Enter to skip): `, (url) => {
    url = url.trim();
    
    if (!url) {
      console.log('\n✅ Finished processing URLs.');
      rl.close();
      return;
    }
    
    const asin = extractASIN(url);
    
    if (asin) {
      const affiliateLink = generateAmazonLink(asin);
      console.log(`\n✅ Success!`);
      console.log(`   ASIN: ${asin}`);
      console.log(`   Affiliate Link: ${affiliateLink}`);
      console.log(`   \n   Copy this for your database:`);
      console.log(`   amazon: '${affiliateLink}',`);
      urlCount++;
      promptForUrl();
    } else {
      console.log(`\n❌ Could not extract ASIN from URL. Please try again.`);
      promptForUrl();
    }
  });
}

// Start interactive mode if running directly
if (require.main === module) {
  console.log('═════════════════════════════════════════════════');
  console.log('\nReady to convert URLs! Paste an Amazon product URL:\n');
  promptForUrl();
}

// Handle exit
rl.on('close', () => {
  console.log('\n\nThank you for using Amazon Link Finder! 🚀\n');
  process.exit(0);
});
