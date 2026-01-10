const leven = require('leven');
const { normalizeBrand, normalizeConcentration, normalizeSize } = require('./product-normalizer');

/**
 * Validation Engine - Validates scraped products against expected product
 * Implements confidence scoring (0-100) and accessory rejection
 */

// Keywords that indicate accessories, samples, or unwanted items
const REJECT_KEYWORDS = [
  'sample', 'travel', 'mini', 'miniature', 'rollerball',
  'gift set', 'coffret', 'discovery set', 'vial', 'atomizer',
  'deluxe sample', 'sample size', 'travel size', 'purse spray',
  'refill', 'empty bottle', 'atomiser', 'decant',
  'collection', 'set of', 'piece set', 'gift box',
  'sampler', 'trial size', 'tester', 'travel spray'
];

// Keywords that indicate valid full-size products
const VALID_KEYWORDS = [
  'eau de parfum', 'eau de toilette', 'parfum', 'cologne',
  'edp', 'edt', 'spray', 'fragrance'
];

/**
 * Calculate confidence score for a scraped product
 * @param {Object} expected - Expected product details
 * @param {Object} scraped - Scraped product details
 * @returns {number} Confidence score 0-100
 */
function calculateConfidence(expected, scraped) {
  let score = 0;

  // Brand match (40 points)
  const expectedBrand = normalizeBrand(expected.brand || '');
  const scrapedBrand = normalizeBrand(scraped.brand || '');
  
  if (expectedBrand && scrapedBrand) {
    if (expectedBrand.toLowerCase() === scrapedBrand.toLowerCase()) {
      score += 40;
    } else if (scrapedBrand.toLowerCase().includes(expectedBrand.toLowerCase()) ||
               expectedBrand.toLowerCase().includes(scrapedBrand.toLowerCase())) {
      score += 30; // Partial brand match
    } else {
      // Use Levenshtein distance for fuzzy matching
      const distance = leven(expectedBrand.toLowerCase(), scrapedBrand.toLowerCase());
      if (distance <= 3) {
        score += 25;
      }
    }
  }

  // Product line match (30 points)
  const expectedLine = (expected.line || '').toLowerCase().trim();
  const scrapedName = (scraped.name || scraped.title || '').toLowerCase().trim();
  
  if (expectedLine && scrapedName) {
    // Exact match
    if (scrapedName === expectedLine) {
      score += 30;
    }
    // Contains expected line
    else if (scrapedName.includes(expectedLine)) {
      score += 30;
    }
    // Expected line contains scraped name
    else if (expectedLine.includes(scrapedName)) {
      score += 25;
    }
    // Fuzzy match using Levenshtein
    else {
      const distance = leven(expectedLine, scrapedName);
      if (distance <= 3) {
        score += 30;
      } else if (distance <= 5) {
        score += 20;
      } else if (distance <= 10) {
        score += 10;
      }
    }
  }

  // Concentration match (20 points)
  const expectedConc = normalizeConcentration(expected.concentration || '');
  const scrapedConc = normalizeConcentration(
    scraped.concentration || scraped.description || scraped.name || ''
  );
  
  if (expectedConc === scrapedConc) {
    score += 20;
  } else if (expectedConc && scrapedConc) {
    // Partial match (e.g., EDP vs EDT is still a perfume)
    if (['EDP', 'EDT', 'Parfum'].includes(expectedConc) && 
        ['EDP', 'EDT', 'Parfum'].includes(scrapedConc)) {
      score += 10; // Same category but different concentration
    }
  }

  // Size match (10 points)
  const expectedSize = expected.size || 100;
  const scrapedSize = normalizeSize(scraped.size || scraped.description || '');
  
  if (scrapedSize) {
    const sizeDifference = Math.abs(expectedSize - scrapedSize);
    
    if (sizeDifference === 0) {
      score += 10;
    } else if (sizeDifference <= 5) {
      score += 8; // Very close
    } else if (sizeDifference <= 10) {
      score += 5; // Somewhat close
    } else if (sizeDifference <= 20) {
      score += 2; // Different size but same product line
    }
  }

  return Math.min(100, score);
}

/**
 * Check if product is an accessory or unwanted item
 * @param {Object} product - Product to check
 * @returns {boolean} True if product should be rejected
 */
function isAccessory(product) {
  const text = [
    product.name || '',
    product.title || '',
    product.description || '',
    product.size || ''
  ].join(' ').toLowerCase();

  // Check for reject keywords
  for (const keyword of REJECT_KEYWORDS) {
    if (text.includes(keyword)) {
      return true;
    }
  }

  // Check if it's a very small size (likely a sample)
  const size = normalizeSize(text);
  if (size && size < 15) { // Less than 15ml is likely a sample
    return true;
  }

  return false;
}

/**
 * Validate a scraped product against expected product
 * @param {Object} expected - Expected product details
 * @param {Object} scraped - Scraped product details
 * @returns {Object} Validation result with confidence and rejection reason
 */
function validateProduct(expected, scraped) {
  // Check if it's an accessory first
  if (isAccessory(scraped)) {
    return {
      valid: false,
      confidence: 0,
      reason: 'Rejected: Product is an accessory, sample, or gift set',
      scraped
    };
  }

  // Calculate confidence score
  const confidence = calculateConfidence(expected, scraped);

  // Check if confidence meets threshold (80+)
  if (confidence < 80) {
    return {
      valid: false,
      confidence,
      reason: `Rejected: Confidence score ${confidence} below threshold of 80`,
      scraped
    };
  }

  return {
    valid: true,
    confidence,
    scraped
  };
}

/**
 * Validate multiple products and return only valid ones
 * @param {Object} expected - Expected product details
 * @param {Array} scrapedProducts - Array of scraped products
 * @returns {Array} Array of valid products with confidence scores
 */
function validateProducts(expected, scrapedProducts) {
  if (!Array.isArray(scrapedProducts)) {
    return [];
  }

  const validations = scrapedProducts.map(scraped => 
    validateProduct(expected, scraped)
  );

  // Return only valid products, sorted by confidence (highest first)
  return validations
    .filter(v => v.valid)
    .map(v => ({
      ...v.scraped,
      confidence: v.confidence
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

/**
 * Check if a product name is valid (not obviously wrong)
 * @param {string} name - Product name
 * @returns {boolean} True if name seems valid
 */
function isValidProductName(name) {
  if (!name || typeof name !== 'string') return false;
  
  // Too short
  if (name.trim().length < 3) return false;
  
  // All numbers
  if (/^\d+$/.test(name.trim())) return false;
  
  // Contains at least one letter
  if (!/[a-zA-Z]/.test(name)) return false;
  
  return true;
}

/**
 * Normalize scraped product data
 * @param {Object} product - Raw scraped product
 * @returns {Object} Normalized product
 */
function normalizeScrapedProduct(product) {
  return {
    brand: product.brand || '',
    name: product.name || product.title || '',
    description: product.description || '',
    price: product.price || '',
    size: product.size || '',
    url: product.url || '',
    image: product.image || '',
    retailer: product.retailer || '',
    country: product.country || '',
    availability: product.availability || 'unknown'
  };
}

module.exports = {
  calculateConfidence,
  isAccessory,
  validateProduct,
  validateProducts,
  isValidProductName,
  normalizeScrapedProduct,
  REJECT_KEYWORDS,
  VALID_KEYWORDS
};
