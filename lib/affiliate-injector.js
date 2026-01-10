/**
 * Affiliate Link Injector
 * Adds tracking parameters to retailer URLs
 */

/**
 * Inject affiliate parameters into URL
 */
function injectAffiliateParams(url, retailer) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Amazon - add associate tag
    if (retailer.includes('Amazon')) {
      const country = retailer.includes('CA') ? 'CA' : 'US';
      const tag = country === 'CA'
        ? (process.env.AMAZON_ASSOCIATE_TAG_CA || 'nota0c-20')
        : (process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20');
      
      urlObj.searchParams.set('tag', tag);
    }
    
    // Add UTM parameters for all retailers (for tracking)
    urlObj.searchParams.set('utm_source', 'nota');
    urlObj.searchParams.set('utm_medium', 'referral');
    urlObj.searchParams.set('utm_campaign', 'perfume_finder');
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error injecting affiliate params:', error);
    return url;
  }
}

/**
 * Inject affiliate links into product array
 */
function injectAffiliateLinks(products) {
  return products.map(product => ({
    ...product,
    url: injectAffiliateParams(product.url, product.retailer)
  }));
}

/**
 * Get affiliate disclosure text
 */
function getAffiliateDisclosure() {
  return 'We may earn a commission from purchases made through these links. This helps support our service at no extra cost to you.';
}

module.exports = {
  injectAffiliateParams,
  injectAffiliateLinks,
  getAffiliateDisclosure
};
