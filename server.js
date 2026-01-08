const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();
const { perfumeDatabase, findPerfume, generateAmazonSearchLink, generateAllMarketplaceLinks } = require('./perfume-database');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow your domain and common development origins
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.nota-life.com', 'https://nota-life.com']
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve testing suite
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/e2e-test-visual.html');
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Quiz questions
const questions = require('./questions.json');

// API Routes
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { answers } = req.body;

    // Create an advanced prompt for Claude with weighted algorithm
    const prompt = `## CONTEXT & ROLE
You are an expert perfume consultant with 15 years of experience matching fragrances to personalities. You understand fragrance families, notes chemistry, seasonal suitability, and lifestyle compatibility.

## CRITICAL: GENDER-SPECIFIC RECOMMENDATIONS

**IMPORTANT - READ CAREFULLY:**
The user has specified their gender. You MUST recommend perfumes that match their gender identity:

- If Male/Prefer not to say → Recommend MEN'S fragrances ONLY (masculine, unisex leaning masculine)
- If Female → Recommend WOMEN'S fragrances ONLY (feminine, unisex leaning feminine)  
- If Non-binary → Recommend UNISEX fragrances (truly gender-neutral)

**DO NOT recommend:**
- Female perfumes to male users
- Male cologne/perfumes to female users
- Gender-inappropriate fragrances

## MATCHING ALGORITHM

### STEP 1: Identify Hard Constraints (Must satisfy ALL)
- **GENDER (#1): ABSOLUTE PRIORITY - Never violate this**
- **BUDGET (#2): ABSOLUTE PRIORITY - NEVER EXCEED USER'S BUDGET**
  
  **BUDGET ENFORCEMENT RULES (Based on actual bottle price, NOT normalized):**
  * Under $50: ONLY recommend perfumes where ACTUAL PRICE is $30-$50. NO EXCEPTIONS.
    - ✅ ALLOWED: Ariana Grande Cloud ($40/30ml), Paco Rabanne 1 Million Lucky ($45/50ml), CK One ($35/100ml)
    - ❌ FORBIDDEN: Tom Ford (all $150+), Creed ($300+), Dior Sauvage ($80+), ANY designer above $50
  
  * $50-$100: ONLY recommend perfumes where ACTUAL PRICE is $50-$100. Max $110 if exceptional.
    - ✅ ALLOWED: Dior Sauvage ($85/100ml), Bleu de Chanel ($95/100ml), YSL Black Opium ($88/90ml)
    - ❌ FORBIDDEN: Tom Ford ($150+), Creed Aventus ($300+), Maison Margiela Replica ($135+)
  
  * $100-$200: ONLY recommend perfumes where ACTUAL PRICE is $100-$200. Max $220 if exceptional.
    - ✅ ALLOWED: Tom Ford ($150-180/50ml), Maison Margiela ($135/100ml), Le Labo ($165/50ml)
    - ❌ FORBIDDEN: Creed ($300+), Clive Christian ($500+), Roja Dove ($400+)
  
  * Over $200: Luxury range, go wild.
    - ✅ ALLOWED: Creed Aventus ($300+), Roja Dove, Clive Christian

  **VALUE CONSIDERATION:**
  Within the budget range, prioritize better value (lower price per ml) when matching other criteria is equal.
  Example: If two perfumes match 90%, prefer the one with better price/ml ratio.

  **IF YOU VIOLATE BUDGET, THE RECOMMENDATION IS REJECTED. STAY WITHIN RANGE.**

- Allergies: NEVER recommend perfumes with these ingredients
- Longevity needs: Match or exceed requested duration

### STEP 2: Core Preference Scoring (Weight: 40%)
Calculate compatibility score for:
- Preferred notes: +10 points per match
- Scent families: +15 points for primary family match
- Sweetness level: +10 points for exact match
- Intensity: +10 points for matching projection

### STEP 3: Lifestyle Fit (Weight: 35%)
- Occasions: +8 points per matching occasion
- Seasons: +10 points for seasonal match
- Age appropriateness: +12 points for trendy/age-suitable picks
- Personality alignment: +15 points for strong match

### STEP 4: Preference Signals (Weight: 15%)
- Brand style: +8 points for similar aesthetic
- Past favorites: +12 points for similar compositions
- Natural preference: +5 points for clean/natural options

### STEP 5: Strategic Diversity (Weight: 10%)
Ensure recommendations include:
- Different price points (if budget allows)
- Mix of designer + niche brands
- Variety in scent profiles
- One "safe" pick + one "adventurous" pick

### HARD EXCLUSIONS
If user rejected certain note categories, NEVER include them:
- If "Not for me" or "Not really" for woody notes: Exclude Sandalwood, Cedar, Oud, Vetiver
- If "Not for me" or "Not really" for spicy notes: Exclude Cinnamon, Pepper, Cardamom, Clove

## USER PREFERENCES
${JSON.stringify(answers, null, 2)}

## GENDER-SPECIFIC BRAND RECOMMENDATIONS BY BUDGET

### FOR MALE USERS:

**UNDER $50 BUDGET:**
MUST recommend from:
- Paco Rabanne 1 Million Lucky ($40-45)
- Calvin Klein CK One ($30-35)
- Nautica Voyage ($25-30)
- Versace Dylan Blue ($45-50)
- Azzaro Wanted ($40-45)
- Burberry Touch ($35-40)

**$50-$100 BUDGET:**
MUST recommend from:
- Dior Sauvage ($80-90)
- Bleu de Chanel ($90-100)
- Versace Eros ($70-80)
- Paco Rabanne 1 Million ($65-75)
- Acqua di Gio ($70-85)
- YSL La Nuit de L'Homme ($75-85)
- Armani Code ($80-90)
- Jean Paul Gaultier Le Male ($60-70)

**$100-$200 BUDGET:**
- Tom Ford Oud Wood ($150-180)
- Tom Ford Noir Extreme ($140-160)
- Maison Margiela Replica Jazz Club ($135-150)
- Le Labo Santal 33 ($165-180)

**NEVER recommend for males:** Flowerbomb, Daisy, Black Opium, women's fragrances

AVOID for males: Flowerbomb, anything marketed to women

### FOR FEMALE USERS:

**UNDER $50 BUDGET:**
MUST recommend from:
- Ariana Grande Cloud ($35-40)
- Britney Spears Fantasy ($25-30)
- Elizabeth Arden Green Tea ($20-25)
- Pacifica Persian Rose ($35-40)
- Body Fantasies Signature ($15-20)
- Juicy Couture Viva La Juicy ($40-45)

**$50-$100 BUDGET:**
MUST recommend from:
- Viktor&Rolf Flowerbomb ($90-100)
- Marc Jacobs Daisy ($85-95)
- YSL Black Opium ($85-95)
- Prada Candy ($80-90)
- Lancôme Idôle ($75-85)
- Chloe Eau de Parfum ($95-100)
- Dolce & Gabbana Light Blue ($70-80)

**$100-$200 BUDGET:**
- Chanel Coco Mademoiselle ($135-150)
- Dior J'adore ($120-140)
- Tom Ford Lost Cherry ($150-180)
- Maison Margiela Replica By the Fireplace ($135-150)

**NEVER recommend for females:** Sauvage, male colognes, Bleu de Chanel

AVOID for females: Sauvage, male cologne brands

## OUTPUT REQUIREMENTS

For each of the 5 recommendations, provide:

{
  "brand": "Dior",
  "name": "Sauvage",
  "matchPercentage": 95,
  
  "personalityNarrative": "Your confident and bold personality finds its perfect expression in this iconic masculine scent. Fresh yet powerful.",
  
  "whyPerfect": [
    "✓ Fresh bergamot and pepper - perfect for active lifestyle",
    "✓ Strong projection for daily confidence",
    "✓ Woody base matches your masculine profile",
    "✓ Versatile for work and evening"
  ],
  
  "notesBreakdown": {
    "top": ["Bergamot", "Pepper"],
    "heart": ["Lavender", "Geranium"],
    "base": ["Ambroxan", "Cedar", "Patchouli"]
  },
  
  "commercialDetails": {
    "price": "$85",
    "size": "100ml",
    "pricePerMl": "$0.85",
    "normalizedPrice50ml": "$42.50",
    "longevity": "8-10 hours",
    "sillage": "Strong",
    "bestFor": "Daily wear, Office, Evening"
  },
  
  "sampleOption": {
    "available": true,
    "price": "$12",
    "message": "Try before you buy"
  },
  
  "urgencyTrigger": "Limited stock",
  
  "trustSignals": [
    "Authentic guarantee",
    "Free returns"
  ],
  
  "socialProof": {
    "rating": "4.5/5",
    "reviewCount": "25,432",
    "popularityRank": "Top 3 men's fragrance"
  },
  
  "similarTo": "If you like Bleu de Chanel, this is bolder"
}

**IMPORTANT PRICING NOTES:**
- "price": The ACTUAL retail price for the bottle size listed
- "size": The bottle size (e.g., "50ml", "100ml", "30ml")
- "pricePerMl": price ÷ size (calculate this accurately)
- "normalizedPrice50ml": pricePerMl × 50 (so users can compare all perfumes at same size)

**Example calculations:**
- Dior Sauvage 100ml at $85: pricePerMl = $0.85, normalizedPrice50ml = $42.50
- Tom Ford 50ml at $165: pricePerMl = $3.30, normalizedPrice50ml = $165.00
- Ariana Grande Cloud 30ml at $40: pricePerMl = $1.33, normalizedPrice50ml = $66.50

This normalized pricing helps users compare value fairly!

## DIVERSITY REQUIREMENTS

Your 5 recommendations MUST include:
1. One "Safe/Crowd-pleaser" (broad appeal)
2. One "Signature/Unique" (stands out)
3. One "Value Champion" (best bang for buck)
4. One "Trendy/Current" (popular now)
5. One "Wildcard" (slightly different but compatible)

## TONE & STYLE

Write as a knowledgeable friend:
- Use sensory language: "Opens with fresh bergamot, dries down to warm cedar"
- Connect to their life: "Perfect for confident professionals"
- Be specific and gender-appropriate

## FINAL CHECKLIST - BEFORE YOU OUTPUT, VERIFY:
- [ ] **ALL 5 perfumes match user's gender (CRITICAL)**
- [ ] **ALL 5 perfumes are within budget range (CRITICAL)**
  * Under $50 → Check EVERY price is $30-$50
  * $50-$100 → Check EVERY price is $50-$110 max
  * $100-$200 → Check EVERY price is $100-$220 max
- [ ] **NO Tom Ford if budget under $100**
- [ ] **NO Creed if budget under $200**
- [ ] None contain allergy ingredients
- [ ] Match percentages follow the algorithm
- [ ] Includes brand diversity
- [ ] Recommendations ordered highest → lowest match

**IF ANY PERFUME VIOLATES BUDGET, REJECT IT AND PICK ANOTHER ONE IN BUDGET.**

Output ONLY valid JSON array, no other text. Format:
[{"brand":"...","name":"...","matchPercentage":95,"personalityNarrative":"...","whyPerfect":[...],"notesBreakdown":{...},"commercialDetails":{...},"socialProof":{...},"similarTo":"..."}]`;

    // Use Claude 3 Haiku - proven to work with your API key
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,  // Haiku maximum
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the response
    let recommendations = [];
    try {
      const content = message.content[0].text;
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
        
        // Handle missing data fields gracefully
        recommendations = recommendations.map(perfume => ({
          ...perfume,
          // Ensure basic fields exist
          description: perfume.description || perfume.personalityNarrative || "A beautiful fragrance",
          why: perfume.why || (perfume.whyPerfect ? perfume.whyPerfect.join(' ') : "Matches your preferences"),
          notes: perfume.notes || (perfume.notesBreakdown ? 
            [...(perfume.notesBreakdown.top || []), 
             ...(perfume.notesBreakdown.heart || []), 
             ...(perfume.notesBreakdown.base || [])].slice(0, 5) 
            : []),
          // Add fallbacks for new fields
          socialProof: perfume.socialProof || {
            rating: "Highly rated",
            popularityRank: "Popular choice for your profile"
          },
          commercialDetails: perfume.commercialDetails || {
            longevity: "Moderate",
            sillage: "Moderate"
          }
        }));
      } else {
        // If no JSON found, parse text response
        recommendations = parseTextRecommendations(content);
      }
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      recommendations = parseTextRecommendations(message.content[0].text);
    }

    res.json({
      recommendations,
      rawResponse: message.content[0].text
    });
  } catch (error) {
    console.error('Error analyzing preferences:', error);
    res.status(500).json({ error: 'Failed to analyze preferences' });
  }
});

app.post('/api/search-affiliates', async (req, res) => {
  try {
    const { perfumes, country } = req.body;
    
    // Validate input
    if (!perfumes || !Array.isArray(perfumes)) {
      return res.status(400).json({ 
        error: 'Invalid request: perfumes array required',
        results: []
      });
    }
    
    // Determine user's country (default to US if not provided)
    const userCountry = (country || 'US').toUpperCase();
    const isCanada = userCountry === 'CA';
    
    console.log(`🌍 Generating links for country: ${userCountry}`);
    
    const results = perfumes.map(perfume => {
      const productData = findPerfume(perfume.brand, perfume.name);
      
      if (productData) {
        // Found in database - return full data with real links
        return {
          brand: productData.brand,
          name: productData.name,
          description: perfume.description || productData.description,
          why: perfume.why,
          notes: perfume.notes || productData.notes,
          price: productData.price,
          image: productData.image,
          affiliateLinks: Object.entries(productData.links).map(([platform, url]) => ({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            url: url,
            price: productData.price
          }))
        };
      } else {
        // Not in database - generate search links based on user's country
        const amazonLink = generateAmazonSearchLink(perfume.brand, perfume.name, userCountry);
        
        // Determine appropriate Sephora link
        const sephoraUrl = isCanada
          ? `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(perfume.brand + ' ' + perfume.name)}`
          : `https://www.sephora.com/search?keyword=${encodeURIComponent(perfume.brand + ' ' + perfume.name)}`;
        
        return {
          brand: perfume.brand,
          name: perfume.name,
          description: perfume.description,
          why: perfume.why,
          notes: perfume.notes || [],
          price: 'Check retailer',
          image: null,
          affiliateLinks: [
            {
              platform: isCanada ? 'Amazon Canada' : 'Amazon',
              url: amazonLink,
              price: isCanada ? 'Search on Amazon.ca' : 'Search on Amazon.com',
              country: userCountry
            },
            {
              platform: 'Sephora',
              url: sephoraUrl,
              price: 'Search on Sephora'
            }
          ]
        };
      }
    });

    res.json({ results, country: userCountry });
  } catch (error) {
    console.error('Error searching affiliates:', error);
    res.status(500).json({ 
      error: 'Failed to search affiliate links',
      results: []
    });
  }
});

// Helper functions
function parseTextRecommendations(text) {
  // Fallback parser for non-JSON responses
  const recommendations = [];
  const lines = text.split('\n');
  let current = {};

  for (const line of lines) {
    if (line.includes('Brand:') || line.includes('brand:')) {
      if (current.brand) recommendations.push(current);
      current = { brand: line.split(':')[1].trim() };
    } else if (line.includes('Name:') || line.includes('name:')) {
      current.name = line.split(':')[1].trim();
    } else if (line.includes('Description:') || line.includes('description:')) {
      current.description = line.split(':')[1].trim();
    }
  }

  if (current.brand) recommendations.push(current);
  return recommendations.length > 0 ? recommendations : [
    {
      brand: "Chanel",
      name: "Coco Mademoiselle",
      description: "A classic elegant perfume with fresh and modern notes",
      why: "Matches your preference for sophisticated scents",
      notes: ["Orange", "Jasmine", "Patchouli"]
    }
  ];
}

async function searchAmazon(query) {
  // Simplified Amazon affiliate link generator
  // In production, use Amazon Product Advertising API
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG || 'nota0c-20';
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${associateTag}`;
  return searchUrl;
}

async function searchShareASale(query) {
  // Simplified ShareASale implementation
  // In production, implement proper ShareASale API calls
  const affiliateId = process.env.SHARESALE_AFFILIATE_ID || 'youraffid';
  
  return [
    {
      platform: 'ShareASale',
      url: `https://www.shareasale.com/r.cfm?b=123456&u=${affiliateId}&m=12345&urllink=${encodeURIComponent(query)}`,
      price: 'Check Price'
    }
  ];
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ NOTA Life Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🚀 Railway: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
