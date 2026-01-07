// Real Perfume Product Database with Affiliate Links
// Update these with your actual Amazon Associate ID and ShareASale merchant IDs

const AMAZON_ASSOCIATE_ID = process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20'; // Amazon Associate ID (USA)
const AMAZON_ASSOCIATE_ID_CA = process.env.AMAZON_ASSOCIATE_TAG_CA || 'nota0c-20'; // Amazon Associate ID (Canada)
const SHARESALE_AFFILIATE_ID = process.env.SHARESALE_AFFILIATE_ID || 'your_sharesale_id'; // ShareASale affiliate ID

// Amazon marketplace configuration
const AMAZON_MARKETPLACES = {
  US: {
    domain: 'amazon.com',
    tag: AMAZON_ASSOCIATE_ID,
    name: 'USA'
  },
  CA: {
    domain: 'amazon.ca',
    tag: AMAZON_ASSOCIATE_ID_CA,
    name: 'Canada'
  }
};

// Database cleared - all perfumes will use generated search links
const perfumeDatabase = {};

// Helper function to normalize perfume names for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find perfume in database
function findPerfume(brand, name) {
  const searchKey = normalizeName(`${brand || ''} ${name || ''}`);
  
  // Try exact match first
  if (perfumeDatabase[searchKey]) {
    return perfumeDatabase[searchKey];
  }
  
  // Try partial matches
  for (const [key, perfume] of Object.entries(perfumeDatabase)) {
    if (searchKey.includes(key) || key.includes(searchKey)) {
      return perfume;
    }
  }
  
  return null;
}

// Generate Amazon search link based on country
function generateAmazonSearchLink(brand, name, country = 'US') {
  const marketplace = AMAZON_MARKETPLACES[country.toUpperCase()] || AMAZON_MARKETPLACES.US;
  const query = encodeURIComponent(`${brand} ${name} perfume eau de parfum`);
  return `https://www.${marketplace.domain}/s?k=${query}&tag=${marketplace.tag}`;
}

// Generate affiliate links for all marketplaces
function generateAllMarketplaceLinks(brand, name) {
  return {
    US: {
      platform: 'Amazon US',
      url: generateAmazonSearchLink(brand, name, 'US'),
      country: 'USA'
    },
    CA: {
      platform: 'Amazon Canada',
      url: generateAmazonSearchLink(brand, name, 'CA'),
      country: 'Canada'
    }
  };
}

// Export for use in server
module.exports = {
  perfumeDatabase,
  findPerfume,
  generateAmazonSearchLink,
  generateAllMarketplaceLinks,
  AMAZON_MARKETPLACES,
  AMAZON_ASSOCIATE_ID,
  AMAZON_ASSOCIATE_ID_CA,
  SHARESALE_AFFILIATE_ID
};
