const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();
const { perfumeDatabase, findPerfume, generateAmazonSearchLink } = require('./perfume-database');

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

    // Create a detailed prompt for Claude
    const prompt = `Based on the following user preferences for perfume, recommend 5 specific perfumes that would be perfect for them. Include the brand name and perfume name.

User Preferences:
${JSON.stringify(answers, null, 2)}

IMPORTANT: Consider ALL types of perfumes including:
- Celebrity fragrances (Ariana Grande, Billie Eilish, Taylor Swift, Rihanna, etc.)
- Designer brands (Chanel, Dior, YSL, Gucci, Versace, etc.)
- Popular mainstream (Victoria's Secret, Bath & Body Works, etc.)
- Niche and luxury brands (Tom Ford, Jo Malone, etc.)

For YOUNG users (18-25) or those wanting TRENDY scents, prioritize:
- Ariana Grande (Cloud, Thank U Next, Sweet Like Candy, R.E.M.)
- Billie Eilish Fragrances
- Viktor&Rolf Flowerbomb
- Marc Jacobs Daisy
- Paco Rabanne Olympea
- Lancôme Idôle
- Prada Candy

Please analyze these preferences and recommend 5 perfumes. For each perfume, provide:
1. Brand and perfume name
2. Brief description (2-3 sentences)
3. Why it matches their preferences
4. Key notes

Format your response as a JSON array with this structure:
[
  {
    "brand": "Brand Name",
    "name": "Perfume Name",
    "description": "Description here",
    "why": "Why it matches",
    "notes": ["note1", "note2", "note3"]
  }
]`;

    // Try Claude 3 Haiku - most widely available and fastest
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
    const { perfumes } = req.body;
    
    // Validate input
    if (!perfumes || !Array.isArray(perfumes)) {
      return res.status(400).json({ 
        error: 'Invalid request: perfumes array required',
        results: []
      });
    }
    
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
        // Not in database - generate search links
        const amazonSearchLink = generateAmazonSearchLink(perfume.brand, perfume.name);
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
              platform: 'Amazon Search',
              url: amazonSearchLink,
              price: 'Search on Amazon'
            },
            {
              platform: 'Sephora Search',
              url: `https://www.sephora.com/search?keyword=${encodeURIComponent(perfume.brand + ' ' + perfume.name)}`,
              price: 'Search on Sephora'
            }
          ]
        };
      }
    });

    res.json({ results });
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
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG || 'yourtag-20';
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
