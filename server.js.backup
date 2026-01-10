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

// URL Shortening endpoint
app.post('/api/shorten-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Use TinyURL API (free, no key required)
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = response.data;
      
      if (shortUrl && shortUrl.startsWith('http')) {
        return res.json({ 
          shortUrl: shortUrl,
          originalUrl: url,
          service: 'tinyurl'
        });
      }
    } catch (tinyUrlError) {
      console.error('TinyURL error:', tinyUrlError.message);
    }
    
    // Fallback: Return original URL
    res.json({ 
      shortUrl: url,
      originalUrl: url,
      service: 'fallback'
    });
    
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      error: 'Failed to shorten URL',
      shortUrl: req.body.url // Fallback to original URL
    });
  }
});

// Share image endpoint (stores base64 image temporarily)
app.post('/api/share-image', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    
    // For now, return the data URL itself
    // In production, you would:
    // 1. Decode base64
    // 2. Save to cloud storage (AWS S3, Cloudinary, etc.)
    // 3. Return public URL
    
    // Simple implementation: return data URL
    res.json({ 
      imageUrl: imageData,
      stored: false,
      message: 'Using data URL (upgrade to cloud storage for production)'
    });
    
    // TODO: Implement cloud storage
    // Example with Cloudinary:
    // const cloudinary = require('cloudinary').v2;
    // const uploadResult = await cloudinary.uploader.upload(imageData);
    // res.json({ imageUrl: uploadResult.secure_url, stored: true });
    
  } catch (error) {
    console.error('Error processing share image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { answers } = req.body;

    // Create an advanced prompt for Claude with weighted algorithm
    const prompt = `## CONTEXT & ROLE
You are an expert perfume consultant with 15 years of experience matching fragrances to personalities. You understand fragrance families, notes chemistry, seasonal suitability, and lifestyle compatibility.

## 🚨 CRITICAL: GENDER-SPECIFIC RECOMMENDATIONS - ABSOLUTE RULE #1 🚨

**THIS IS THE #1 PRIORITY - VIOLATING THIS REJECTS THE ENTIRE RECOMMENDATION**

The user's gender is: ${answers[1] || 'Not specified'}

**MANDATORY GENDER MATCHING RULES:**

### HOW TO IDENTIFY GENDER MARKETING:

**MEN'S FRAGRANCES are typically:**
- Marketed with masculine imagery (suits, sports, power, adventure)
- Labeled as "Eau de Toilette" or "Cologne"  
- Found in men's fragrance sections
- Have bold, woody, spicy, aquatic profiles
- Examples of MALE BRANDS: Dior Homme line, Bleu de Chanel line, Versace Dylan Blue/Eros, Paco Rabanne 1 Million line, Acqua di Gio line, Tom Ford Oud Wood

**WOMEN'S FRAGRANCES are typically:**
- Marketed with feminine imagery (flowers, romance, elegance)
- Labeled as "Eau de Parfum" for women
- Found in women's fragrance sections  
- Have floral, fruity, sweet, gourmand profiles
- Examples of FEMALE BRANDS: Viktor&Rolf Flowerbomb, Marc Jacobs Daisy, YSL Black Opium, Ariana Grande, Lancôme Idôle

**UNISEX FRAGRANCES:**
- Explicitly marketed as unisex/gender-neutral
- CK One, Le Labo, some Maison Margiela Replica, Tom Ford Private Blend (some)

### MATCHING RULES:

**IF USER IS FEMALE (${answers[1] === 'Female' ? '← THIS USER' : ''}):**
✅ ONLY recommend perfumes marketed to women
❌ NEVER recommend perfumes from men's lines/departments
❌ If a perfume is sold in the men's section → DO NOT RECOMMEND
❌ If a perfume has "for men" or masculine marketing → DO NOT RECOMMEND

**IF USER IS MALE (${answers[1] === 'Male' ? '← THIS USER' : ''}):**
✅ ONLY recommend cologne/perfumes marketed to men
❌ NEVER recommend perfumes from women's lines/departments
❌ If a perfume is sold in the women's section → DO NOT RECOMMEND
❌ If a perfume has "for women" or feminine marketing → DO NOT RECOMMEND

**IF USER IS NON-BINARY:**
✅ ONLY recommend explicitly unisex fragrances

### VERIFICATION BEFORE OUTPUT:
For EACH of your 5 recommendations, ask yourself:
1. "Is this perfume sold in the men's or women's department?"
2. "Does the marketing match the user's gender?"
3. "Would this perfume be found in the correct section of a department store?"

**IF ANY PERFUME IS GENDER-INAPPROPRIATE → REJECT IT AND CHOOSE ANOTHER**

## MATCHING ALGORITHM

### STEP 1: Identify Hard Constraints (Must satisfy ALL)
- **GENDER (#1): ABSOLUTE PRIORITY - NEVER VIOLATE THIS OR ENTIRE OUTPUT IS INVALID**
  * Ask yourself: "Would I find this perfume in the [men's/women's] section?"
  * Female users: Recommend ONLY from women's fragrance departments
  * Male users: Recommend ONLY from men's fragrance departments
  * Double-check the marketing category of EACH perfume
  
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

## GENDER-SPECIFIC BRAND GUIDANCE (Examples, not exhaustive)

### 👨 TYPICAL MEN'S FRAGRANCE LINES:

**Budget-Friendly ($30-50):**
- Paco Rabanne 1 Million line, Calvin Klein CK One/Eternity, Nautica Voyage, Versace Dylan Blue, Azzaro Wanted, Burberry Touch

**Mid-Range ($50-100):**
- Dior Sauvage/Homme line, Bleu de Chanel, Versace Eros, Paco Rabanne lines, Acqua di Gio, YSL La Nuit de L'Homme, Armani Code, Jean Paul Gaultier Le Male

**Premium ($100+):**
- Tom Ford Oud Wood/Noir line, Maison Margiela Replica (masculine), Le Labo (some)

**KEY:** These are found in MEN'S fragrance sections

---

### 👩 TYPICAL WOMEN'S FRAGRANCE LINES:

**Budget-Friendly ($30-50):**
- Ariana Grande Cloud/Thank U Next, Britney Spears Fantasy, Elizabeth Arden, Pacifica, Body Fantasies, Juicy Couture

**Mid-Range ($50-100):**
- Viktor&Rolf Flowerbomb, Marc Jacobs Daisy, YSL Black Opium/Mon Paris, Prada Candy, Lancôme Idôle/La Vie Est Belle, Chloe, Dolce & Gabbana Light Blue

**Premium ($100+):**
- Chanel Coco Mademoiselle/Chance, Dior J'adore/Miss Dior, Tom Ford Lost Cherry (women's line), Maison Margiela Replica (feminine scents)

**KEY:** These are found in WOMEN'S fragrance sections

---

**IMPORTANT:** These are EXAMPLES to help you understand gender marketing. You can recommend OTHER perfumes as long as they match the user's gender identity and are marketed to that gender.

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

## 🚨 FINAL VERIFICATION CHECKLIST - MANDATORY BEFORE OUTPUT 🚨

**STEP 1: VERIFY GENDER (DO THIS FIRST!)**
User's gender: ${answers[1] || 'CHECK ANSWERS'}

Go through EACH of your 5 recommendations:
1. ${answers[1] === 'Female' ? '❌ Is this Sauvage/Bleu de Chanel/Eros/male cologne? → REJECT!' : ''}
   ${answers[1] === 'Male' ? '❌ Is this Flowerbomb/Daisy/Black Opium/female perfume? → REJECT!' : ''}
2. Same check for recommendation #2
3. Same check for recommendation #3
4. Same check for recommendation #4
5. Same check for recommendation #5

**IF EVEN ONE PERFUME VIOLATES GENDER → START OVER WITH ALL 5 RECOMMENDATIONS**

**STEP 2: VERIFY BUDGET**
- [ ] Under $50 → Check EVERY price is $30-$50
- [ ] $50-$100 → Check EVERY price is $50-$110 max
- [ ] $100-$200 → Check EVERY price is $100-$220 max
- [ ] **NO Tom Ford if budget under $100**
- [ ] **NO Creed if budget under $200**

**STEP 3: OTHER CHECKS**
- [ ] None contain allergy ingredients
- [ ] Match percentages follow the algorithm
- [ ] Includes brand diversity
- [ ] Recommendations ordered highest → lowest match

**IF ANY CHECK FAILS, REJECT THAT PERFUME AND PICK ANOTHER ONE.**

Output ONLY valid JSON array, no other text. Format:
[{"brand":"...","name":"...","matchPercentage":95,"personalityNarrative":"...","whyPerfect":[...],"notesBreakdown":{...},"commercialDetails":{...},"socialProof":{...},"similarTo":"..."}]`;

    // Use Claude 3 Haiku - Only model available on your API key
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
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
        
        // 🚨 BACKEND GENDER FILTERING - Because Haiku doesn't follow instructions well
        const userGender = answers[1];
        
        // Define known male fragrances
        const maleBrands = ['Sauvage', 'Bleu de Chanel', 'Eros', 'Acqua di Gio', 'Oud Wood', '1 Million', 'Le Male', 'Armani Code', 'La Nuit'];
        
        // Define known female fragrances  
        const femaleBrands = ['Flowerbomb', 'Daisy', 'Black Opium', 'Cloud', 'Idôle', 'Candy', 'J\'adore', 'Coco Mademoiselle', 'La Vie Est Belle'];
        
        recommendations = recommendations.filter(perfume => {
          const perfumeName = `${perfume.brand} ${perfume.name}`;
          const isMaleFragrance = maleBrands.some(brand => perfumeName.includes(brand));
          const isFemaleFragrance = femaleBrands.some(brand => perfumeName.includes(brand));
          
          // Filter based on user gender
          if (userGender === 'Female' && isMaleFragrance) {
            console.log(`🚫 Filtered out MALE perfume for FEMALE user: ${perfumeName}`);
            return false;
          }
          
          if (userGender === 'Male' && isFemaleFragrance) {
            console.log(`🚫 Filtered out FEMALE perfume for MALE user: ${perfumeName}`);
            return false;
          }
          
          return true;
        });
        
        // Log filtering results
        console.log(`✅ Gender filtering complete. ${recommendations.length} perfumes passed.`);
        
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

// ============================================
// REFERRAL SYSTEM ENDPOINTS
// ============================================

// In-memory storage for referrals (upgrade to database in production)
const referrals = new Map();
const referralClicks = [];

// In-memory storage for email captures
const emailCaptures = [];

// Email capture endpoint
app.post('/api/capture-email', (req, res) => {
  try {
    const { email, timestamp, answers } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    // Store email capture
    emailCaptures.push({
      email,
      timestamp: timestamp || Date.now(),
      hasAnswers: !!answers,
      capturedAt: new Date().toISOString()
    });
    
    console.log('📧 Email captured:', email);
    console.log('📊 Total emails captured:', emailCaptures.length);
    
    res.json({ 
      success: true,
      message: 'Email captured successfully'
    });
  } catch (error) {
    console.error('Error capturing email:', error);
    res.status(500).json({ error: 'Failed to capture email' });
  }
});

// Get email statistics (optional - for admin)
app.get('/api/email-stats', (req, res) => {
  res.json({
    totalEmails: emailCaptures.length,
    recentCaptures: emailCaptures.slice(-10).reverse()
  });
});

// Generate referral code
app.post('/api/referral/generate', (req, res) => {
  try {
    const { userId, referralCode, userName } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code required' });
    }
    
    // Check if code already exists
    if (referrals.has(referralCode)) {
      return res.json({ 
        referralCode: referralCode,
        message: 'Code already exists'
      });
    }
    
    // Create new referral
    referrals.set(referralCode, {
      userId: userId || 'anonymous',
      referralCode: referralCode,
      userName: userName || 'User',
      clicks: 0,
      signups: 0,
      createdAt: Date.now(),
      lastClickedAt: null
    });
    
    console.log('✅ Referral code generated:', referralCode);
    
    res.json({
      referralCode: referralCode,
      message: 'Referral code created successfully'
    });
  } catch (error) {
    console.error('Error generating referral code:', error);
    res.status(500).json({ error: 'Failed to generate referral code' });
  }
});

// Track referral click
app.post('/api/referral/track-click', (req, res) => {
  try {
    const { referralCode, clickedAt, userAgent } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code required' });
    }
    
    // Get referral
    const referral = referrals.get(referralCode);
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral code not found' });
    }
    
    // Update click count
    referral.clicks += 1;
    referral.lastClickedAt = clickedAt || Date.now();
    
    // Store click details
    referralClicks.push({
      referralCode: referralCode,
      clickedAt: clickedAt || Date.now(),
      userAgent: userAgent || 'unknown',
      ipAddress: req.ip || 'unknown',
      converted: false
    });
    
    console.log('📊 Referral click tracked:', referralCode, 'Total clicks:', referral.clicks);
    
    res.json({
      success: true,
      clicks: referral.clicks
    });
  } catch (error) {
    console.error('Error tracking referral click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track referral signup
app.post('/api/referral/track-signup', (req, res) => {
  try {
    const { referralCode, referredUserId, signupAt, conversionTime } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code required' });
    }
    
    // Get referral
    const referral = referrals.get(referralCode);
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral code not found' });
    }
    
    // Update signup count
    referral.signups += 1;
    
    // Mark last click as converted
    const lastClick = referralClicks.reverse().find(c => c.referralCode === referralCode && !c.converted);
    if (lastClick) {
      lastClick.converted = true;
    }
    referralClicks.reverse(); // Restore original order
    
    console.log('🎉 Referral signup tracked:', referralCode, 'Total signups:', referral.signups);
    
    res.json({
      success: true,
      signups: referral.signups,
      conversionTime: conversionTime || 0
    });
  } catch (error) {
    console.error('Error tracking referral signup:', error);
    res.status(500).json({ error: 'Failed to track signup' });
  }
});

// Get referral statistics
app.get('/api/referral/stats/:code', (req, res) => {
  try {
    const referralCode = req.params.code;
    
    const referral = referrals.get(referralCode);
    
    if (!referral) {
      // Return zeros for new users
      return res.json({
        referralCode: referralCode,
        clicks: 0,
        signups: 0,
        message: 'No stats yet - start sharing!'
      });
    }
    
    res.json({
      referralCode: referral.referralCode,
      clicks: referral.clicks,
      signups: referral.signups,
      createdAt: referral.createdAt,
      lastClickedAt: referral.lastClickedAt
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get all referral analytics (admin endpoint)
app.get('/api/referral/analytics', (req, res) => {
  try {
    const totalReferrals = referrals.size;
    const totalClicks = Array.from(referrals.values()).reduce((sum, r) => sum + r.clicks, 0);
    const totalSignups = Array.from(referrals.values()).reduce((sum, r) => sum + r.signups, 0);
    const conversionRate = totalClicks > 0 ? ((totalSignups / totalClicks) * 100).toFixed(2) : 0;
    
    res.json({
      totalReferrals: totalReferrals,
      totalClicks: totalClicks,
      totalSignups: totalSignups,
      conversionRate: conversionRate + '%',
      topReferrers: Array.from(referrals.values())
        .sort((a, b) => (b.clicks + b.signups) - (a.clicks + a.signups))
        .slice(0, 10)
        .map(r => ({
          referralCode: r.referralCode,
          userName: r.userName,
          clicks: r.clicks,
          signups: r.signups,
          total: r.clicks + r.signups
        }))
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

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
  console.log(`📧 Email Capture Mode: ${process.env.EMAIL_CAPTURE_MODE || 'always (default)'}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🚀 Railway: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});

// API endpoint to get email capture configuration
app.get('/api/config/email-capture', (req, res) => {
  const mode = process.env.EMAIL_CAPTURE_MODE || 'always';
  res.json({ 
    mode: mode.toLowerCase(),
    description: getEmailCaptureDescription(mode)
  });
});

function getEmailCaptureDescription(mode) {
  const lowerMode = mode.toLowerCase();
  if (lowerMode === 'always') return 'Email capture shows on every quiz completion';
  if (lowerMode === 'never') return 'Email capture disabled';
  const days = parseInt(mode);
  if (!isNaN(days)) return `Email capture shows again after ${days} days`;
  return 'Email capture shows on every quiz completion (default)';
}

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
