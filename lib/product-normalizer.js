const crypto = require('crypto');

/**
 * Product Normalizer - Extracts and normalizes perfume product information
 * Handles brand, line, concentration, and size normalization
 */

// Common brand variations and normalizations
const BRAND_VARIATIONS = {
  'ysl': 'Yves Saint Laurent',
  'yves saint laurent': 'Yves Saint Laurent',
  'saint laurent': 'Yves Saint Laurent',
  'tom ford': 'Tom Ford',
  'tf': 'Tom Ford',
  'chanel': 'Chanel',
  'CHANEL': 'Chanel',
  'dior': 'Dior',
  'christian dior': 'Dior',
  'viktor & rolf': 'Viktor & Rolf',
  'viktor and rolf': 'Viktor & Rolf',
  'ariana grande': 'Ariana Grande',
  'ariana': 'Ariana Grande',
  'marc jacobs': 'Marc Jacobs',
  'jo malone': 'Jo Malone',
  'jo malone london': 'Jo Malone',
  'le labo': 'Le Labo',
  'maison margiela': 'Maison Margiela',
  'maison francis kurkdjian': 'Maison Francis Kurkdjian',
  'mfk': 'Maison Francis Kurkdjian',
  'versace': 'Versace',
  'gucci': 'Gucci',
  'prada': 'Prada',
  'burberry': 'Burberry',
  'dolce & gabbana': 'Dolce & Gabbana',
  'dolce and gabbana': 'Dolce & Gabbana',
  'd&g': 'Dolce & Gabbana',
  'givenchy': 'Givenchy',
  'lancome': 'Lancôme',
  'lancôme': 'Lancôme',
  'giorgio armani': 'Giorgio Armani',
  'armani': 'Giorgio Armani',
  'paco rabanne': 'Paco Rabanne'
};

// Concentration normalizations
const CONCENTRATION_MAP = {
  'eau de parfum': 'EDP',
  'edp': 'EDP',
  'e.d.p': 'EDP',
  'e.d.p.': 'EDP',
  'eau de toilette': 'EDT',
  'edt': 'EDT',
  'e.d.t': 'EDT',
  'e.d.t.': 'EDT',
  'parfum': 'Parfum',
  'extrait de parfum': 'Parfum',
  'cologne': 'Cologne',
  'eau de cologne': 'Cologne',
  'edc': 'Cologne',
  'eau fraiche': 'Eau Fraiche',
  'body mist': 'Body Mist'
};

/**
 * Normalize brand name
 */
function normalizeBrand(text) {
  if (!text) return '';
  const cleaned = text.toLowerCase().trim();
  return BRAND_VARIATIONS[cleaned] || text.trim();
}

/**
 * Normalize concentration (EDP, EDT, etc.)
 */
function normalizeConcentration(text) {
  if (!text) return 'EDP'; // Default to EDP
  
  const cleaned = text.toLowerCase().trim();
  
  // Check exact matches first
  if (CONCENTRATION_MAP[cleaned]) {
    return CONCENTRATION_MAP[cleaned];
  }
  
  // Check if text contains any concentration keywords
  for (const [key, value] of Object.entries(CONCENTRATION_MAP)) {
    if (cleaned.includes(key)) {
      return value;
    }
  }
  
  return 'EDP'; // Default
}

/**
 * Normalize size - convert oz to ml
 */
function normalizeSize(text) {
  if (!text) return 100; // Default 100ml
  
  // Try to extract oz and convert to ml
  const ozMatch = text.match(/(\d+\.?\d*)\s*oz/i);
  if (ozMatch) {
    const oz = parseFloat(ozMatch[1]);
    return Math.round(oz * 29.5735);
  }
  
  // Try to extract ml directly
  const mlMatch = text.match(/(\d+)\s*ml/i);
  if (mlMatch) {
    return parseInt(mlMatch[1]);
  }
  
  // Common size mappings
  if (text.includes('3.4')) return 100;
  if (text.includes('1.7')) return 50;
  if (text.includes('1.0')) return 30;
  if (text.includes('0.5')) return 15;
  
  return 100; // Default
}

/**
 * Extract brand from product string
 */
function extractBrand(productString) {
  if (!productString) return '';
  
  // Try to match known brands at the start of the string
  const lowerStr = productString.toLowerCase();
  
  for (const [key, value] of Object.entries(BRAND_VARIATIONS)) {
    if (lowerStr.startsWith(key) || lowerStr.includes(key)) {
      return value;
    }
  }
  
  // Fallback: take first word/words before concentration or size
  const words = productString.split(/\s+/);
  if (words.length > 0) {
    // Return first 1-3 words as brand (common pattern)
    return words.slice(0, Math.min(3, words.length)).join(' ');
  }
  
  return productString.split(' ')[0] || '';
}

/**
 * Extract product line from product string
 */
function extractProductLine(productString, brand) {
  if (!productString) return '';
  
  let line = productString;
  
  // Remove brand from string
  if (brand) {
    line = line.replace(new RegExp(brand, 'gi'), '').trim();
  }
  
  // Remove concentration keywords
  Object.keys(CONCENTRATION_MAP).forEach(conc => {
    line = line.replace(new RegExp(conc, 'gi'), '');
  });
  
  // Remove size information
  line = line.replace(/\d+\.?\d*\s*(ml|oz)/gi, '');
  
  // Remove common words
  line = line.replace(/\b(perfume|fragrance|spray|for|women|men|unisex)\b/gi, '');
  
  // Clean up extra spaces and punctuation
  line = line.replace(/\s+/g, ' ').trim();
  line = line.replace(/^[-\s]+|[-\s]+$/g, '');
  
  return line;
}

/**
 * Generate unique hash for product
 */
function generateHash(brand, line, concentration, size) {
  const normalized = [
    normalizeBrand(brand),
    line.toLowerCase().trim(),
    normalizeConcentration(concentration),
    size.toString()
  ].join('_');
  
  // Create a readable hash
  const cleanStr = normalized
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_');
  
  return cleanStr;
}

/**
 * Main normalization function
 */
function normalizeProduct(productString) {
  if (!productString || typeof productString !== 'string') {
    throw new Error('Product string is required and must be a string');
  }
  
  // Extract components
  const brand = extractBrand(productString);
  const concentration = normalizeConcentration(productString);
  const size = normalizeSize(productString);
  const line = extractProductLine(productString, brand);
  
  // Generate unique ID for caching
  const normalizedId = generateHash(brand, line, concentration, size);
  
  return {
    brand,
    line,
    concentration,
    size,
    normalizedId,
    original: productString
  };
}

/**
 * Convert oz to ml
 */
function ozToMl(oz) {
  return Math.round(oz * 29.5735);
}

/**
 * Convert ml to oz
 */
function mlToOz(ml) {
  return Math.round((ml / 29.5735) * 100) / 100;
}

module.exports = {
  normalizeProduct,
  normalizeBrand,
  normalizeConcentration,
  normalizeSize,
  extractBrand,
  extractProductLine,
  generateHash,
  ozToMl,
  mlToOz,
  BRAND_VARIATIONS,
  CONCENTRATION_MAP
};
