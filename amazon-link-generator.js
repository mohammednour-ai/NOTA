// Amazon Product Link Generator
// This script helps you automatically generate affiliate links

require('dotenv').config();
const axios = require('axios');

const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20';

/**
 * Generate Amazon affiliate link from ASIN
 */
function generateAmazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Generate Amazon search link with affiliate tag
 */
function generateSearchLink(query) {
  const searchQuery = encodeURIComponent(query);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Extract ASIN from Amazon URL
 */
function extractASIN(url) {
  // Matches various Amazon URL formats
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /ASIN[=:]([A-Z0-9]{10})/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Batch generate affiliate links
 */
function batchGenerateLinks(products) {
  const results = [];
  
  products.forEach(product => {
    let link;
    
    if (product.asin) {
      // If ASIN provided, generate direct link
      link = generateAmazonLink(product.asin);
    } else if (product.url) {
      // If URL provided, extract ASIN and generate link
      const asin = extractASIN(product.url);
      link = asin ? generateAmazonLink(asin) : null;
    } else if (product.name) {
      // If only name provided, generate search link
      link = generateSearchLink(product.name);
    }
    
    results.push({
      name: product.name,
      asin: product.asin || (product.url ? extractASIN(product.url) : null),
      affiliateLink: link,
      status: link ? 'success' : 'failed'
    });
  });
  
  return results;
}

/**
 * Validate Amazon affiliate link
 */
async function validateLink(url) {
  try {
    const response = await axios.head(url, { 
      maxRedirects: 5,
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Test and validate multiple links
 */
async function testLinks(links) {
  const results = [];
  
  for (const link of links) {
    const isValid = await validateLink(link);
    results.push({
      link,
      valid: isValid,
      status: isValid ? '✅ Valid' : '❌ Invalid'
    });
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Example usage
const exampleProducts = [
  {
    name: 'Ariana Grande Cloud',
    asin: 'B07QPKQNP1' // Replace with correct ASIN
  },
  {
    name: 'Billie Eilish Perfume',
    url: 'https://www.amazon.com/dp/B09JKQM5LX'
  },
  {
    name: 'Marc Jacobs Daisy',
    asin: 'B000C1XOJ8'
  }
];

// Generate links
if (require.main === module) {
  console.log('🔗 Amazon Affiliate Link Generator\n');
  console.log(`Using affiliate tag: ${AMAZON_ASSOCIATE_TAG}\n`);
  
  const results = batchGenerateLinks(exampleProducts);
  
  console.log('Generated Links:');
  console.log('================\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}`);
    console.log(`   ASIN: ${result.asin || 'N/A'}`);
    console.log(`   Link: ${result.affiliateLink}`);
    console.log(`   Status: ${result.status}\n`);
  });
  
  console.log('\n💡 To test these links, run: node amazon-link-generator.js --test');
}

module.exports = {
  generateAmazonLink,
  generateSearchLink,
  extractASIN,
  batchGenerateLinks,
  validateLink,
  testLinks
};
