// Real Perfume Product Database with Affiliate Links
// Update these with your actual Amazon Associate ID and ShareASale merchant IDs

const AMAZON_ASSOCIATE_ID = 'youraffiliateID-20'; // Replace with your Amazon Associate ID
const SHARESALE_AFFILIATE_ID = 'your_sharesale_id'; // Replace with your ShareASale affiliate ID

const perfumeDatabase = {
  // Gen-Z & Young Trending
  'ariana grande cloud': {
    brand: 'Ariana Grande',
    name: 'Cloud',
    price: '$39-65',
    image: 'https://m.media-amazon.com/images/I/61vqT7YqCzL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B07QPKQNP1?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/cloud-eau-de-parfum-P455749',
      ulta: 'https://www.ulta.com/p/cloud-eau-de-parfum-pimprod2010181'
    },
    notes: ['Lavender', 'Pear', 'Coconut', 'Vanilla', 'Praline'],
    description: 'Dreamy, sweet, and addictive cloud-inspired fragrance'
  },
  
  'billie eilish': {
    brand: 'Billie Eilish',
    name: 'Eilish',
    price: '$42-68',
    image: 'https://m.media-amazon.com/images/I/71qJNHgKZrL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B09JKQM5LX?tag=${AMAZON_ASSOCIATE_ID}`,
      ulta: 'https://www.ulta.com/p/eilish-eau-de-parfum-pimprod2027925'
    },
    notes: ['Mandarin', 'Red Berries', 'Vanilla', 'Amber', 'Musk'],
    description: 'Warm, cozy, and captivating signature scent'
  },

  'sol de janeiro 71': {
    brand: 'Sol de Janeiro',
    name: 'Brazilian Crush Cheirosa 71',
    price: '$38',
    image: 'https://m.media-amazon.com/images/I/61xT0RqLjuL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B0CBRP8MDN?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/brazilian-crush-cheirosa-71-hair-body-fragrance-mist-P505842'
    },
    notes: ['Caramel', 'Sea Salt', 'Vanilla', 'Macadamia'],
    description: 'Beachy, caramel-vanilla irresistible scent'
  },

  // Professional/Sophisticated
  'tom ford oud wood': {
    brand: 'Tom Ford',
    name: 'Oud Wood',
    price: '$150-350',
    image: 'https://m.media-amazon.com/images/I/61w8vI1RXSL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B000P26B8C?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/oud-wood-P393023',
      nordstrom: 'https://www.nordstrom.com/s/tom-ford-private-blend-oud-wood-eau-de-parfum/3261143'
    },
    notes: ['Oud', 'Sandalwood', 'Rosewood', 'Cardamom', 'Amber'],
    description: 'Luxurious woody oriental fragrance with rare oud'
  },

  'le labo santal 33': {
    brand: 'Le Labo',
    name: 'Santal 33',
    price: '$152-340',
    image: 'https://cdn.scentbird.com/products/37a4c90e-8f31-4fc5-9532-f03cfe4ea93b.png',
    links: {
      sephora: 'https://www.sephora.com/product/santal-33-P421537',
      nordstrom: 'https://www.nordstrom.com/s/le-labo-santal-33-eau-de-parfum/4756086',
      official: 'https://www.lelabofragrances.com/santal-33-21.html'
    },
    notes: ['Sandalwood', 'Cedarwood', 'Cardamom', 'Iris', 'Violet'],
    description: 'Iconic unisex woody fragrance loved by celebrities'
  },

  'maison margiela replica': {
    brand: 'Maison Margiela',
    name: 'REPLICA By the Fireplace',
    price: '$85-165',
    image: 'https://m.media-amazon.com/images/I/71rh3YQpGNL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B00JWVHFZ0?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/replica-by-the-fireplace-P428240'
    },
    notes: ['Chestnut', 'Cashmeran', 'Vanilla', 'Guaiac Wood'],
    description: 'Warm, cozy fireplace-inspired scent'
  },

  // Elegant/Luxury
  'chanel no 5': {
    brand: 'Chanel',
    name: 'No. 5 Eau de Parfum',
    price: '$120-230',
    image: 'https://www.chanel.com/images/q_auto,f_auto,fl_lossy,dpr_1.1/w_1920/no-5-eau-de-parfum-spray-3-4fl-oz--packshot-default-126550-9527621017630.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B000C214CO?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/no-5-eau-de-parfum-spray-P157409',
      official: 'https://www.chanel.com/us/fragrance/p/126550/n5-eau-de-parfum-spray/'
    },
    notes: ['Aldehydes', 'Ylang-Ylang', 'Jasmine', 'Rose', 'Sandalwood'],
    description: 'Timeless iconic floral aldehyde fragrance'
  },

  'dior jadore': {
    brand: 'Dior',
    name: "J'adore Eau de Parfum",
    price: '$120-180',
    image: 'https://m.media-amazon.com/images/I/61N8a3qHSJL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B000C216Y6?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/j-adore-eau-de-parfum-P167091',
      official: 'https://www.dior.com/en_us/beauty/products/Y0996010-jadore-eau-de-parfum'
    },
    notes: ['Ylang-Ylang', 'Rose', 'Jasmine', 'Orchid'],
    description: 'Luminous floral bouquet of femininity'
  },

  'lancome la vie est belle': {
    brand: 'Lancôme',
    name: 'La Vie Est Belle',
    price: '$120-162',
    image: 'https://m.media-amazon.com/images/I/71TJ6vqYJNL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B00B3MCRIQ?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/la-vie-est-belle-P378284',
      ulta: 'https://www.ulta.com/p/la-vie-est-belle-eau-de-parfum-xlsImpprod11061199'
    },
    notes: ['Iris', 'Patchouli', 'Gourmand', 'Tonka Bean', 'Praline'],
    description: 'Sweet iris and gourmand happiness fragrance'
  },

  // Clean/Hypoallergenic
  'clean reserve': {
    brand: 'Clean Reserve',
    name: 'Rain',
    price: '$48-98',
    image: 'https://m.media-amazon.com/images/I/71qXm0z6ypL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B074QBBM1T?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/rain-P426459',
      ulta: 'https://www.ulta.com/p/rain-eau-de-parfum-pimprod2013783'
    },
    notes: ['Bergamot', 'Melon', 'Musk', 'Patchouli'],
    description: 'Fresh, clean, and allergen-free rain scent'
  },

  'skylar': {
    brand: 'Skylar',
    name: 'Vanilla Sky',
    price: '$78',
    image: 'https://cdn.shopify.com/s/files/1/0250/6781/products/VanillaSky_50ml_PDP_1_1200x.jpg',
    links: {
      official: 'https://www.skylar.com/products/vanilla-sky',
      amazon: `https://www.amazon.com/dp/B07X6NHRQP?tag=${AMAZON_ASSOCIATE_ID}`
    },
    notes: ['Vanilla', 'Capri Lemon', 'Salted Musk'],
    description: 'Hypoallergenic sweet vanilla citrus blend'
  },

  'phlur': {
    brand: 'Phlur',
    name: 'Missing Person',
    price: '$96',
    image: 'https://cdn.shopify.com/s/files/1/0555/9145/4425/files/MissingPerson_50ml_PDP_1.jpg',
    links: {
      sephora: 'https://www.sephora.com/product/missing-person-eau-de-parfum-P474920',
      official: 'https://www.phlur.com/products/missing-person'
    },
    notes: ['Bergamot', 'Jasmine', 'White Musk', 'Skin Musk'],
    description: 'Clean skin-like fragrance, vegan & cruelty-free'
  },

  // Date Night/Romantic
  'viktor rolf flowerbomb': {
    brand: 'Viktor & Rolf',
    name: 'Flowerbomb',
    price: '$95-168',
    image: 'https://m.media-amazon.com/images/I/71yMd5hU8JL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B000EMZFKA?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/flowerbomb-eau-de-parfum-P159714',
      ulta: 'https://www.ulta.com/p/flowerbomb-eau-de-parfum-xlsImpprod6481245'
    },
    notes: ['Jasmine', 'Rose', 'Freesia', 'Orchid', 'Patchouli'],
    description: 'Explosive floral bouquet, seductive and powerful'
  },

  'ysl black opium': {
    brand: 'Yves Saint Laurent',
    name: 'Black Opium',
    price: '$95-150',
    image: 'https://m.media-amazon.com/images/I/71pjVH9GQVL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B00K0X478I?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/black-opium-P393296',
      ulta: 'https://www.ulta.com/p/black-opium-eau-de-parfum-xlsImpprod12081055'
    },
    notes: ['Coffee', 'Vanilla', 'Orange Blossom', 'Jasmine', 'Patchouli'],
    description: 'Addictive coffee and vanilla seduction'
  },

  'marc jacobs daisy': {
    brand: 'Marc Jacobs',
    name: 'Daisy',
    price: '$68-132',
    image: 'https://m.media-amazon.com/images/I/71pxJZV8OkL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B001M08IPO?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/daisy-eau-de-toilette-P262109',
      ulta: 'https://www.ulta.com/p/daisy-eau-de-toilette-xlsImpprod5260141'
    },
    notes: ['Strawberry', 'Violet', 'Jasmine', 'Musk', 'Vanilla'],
    description: 'Fresh, youthful, and playfully romantic'
  },

  // Social/Crowd Pleasers
  'baccarat rouge 540': {
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540',
    price: '$325-415',
    image: 'https://m.media-amazon.com/images/I/61pPaI+4X8L._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B07B4GVQRN?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/baccarat-rouge-540-eau-de-parfum-P433461',
      nordstrom: 'https://www.nordstrom.com/s/maison-francis-kurkdjian-baccarat-rouge-540-eau-de-parfum/5158395'
    },
    notes: ['Saffron', 'Jasmine', 'Amberwood', 'Cedar', 'Ambergris'],
    description: 'Luxurious amber woody fragrance, highly recognizable'
  },

  'glossier you': {
    brand: 'Glossier',
    name: 'You',
    price: '$68',
    image: 'https://images.glossier.com/production/spree/images/attachments/000/003/563/portrait_normal/YOU_PDP_bottle_01.jpg',
    links: {
      official: 'https://www.glossier.com/products/glossier-you',
      amazon: `https://www.amazon.com/dp/B07B9GPT5B?tag=${AMAZON_ASSOCIATE_ID}`
    },
    notes: ['Pink Pepper', 'Iris', 'Ambrette', 'Ambrox'],
    description: 'Skin-like intimate musk, uniquely you'
  },

  'burberry her': {
    brand: 'Burberry',
    name: 'Her Eau de Parfum',
    price: '$85-134',
    image: 'https://m.media-amazon.com/images/I/71cUQN1sUJL._SL1500_.jpg',
    links: {
      amazon: `https://www.amazon.com/dp/B074Q5V5L1?tag=${AMAZON_ASSOCIATE_ID}`,
      sephora: 'https://www.sephora.com/product/her-eau-de-parfum-P428559',
      ulta: 'https://www.ulta.com/p/burberry-her-eau-de-parfum-pimprod2001283'
    },
    notes: ['Berries', 'Jasmine', 'Violet', 'Musk', 'Amber'],
    description: 'Fruity gourmand for the modern confident woman'
  }
};

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

// Generate fallback Amazon search link
function generateAmazonSearchLink(brand, name) {
  const query = encodeURIComponent(`${brand} ${name} perfume eau de parfum`);
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_ASSOCIATE_ID}`;
}

// Export for use in server
module.exports = {
  perfumeDatabase,
  findPerfume,
  generateAmazonSearchLink,
  AMAZON_ASSOCIATE_ID,
  SHARESALE_AFFILIATE_ID
};
